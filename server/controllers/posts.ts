import { Request, Response } from 'express';
import Filter from 'bad-words';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth';

// Profanity filter initialization
const filter = new Filter();
filter.addWords('bad', 'some', 'hells');

interface PostBody {
  title: string;
  message: string;
  tags: string[];
  selectedFile: string;
  name?: string;
}

interface CommentBody {
  text: string;
  authorName?: string;
}

// Helper function to transform Prisma Post to frontend format (with nested comments)
const transformPost = (post: any) => {
  return {
    _id: post.id,
    title: post.title,
    message: post.message,
    name: post.name,
    creator: post.creator,
    tags: post.tags,
    selectedFile: post.selectedFile,
    likes: post.likes,
    comments: post.comments?.map((comment: any) => ({
      _id: comment.id,
      text: comment.text,
      authorId: comment.authorId,
      authorName: comment.authorName,
      createdAt: comment.createdAt,
      replies: comment.replies?.map((reply: any) => ({
        _id: reply.id,
        text: reply.text,
        authorId: reply.authorId,
        authorName: reply.authorName,
        createdAt: reply.createdAt,
      })) || [],
    })) || [],
    createdAt: post.createdAt,
  };
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    
    const [total, posts] = await Promise.all([
      prisma.post.count(),
      prisma.post.findMany({
        take: LIMIT,
        skip: startIndex,
        orderBy: { createdAt: 'desc' },
        include: {
          comments: {
            include: {
              replies: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      }),
    ]);

    const transformedPosts = posts.map(transformPost);
    res.json({
      data: transformedPosts,
      currentPage: Number(page) || 1,
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ message: err.message });
  }
};

export const getPostsBySearch = async (req: Request, res: Response): Promise<void> => {
  const { searchQuery, tags } = req.query;
  try {
    const searchTerm = searchQuery as string;
    const tagArray = tags ? (tags as string).split(',').filter(Boolean) : [];

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          searchTerm ? {
            title: {
              contains: searchTerm,
              mode: 'insensitive' as const,
            },
          } : {},
          searchTerm ? {
            message: {
              contains: searchTerm,
              mode: 'insensitive' as const,
            },
          } : {},
          tagArray.length > 0 ? {
            tags: {
              hasSome: tagArray,
            },
          } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
      },
      include: {
        comments: {
          include: {
            replies: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformedPosts = posts.map(transformPost);
    res.json({ data: transformedPosts });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ message: err.message });
  }
};

export const getPostsByCreator = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        name: name as string,
      },
      include: {
        comments: {
          include: {
            replies: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformedPosts = posts.map(transformPost);
    res.json({ data: transformedPosts });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ message: err.message });
  }
};

export const getPost = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
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

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const transformedPost = transformPost(post);
    res.status(200).json(transformedPost);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ message: err.message });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  const postData = (req as Request).body as PostBody;
  const { title, message, tags, selectedFile, name } = postData;
  
  if (!req.userId) {
    res.status(401).json({ message: 'Unauthenticated' });
    return;
  }

  try {
    const cleanedTitle = filter.clean(title);
    const cleanedMessage = filter.clean(message);

    const newPost = await prisma.post.create({
      data: {
        title: cleanedTitle,
        message: cleanedMessage,
        tags: tags || [],
        selectedFile: selectedFile || null,
        name: name || 'Unknown',
        creator: req.userId,
        likes: [],
      },
      include: {
        comments: {
          include: {
            replies: true,
          },
        },
      },
    });

    const transformedPost = transformPost(newPost);
    res.status(201).json(transformedPost);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(409).json({ message: err.message });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = (req as Request<{ id: string }>).params;
  const postData = (req as Request).body as PostBody;
  const { title, message, selectedFile, tags } = postData;

  try {
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      res.status(404).json({ message: `No post with id: ${id}` });
      return;
    }

    // Check if user is the creator
    if (existingPost.creator !== req.userId) {
      res.status(403).json({ message: 'Not allowed to update this post' });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title ? filter.clean(title) : undefined,
        message: message ? filter.clean(message) : undefined,
        tags: tags || undefined,
        selectedFile: selectedFile || undefined,
      },
      include: {
        comments: {
          include: {
            replies: true,
          },
        },
      },
    });

    const transformedPost = transformPost(updatedPost);
    res.json(transformedPost);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ message: err.message });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = (req as Request<{ id: string }>).params;

  try {
    // Check if post exists and user is creator
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      res.status(404).json({ message: `No post with id: ${id}` });
      return;
    }

    if (post.creator !== req.userId) {
      res.status(403).json({ message: 'Not allowed to delete this post' });
      return;
    }

    // Delete post (comments and replies will be cascade deleted)
    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: 'Post deleted successfully.' });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ message: err.message });
  }
};

export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = (req as Request<{ id: string }>).params;

  if (!req.userId) {
    res.status(401).json({ message: 'Unauthenticated' });
    return;
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const likes = post.likes || [];
    const index = likes.findIndex((likeId: string) => likeId === req.userId);

    let updatedLikes: string[];
    if (index === -1) {
      // Add like
      updatedLikes = [...likes, req.userId];
    } else {
      // Remove like
      updatedLikes = likes.filter((likeId: string) => likeId !== req.userId);
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { likes: updatedLikes },
      include: {
        comments: {
          include: {
            replies: true,
          },
        },
      },
    });

    const transformedPost = transformPost(updatedPost);
    res.status(200).json(transformedPost);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ message: err.message });
  }
};

export const commentPost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = (req as Request<{ id: string }>).params;
  const commentData = (req as Request).body as CommentBody;
  const { text } = commentData;

  if (!req.userId) {
    res.status(401).json({ message: 'Unauthenticated' });
    return;
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const userName = req.userName || req.user?.name || commentData.authorName || 'Unknown';

    // Create comment
    await prisma.comment.create({
      data: {
        text: filter.clean(text),
        authorId: req.userId,
        authorName: userName,
        postId: id,
      },
    });

    // Fetch updated post with all comments
    const updatedPost = await prisma.post.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            replies: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!updatedPost) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const transformedPost = transformPost(updatedPost);
    res.json(transformedPost);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ message: err.message });
  }
};

export const editComment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id, commentId } = (req as Request<{ id: string; commentId: string }>).params;
  const commentData = (req as Request).body as CommentBody;
  const { text } = commentData;

  if (!req.userId) {
    res.status(401).json({ message: 'Unauthenticated' });
    return;
  }

  try {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Check if comment exists and belongs to user
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (comment.authorId !== req.userId) {
      res.status(403).json({ message: 'Not allowed' });
      return;
    }

    // Update comment
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        text: filter.clean(text),
      },
    });

    // Fetch updated post
    const updatedPost = await prisma.post.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            replies: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!updatedPost) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const transformedPost = transformPost(updatedPost);
    res.json(transformedPost);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ message: err.message });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id, commentId } = (req as Request<{ id: string; commentId: string }>).params;

  if (!req.userId) {
    res.status(401).json({ message: 'Unauthenticated' });
    return;
  }

  try {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Check if comment exists and belongs to user
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (comment.authorId !== req.userId) {
      res.status(403).json({ message: 'Not allowed' });
      return;
    }

    // Delete comment (replies will be cascade deleted)
    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Fetch updated post
    const updatedPost = await prisma.post.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            replies: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!updatedPost) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const transformedPost = transformPost(updatedPost);
    res.json(transformedPost);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ message: err.message });
  }
};
