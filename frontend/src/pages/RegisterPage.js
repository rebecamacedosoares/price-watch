import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [re_password, setRePassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (password !== re_password) {
      setError('As senhas não coincidem.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/auth/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          re_password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData).join('\n');
        throw new Error(errorMessage || 'Falha ao registrar.');
      }

      alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
      navigate('/login');

    } catch (err) {
      setError(err.message);
      console.error('Erro de registro:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <section className="form-section">
        <h2>Crie sua Conta</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="username">Nome de Usuário</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <label htmlFor="re_password">Confirme a Senha</label>
          <input
            id="re_password"
            type="password"
            value={re_password}
            onChange={(e) => setRePassword(e.target.value)}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          {error && <p className="form-error">{error}</p>}
        </form>
      </section>
    </div>
  );
};

export default RegisterPage;