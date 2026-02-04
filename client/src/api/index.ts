import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { SearchQuery, Post, SigninFormData, SignupFormData, AuthData, PostsListResponse, Profile, PaginatedPostsResponse } from '../types';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
});

// Request interceptor - adds auth token to headers
API.interceptors.request.use((req: InternalAxiosRequestConfig) => {
  const profile = localStorage.getItem('profile');
  if (profile) {
    try {
      const parsed: Profile = JSON.parse(profile);
      if (parsed.token) {
        req.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (error) {
      console.error('Error parsing profile from localStorage:', error);
    }
  }
  return req;
});

// Response interceptor - handle errors globally (optional)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear auth and redirect
      localStorage.removeItem('profile');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  },
);

// Posts API
export const fetchPost = (id: string): Promise<AxiosResponse<Post>> =>
  API.get(`/posts/${id}`);

export const fetchPosts = (page: number): Promise<AxiosResponse<PaginatedPostsResponse>> =>
  API.get(`/posts?page=${page}`);

export const fetchPostsByCreator = (name: string): Promise<AxiosResponse<PostsListResponse>> =>
  API.get(`/posts/creator?name=${name}`);

export const fetchPostsBySearch = (searchQuery: SearchQuery): Promise<AxiosResponse<PostsListResponse>> =>
  API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);

export const createPost = (newPost: Partial<Post>): Promise<AxiosResponse<Post>> =>
  API.post('/posts', newPost);

export const likePost = (id: string): Promise<AxiosResponse<Post>> =>
  API.patch(`/posts/${id}/likePost`);

export const comment = (text: string, id: string): Promise<AxiosResponse<Post>> =>
  API.post(`/posts/${id}/commentPost`, { text });

export const updatePost = (id: string, updatedPost: Partial<Post>): Promise<AxiosResponse<Post>> =>
  API.patch(`/posts/${id}`, updatedPost);

export const deletePost = (id: string): Promise<AxiosResponse<void>> =>
  API.delete(`/posts/${id}`);

// Auth API
export const signIn = (formData: SigninFormData): Promise<AxiosResponse<AuthData>> =>
  API.post('/user/signin', formData);

export const signUp = (formData: SignupFormData): Promise<AxiosResponse<AuthData>> =>
  API.post('/user/signup', formData);

export const googleSignIn = (tokenId: string): Promise<AxiosResponse<AuthData>> =>
  API.post('/user/google', { tokenId });
