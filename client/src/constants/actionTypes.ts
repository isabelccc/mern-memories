// client/src/constants/actionTypes.ts
export const CREATE = 'CREATE' as const;
export const UPDATE = 'UPDATE' as const;
export const DELETE = 'DELETE' as const;
export const FETCH_ALL = 'FETCH_ALL' as const;
export const FETCH_BY_SEARCH = 'FETCH_BY_SEARCH' as const;
export const FETCH_POST = 'FETCH_POST' as const;
export const LIKE = 'LIKE' as const;
export const COMMENT = 'COMMENT' as const;
export const END_LOADING = 'END_LOADING' as const;
export const START_LOADING = 'START_LOADING' as const;
export const FETCH_BY_CREATOR = 'FETCH_BY_CREATOR' as const;

export const AUTH = 'AUTH' as const;
export const LOGOUT = 'LOGOUT' as const;

// Optional: Create a union type for all action types
export type ActionType =
  | typeof CREATE
  | typeof UPDATE
  | typeof DELETE
  | typeof FETCH_ALL
  | typeof FETCH_BY_SEARCH
  | typeof FETCH_POST
  | typeof LIKE
  | typeof COMMENT
  | typeof END_LOADING
  | typeof START_LOADING
  | typeof FETCH_BY_CREATOR
  | typeof AUTH
  | typeof LOGOUT;
