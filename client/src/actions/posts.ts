import { START_LOADING, END_LOADING, FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, CREATE, UPDATE, DELETE, LIKE, COMMENT, FETCH_BY_CREATOR } from '../constants/actionTypes';
import * as api from '../api';
import { Dispatch, AnyAction } from 'redux';
import { Post, SearchQuery, HistoryLike } from '../types';


export const getPost = (id: string) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.fetchPost(id);

    dispatch({ type: FETCH_POST, payload: { post: data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Get post error:', error);
    dispatch({ type: END_LOADING });
  }
};

export const getPosts = (page: number) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
  try {
    dispatch({ type: START_LOADING });
    const { data: { data, currentPage, numberOfPages } } = await api.fetchPosts(page);

    dispatch({ type: FETCH_ALL, payload: { data, currentPage, numberOfPages } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Get posts error:', error);
    dispatch({ type: END_LOADING });
  }
};

export const getPostsByCreator = (name: string) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
  try {
    dispatch({ type: START_LOADING });
    const { data: { data } } = await api.fetchPostsByCreator(name);

    dispatch({ type: FETCH_BY_CREATOR, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Get posts by creator error:', error);
    dispatch({ type: END_LOADING });
  }
};

export const getPostsBySearch = (searchQuery: SearchQuery) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
  try {
    dispatch({ type: START_LOADING });
    const { data: { data } } = await api.fetchPostsBySearch(searchQuery);

    dispatch({ type: FETCH_BY_SEARCH, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Get posts by search error:', error);
    dispatch({ type: END_LOADING });
  }
};

export const createPost = (post: Partial<Post>, history: HistoryLike) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });
    dispatch({ type: END_LOADING });

    history.push(`/posts/${data._id}`);
  } catch (error) {
    console.error('Create post error:', error);
    dispatch({ type: END_LOADING });
  }
};

export const updatePost = (id: string, post: Partial<Post>) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
  try {
    const { data } = await api.updatePost(id, post);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.error('Update post error:', error);
  }
};

export const likePost = (id: string) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
  try {
    // Token is automatically added via axios interceptor in api/index.js
    const { data } = await api.likePost(id);

    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.error('Like post error:', error);
  }
};

export const commentPost = (value: string, id: string) => async (dispatch: Dispatch<AnyAction>): Promise<Post['comments'] | null> => {
  try {
    const { data } = await api.comment(value, id);

    dispatch({ type: COMMENT, payload: data });

    return data.comments;
  } catch (error) {
    console.error('Comment post error:', error);
    return null;
  }
};

export const deletePost = (id: string) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
  try {
    await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.error('Delete post error:', error);
  }
};
