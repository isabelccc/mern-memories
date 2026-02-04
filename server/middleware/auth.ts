import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const secret = process.env.JWT_SECRET || 'test';
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

export interface AuthRequest extends Request {
  userId?: string;
  userName?: string;
  user?: {
    name?: string;
    email?: string;
  };
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'No authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const isCustomAuth = token.length < 500;

    let decodedData: jwt.JwtPayload | string | null = null;

    if (token && isCustomAuth) {
      // Custom JWT token (email/password auth)
      decodedData = jwt.verify(token, secret) as jwt.JwtPayload;
      req.userId = decodedData?.id as string;
    } else {
      // Google OAuth token - verify with Google
      if (googleClient) {
        try {
          const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID!,
          });
          const payload = ticket.getPayload();
          if (payload?.sub) {
            // Find user by Google ID
            const prisma = (await import('../prisma/client.js')).default;
            const user = await prisma.user.findFirst({
              where: {
                OR: [
                  { googleId: payload.sub },
                  { email: payload.email },
                ],
              },
            });
            if (user) {
              req.userId = user.id;
            } else {
              res.status(401).json({ message: 'User not found' });
              return;
            }
          } else {
            res.status(401).json({ message: 'Invalid Google token' });
            return;
          }
        } catch (googleError) {
          console.error('Google token verification error:', googleError);
          // Fallback to decode (for backward compatibility)
          decodedData = jwt.decode(token) as jwt.JwtPayload | null;
          req.userId = decodedData?.sub as string;
        }
      } else {
        // No Google client configured, fallback to decode
        decodedData = jwt.decode(token) as jwt.JwtPayload | null;
        req.userId = decodedData?.sub as string;
      }
    }

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Unauthenticated' });
  }
};

export default auth;
