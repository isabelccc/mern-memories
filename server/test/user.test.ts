/// <reference types="jest" />

import { Request, Response } from 'express';
import { signin, signup } from '../controllers/user';
import prisma from '../prisma/client';

// Mock Prisma
jest.mock('../prisma/client');

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('User Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    
    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };

    jest.clearAllMocks();
  });

  describe('signin', () => {
    it('should return 400 if email or password is missing', async () => {
      mockRequest = {
        body: {},
      };

      await signin(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Email and password are required',
      });
    });

    it('should return 404 if user does not exist', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await signin(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        message: "User doesn't exist",
      });
    });

    it('should return 400 if password is incorrect', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        googleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      
      // Mock bcrypt.compare to return false
      jest.doMock('bcryptjs', () => ({
        compare: jest.fn().mockResolvedValue(false),
      }));

      await signin(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });
  });

  describe('signup', () => {
    it('should return 400 if required fields are missing', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com',
        },
      };

      await signup(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'All fields are required',
      });
    });

    it('should return 400 if email format is invalid', async () => {
      mockRequest = {
        body: {
          email: 'invalid-email',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        },
      };

      await signup(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Invalid email format',
      });
    });

    it('should return 400 if password is too short', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: '12345',
          firstName: 'Test',
          lastName: 'User',
        },
      };

      await signup(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Password must be at least 6 characters',
      });
    });

    it('should return 400 if user already exists', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        },
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        googleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await signup(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'User already exists',
      });
    });
  });
});
