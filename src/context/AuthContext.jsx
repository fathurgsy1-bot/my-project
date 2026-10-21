import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem('session'));
    return s?.token ? s : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  const login = (data) => {
    localStorage.setItem('session', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    setSession(data);
  };

  const logout = () => {
    localStorage.removeItem('session');
    localStorage.removeItem('token');
    setSession(null);
  };

  const role = session?.role ?? 'guest';
  const value = {
    session,
    username: session?.username ?? null,
    role,
    isLoggedIn: !!session,
    canCrud: !!session && role !== 'guest',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
