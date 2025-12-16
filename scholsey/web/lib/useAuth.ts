import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
    logout,
  };
}
