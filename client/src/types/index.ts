import { ChangeEvent } from 'react';
// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  googleId?: string;
}

export interface AuthData {
  result: User;
  token: string;
}

// Post types
export interface Reply {
  _id?: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: Date | string;
}

export interface Comment {
  _id?: string;
  text: string;
  authorId: string;
  authorName: string;
  replies?: Reply[];
  createdAt: Date | string;
}

export interface Post {
  _id: string;
  title: string;
  message: string;
  name: string;
  creator: string;
  tags: string[];
  selectedFile: string;
  likes: string[];
  comments: Comment[];
  createdAt: Date | string;
}

export interface HistoryLike {
  push: (path: string) => void;
}

// Redux types
export interface PostsState {
  posts: Post[];
  post: Post | null;
  currentPage: number;
  numberOfPages: number;
  isLoading: boolean;
}

export interface AuthState {
  authData: AuthData | null;
}

export interface RootState {
  posts: PostsState;
  auth: AuthState;
}

// Search types
export interface SearchQuery {
  search?: string;
  tags?: string;
}

// Auth types
export interface SigninFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword?: string;
}

// Form state type (combines signin and signup)
export interface AuthFormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Router types (for navigation)
export interface Router {
  push: (path: string) => void;
}

export interface RouteParams{
    name:string
}

// Type guard to convert History to Router
export const historyToRouter = (history: { push: (path: string) => void }): Router => ({
  push: (path: string) => history.push(path),
});

// Google Login types
export interface GoogleLoginResponse {
  profileObj: {
    googleId: string;
    imageUrl: string;
    email: string;
    name: string;
    givenName: string;
    familyName: string;
  };
  tokenId: string;
  accessToken: string;
}

export interface GoogleLoginResponseOffline {
  code: string;
}
export interface InputProps {
    name: string;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    label: string;
    half?: boolean;
    autoFocus?: boolean;
    type?: string;
    handleShowPassword?: () => void;
  }

// API Response types
export interface PaginatedPostsResponse {
  data: Post[];
  currentPage: number;
  numberOfPages: number;
}

export interface PostsListResponse {
  data: Post[];
}

export interface Profile {
  token: string;
  result?: {
    _id: string;
    name: string;
    email: string;
    googleId?: string;
  };
}

export type FormProps = {
  currentId: string | null;
  setCurrentId: (id: string | null) => void;
};

// Component Props
export interface PostProps {
  post: Post;
  setCurrentId: (id: string | null) => void;
}

export interface PostsProps {
  setCurrentId: (id: string | null) => void;
}

export interface PaginationProps {
  page: number;
}

// Form types
export interface PostFormState {
  title: string;
  message: string;
  tags: string[];
  selectedFile: string;
  name?: string;
}

export interface BackToTopProps {
    threshold?: number; // optional prop
  }
