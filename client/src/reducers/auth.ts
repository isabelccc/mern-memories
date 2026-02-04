import { AnyAction } from 'redux';
import * as actionType from '../constants/actionTypes';
import { AuthState, AuthData } from '../types';

interface AuthAction extends AnyAction {
  type: string;
  data?: AuthData;
}

const initialState: AuthState = {
  authData: null,
};

const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case actionType.AUTH:
      if (action.data) {
        localStorage.setItem('profile', JSON.stringify({ ...action.data }));
        return { ...state, authData: action.data };
      }
      return state;
    case actionType.LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };
    default:
      return state;
  }
};

export default authReducer;
