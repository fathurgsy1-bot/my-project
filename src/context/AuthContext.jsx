import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('rtrw_session') || 'null'));

  const signIn = ({ token, username, role }) => {
    const s = { username, role: role.toLowerCase() };
    localStorage.setItem('rtrw_token', token);
    localStorage.setItem('rtrw_session', JSON.stringify(s));
    setSession(s);
  };
  const signOut = () => { localStorage.removeItem('rtrw_token'); localStorage.removeItem('rtrw_session'); setSession(null); };

  const canCrud = (sheet = '') => {
    const s = sheet.toUpperCase();
    if (session?.role === 'admin') return true;
    if (session?.role === 'bendahara') return ['KAS', 'TUNGGAKAN'].includes(s);
    if (session?.role === 'sekretaris') return s === 'INVENTARIS';
    return false;
  };

  return <AuthContext.Provider value={{ session, signIn, signOut, canCrud }}>{children}</AuthContext.Provider>;
}
