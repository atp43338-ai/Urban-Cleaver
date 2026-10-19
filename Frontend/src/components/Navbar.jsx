import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { LogOut, User, ShieldCheck, Flame, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-icon">
            <Flame className="cleaver-flame" size={20} />
          </div>
          <div className="brand-text">
            <span className="brand-title">URBAN CLEAVER</span>
            <span className="brand-subtitle">Artisanal Cuts</span>
          </div>
        </Link>

        <nav className="navbar-nav">
          {isAuthenticated ? (
            <div className="nav-user-cluster">
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="nav-admin-link">
                  <LayoutDashboard size={15} /> Admin Console
                </Link>
              )}

              <div className="user-pill">
                <User size={16} className="text-amber-500" />
                <span className="user-name">{user?.name}</span>
                {user?.isVerified && (
                  <span className="verified-chip" title="Verified Customer">
                    <ShieldCheck size={14} /> Verified
                  </span>
                )}
              </div>

              <button onClick={handleLogout} className="btn-logout" title="Log Out">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="nav-btn-secondary">
                Log In
              </Link>
              <Link to="/register" className="nav-btn-primary">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
