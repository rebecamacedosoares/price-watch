import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <header className="app-header">
            <nav className="main-nav">
                <Link to="/" className="nav-logo">PriceWatch</Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <span className="welcome-user">Olá, {user.username}!</span>
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
    );
};

export default Header;