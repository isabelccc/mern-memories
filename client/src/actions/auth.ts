import { Dispatch } from 'redux';
import { AxiosError } from 'axios';
import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index';
import { SigninFormData, SignupFormData, Router } from '../types';

export const signin = (
  formData: SigninFormData,
  router: Router,
  setError?: (msg: string) => void,
) => async (dispatch: Dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const errorMessage = err?.response?.data?.message || 'Sign in failed. Please try again.';
    if (setError) setError(errorMessage);
    console.error('Sign in error:', err);
  }
};

export const signup = (
  formData: SignupFormData,
  router: Router,
  setError?: (msg: string) => void,
) => async (dispatch: Dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
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
