import { AnyAction } from 'redux';
import {
  FETCH_ALL,
  FETCH_BY_SEARCH,
  FETCH_BY_CREATOR,
  FETCH_POST,
  CREATE,
  UPDATE,
  DELETE,
  LIKE,
  COMMENT,
  START_LOADING,
  END_LOADING,
} from '../constants/actionTypes';
import { PostsState, Post } from '../types';

interface PostsAction extends AnyAction {
  type: string;
  payload?: {
    data?: Post[];
    currentPage?: number;
    numberOfPages?: number;
    post?: Post;
    _id?: string;
  };
}

const initialState: PostsState = {
  posts: [],
  post: null,
  currentPage: 1,
  numberOfPages: 1,
  isLoading: true,
};

const postsReducer = (state: PostsState = initialState, action: PostsAction): PostsState => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload?.data || [],
        currentPage: action.payload?.currentPage || 1,
        numberOfPages: action.payload?.numberOfPages || 1,
        isLoading: false,
      };
    case FETCH_BY_SEARCH:
    case FETCH_BY_CREATOR:
      return {
        ...state,
        posts: action.payload?.data || [],
        isLoading: false,
      };
    case FETCH_POST:
      return {
        ...state,
        post: action.payload?.post || null,
        isLoading: false,
      };
    case LIKE:
      return {
        ...state,
        posts: state.posts.map((post: Post) => {
          const updatedPost = action.payload as Post;
          return post._id === updatedPost?._id ? updatedPost : post;
        }),
        post: state.post?._id === (action.payload as Post)?._id ? (action.payload as Post) : state.post,
      };
    case COMMENT:
      return {
        ...state,
        posts: state.posts.map((post: Post) => {
          if (post._id === action.payload?._id) {
            return action.payload as Post;
          }
          return post;
        }),
        post: state.post?._id === (action.payload as Post)?._id ? (action.payload as Post) : state.post,
      };
    case CREATE:
      return {
        ...state,
        posts: [...state.posts, action.payload as Post],
      };
    case UPDATE:
      return {
        ...state,
        posts: state.posts.map((post: Post) =>
          (post._id === action.payload?._id ? (action.payload as Post) : post),
        ),
      };
    case DELETE:
      return {
        ...state,
        posts: state.posts.filter((post: Post) => post._id !== action.payload),
      };
    default:
      return state;
  }
};

export default postsReducer;
