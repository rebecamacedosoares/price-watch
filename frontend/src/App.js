import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      {/* className="App" é o container principal que usa Flexbox */}
      <div className="App">
        {/* className="app-header" define o cabeçalho fixo no topo */}
        <header className="app-header">
          <nav className="main-nav">
            <Link to="/" className="nav-logo">PriceWatch</Link>
            <div className="nav-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Cadastro</Link>
            </div>
          </nav>
        </header>
        
        {/* className="container" centraliza o conteúdo principal */}
        <main className="container">
          <Routes>
            <Route path="/" element={<DashboardPage />} /> 
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;