import { Dispatch } from 'redux';
import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index';



interface SigninFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword?: string;
}

type Router = {
  push: (path: string) => void;
};

interface AxiosError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
    statusText?: string;
  };
  code?: string;
}

export const signin = (
  formData: SigninFormData,
  router: Router,
  setError?: (msg: string) => void
) => async (dispatch: Dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error: unknown) {
    const err = error as AxiosError;
    const errorMessage = err?.response?.data?.message || 'Sign in failed. Please try again.';
    if (setError) setError(errorMessage);
    console.error('Sign in error:', err);
  }
};

export const signup = (
  formData: SignupFormData,
  router: Router,
  setError?: (msg: string) => void
) => async (dispatch: Dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error('Sign up error details:', {
      message: err?.message,
      response: err?.response?.data,
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      code: err?.code,
    });

    let errorMessage = 'Sign up failed. Please try again.';

    if (err?.code === 'ECONNREFUSED' || err?.message === 'Network Error') {
      errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
    } else if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.message) {
      errorMessage = err.message;
    }

    if (setError) setError(errorMessage);
  }
};
