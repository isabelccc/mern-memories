/// <reference types="jest" />

import { Request, Response } from 'express';
import { getPosts, getPostsByCreator, getPost, createPost } from '../controllers/posts';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma/client';

// Mock Prisma
jest.mock('../prisma/client');

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Posts Controller', () => {
  let mockRequest: Partial<Request>;
  let mockAuthRequest: Partial<AuthRequest>;
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

  describe('getPosts', () => {
    it('should return paginated posts', async () => {
      mockRequest = {
        query: { page: '1' },
      };

      const mockPosts = [
        {
          id: '1',
          title: 'Test Post 1',
          message: 'Test message 1',
          name: 'Test User',
          creator: 'user1',
          tags: ['test'],
          selectedFile: null,
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          comments: [],
        },
        {
          id: '2',
          title: 'Test Post 2',
          message: 'Test message 2',
          name: 'Test User',
          creator: 'user1',
          tags: ['test'],
          selectedFile: null,
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          comments: [],
        },
      ];

      mockPrisma.post.count = jest.fn().mockResolvedValue(2);
      mockPrisma.post.findMany = jest.fn().mockResolvedValue(mockPosts);

      await getPosts(mockRequest as Request, mockResponse as Response);

      expect(mockPrisma.post.count).toHaveBeenCalled();
      expect(mockPrisma.post.findMany).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            _id: '1',
            title: 'Test Post 1',
          }),
        ]),
        currentPage: 1,
        numberOfPages: 1,
      });
    });
  });

  describe('getPostsByCreator', () => {
    it('should return posts by creator name', async () => {
      mockRequest = {
        query: { name: 'Test User' },
      };

      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          message: 'Test message',
          name: 'Test User',
          creator: 'user1',
          tags: ['test'],
          selectedFile: null,
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          comments: [],
        },
      ];

      mockPrisma.post.findMany = jest.fn().mockResolvedValue(mockPosts);

      await getPostsByCreator(mockRequest as Request, mockResponse as Response);

      expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
        where: { name: 'Test User' },
        include: {
          comments: {
            include: { replies: true },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(responseJson).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            _id: '1',
            name: 'Test User',
          }),
        ]),
      });
    });
  });

  describe('getPost', () => {
    it('should return a single post by id', async () => {
      mockRequest = {
        params: { id: '1' },
      };

      const mockPost = {
        id: '1',
        title: 'Test Post',
        message: 'Test message',
        name: 'Test User',
        creator: 'user1',
        tags: ['test'],
        selectedFile: null,
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
      };

      mockPrisma.post.findUnique = jest.fn().mockResolvedValue(mockPost);

      await getPost(mockRequest as Request<{ id: string }>, mockResponse as Response);

      expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          comments: {
            include: {
              replies: {
                orderBy: { createdAt: 'asc' },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: '1',
          title: 'Test Post',
        })
      );
    });

    it('should return 404 if post not found', async () => {
      mockRequest = {
        params: { id: '999' },
      };

      mockPrisma.post.findUnique = jest.fn().mockResolvedValue(null);

      await getPost(mockRequest as Request<{ id: string }>, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Post not found',
      });
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      mockAuthRequest = {
        body: {
          title: 'New Post',
          message: 'New message',
          tags: ['new'],
          selectedFile: null,
          name: 'Test User',
        },
        userId: 'user1',
      };

      const mockCreatedPost = {
        id: '1',
        title: 'New Post',
        message: 'New message',
        name: 'Test User',
        creator: 'user1',
        tags: ['new'],
        selectedFile: null,
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
      };

      mockPrisma.post.create = jest.fn().mockResolvedValue(mockCreatedPost);

      await createPost(mockAuthRequest as AuthRequest, mockResponse as Response);

      expect(mockPrisma.post.create).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: '1',
          title: 'New Post',
        })
      );
    });

    it('should return 401 if user is not authenticated', async () => {
      mockAuthRequest = {
        body: {
          title: 'New Post',
          message: 'New message',
          tags: ['new'],
          selectedFile: null,
        },
        userId: undefined,
      };

      await createPost(mockAuthRequest as AuthRequest, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Unauthenticated',
      });
    });
  });
});
