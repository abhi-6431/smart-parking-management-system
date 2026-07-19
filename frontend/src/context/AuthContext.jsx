import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('parking_user') || 'null'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('parking_token')));
  const save = (data) => { localStorage.setItem('parking_token', data.token); localStorage.setItem('parking_user', JSON.stringify(data.user)); setUser(data.user); };
  const logout = () => { localStorage.removeItem('parking_token'); localStorage.removeItem('parking_user'); setUser(null); };
  useEffect(() => { if (!localStorage.getItem('parking_token')) { setLoading(false); return; } api.get('/auth/me').then(({ data }) => { localStorage.setItem('parking_user', JSON.stringify(data.user)); setUser(data.user); }).catch(logout).finally(() => setLoading(false)); }, []);
  return <AuthContext.Provider value={{ user, loading, save, logout, setUser }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
