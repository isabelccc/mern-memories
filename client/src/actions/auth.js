import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, router, setError) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    const errorMessage = error?.response?.data?.message || 'Sign in failed. Please try again.';
    if (setError) setError(errorMessage);
    console.error('Sign in error:', error);
  }
};

export const signup = (formData, router, setError) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    console.error('Sign up error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    });
    const errorMessage = error?.response?.data?.message || error?.message || 'Sign up failed. Please try again.';
    if (setError) setError(errorMessage);
  }
};
