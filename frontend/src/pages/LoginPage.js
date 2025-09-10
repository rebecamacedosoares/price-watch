import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { loginUser } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    
    try {
      await loginUser(username, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <section className="form-section">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Nome de Usuário</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
          {error && <p className="form-error">{error}</p>}
        </form>
      </section>
    </div>
  );
};

export default LoginPage;