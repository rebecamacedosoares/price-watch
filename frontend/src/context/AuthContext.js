import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  
  const [user, setUser] = useState(() => {
    if (localStorage.getItem('authTokens')) {
      try {
        const token = JSON.parse(localStorage.getItem('authTokens')).access;
        return jwtDecode(token);
      } catch (e) {
        console.error("Erro ao decodificar token do localStorage:", e);
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = useCallback(async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/auth/jwt/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
        navigate('/');
        return true;
      } else {
        throw new Error(data.detail || 'Falha ao fazer login. Verifique as credenciais.');
      }
    } catch (error) {
      console.error('Erro de login:', error);
      throw error;
    }
  }, [navigate]);

  const logoutUser = useCallback(() => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (authTokens) {
        try {
            setUser(jwtDecode(authTokens.access));
        } catch (e) {
            console.error("Erro ao decodificar token ao carregar AuthProvider:", e);
            logoutUser();
        }
    }
    setLoading(false);
  }, [authTokens, logoutUser]);

  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };
  
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};