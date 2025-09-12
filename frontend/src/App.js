import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import PrivateRoute from './utils/PrivateRoute';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="container">
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;