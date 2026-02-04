import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

import prisma from '../prisma/client.js';

dotenv.config();

const secret = process.env.JWT_SECRET || 'test';

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface SigninBody {
  email: string;
  password: string;
}

interface SignupBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const signin = async (req: Request<{}, {}, SigninBody>, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const oldUser = await prisma.user.findUnique({ where: { email } });

    if (!oldUser) {
      res.status(404).json({ message: "User doesn't exist" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, { expiresIn: '1h' });

    res.status(200).json({ result: oldUser, token });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Signin error:', error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
};

export const signup = async (req: Request<{}, {}, SignupBody>, res: Response): Promise<void> => {
  const { email, password, firstName, lastName } = req.body;

  try {
    console.log('Signup request received:', { email, firstName, lastName, hasPassword: !!password });

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      console.log('Validation failed: Missing required fields');
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Validation failed: Password too short');
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const oldUser = await prisma.user.findUnique({ where: { email } });

    if (oldUser) {
      console.log('Signup failed: User already exists');
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
      },
    });

    const token = jwt.sign({ email: result.email, id: result.id }, secret, { expiresIn: '1h' });

    console.log('Signup successful for:', email);
    res.status(201).json({ result, token });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Signup error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
};

interface GoogleSignInBody {
  tokenId: string;
}

export const googleSignIn = async (req: Request<{}, {}, GoogleSignInBody>, res: Response): Promise<void> => {
  const { tokenId } = req.body;

  try {
    if (!tokenId) {
      res.status(400).json({ message: 'Google token is required' });
      return;
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      res.status(500).json({ message: 'Google OAuth not configured on server' });
      return;
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).json({ message: 'Invalid Google token' });
      return;
    }

    const { sub: googleId, email, name } = payload;

    if (!email || !name || !googleId) {
      res.status(400).json({ message: 'Missing required user information from Google' });
      return;
    }

    // Check if user exists with this Google ID or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId },
          { email },
        ],
      },
    });

    if (user) {
      // Update user if they signed in with email before and now using Google
      if (!user.googleId && googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
          password: '', // Google users don't have passwords
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email, id: user.id }, secret, { expiresIn: '1h' });

    res.status(200).json({
      result: {
        _id: user.id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
      },
      token,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Google sign in error:', err);
    res.status(500).json({ message: err.message || 'Google authentication failed' });
  }
};
