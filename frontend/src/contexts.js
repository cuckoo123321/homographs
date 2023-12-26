import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  setUser: () => {}
});

export const CountContext = createContext({
  cartItemsCount: 0,
  setCartItemsCount: () => {}
})