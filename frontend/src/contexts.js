// import {  createContext } from 'react';

// export const AuthContext = createContext(null);
import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
});