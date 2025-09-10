import React, { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AuthContext from './context/AuthContext';

function App() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className="App">
      <header className="app-header">
        <nav className="main-nav">
          <Link to="/" className="nav-logo">PriceWatch</Link>
          <div className="nav-links">
            {user ? (
              <>
                <span className="welcome-user">Olá, {user.username || 'Usuário'}!</span> {/* <-- MUDANÇA AQUI */}
                <button onClick={logoutUser} className="logout-btn">Sair</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Cadastro</Link>
              </>
            )}
          </div>
        </nav>
      </header>
      
      <main className="container">
        <Routes>
          <Route path="/" element={<DashboardPage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;