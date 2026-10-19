import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import {
  ShieldCheck,
  Mail,
  Phone,
  UserCheck,
  ShoppingBag,
  Sparkles,
  Award,
} from 'lucide-react';

const HomePage = () => {
  const { user, isAuthenticated, token } = useAuth();

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-badge">
          <Sparkles size={14} /> Premium Culinary Meat Experience
        </div>
        <h1 className="hero-headline">
          Welcome to <span className="text-orange">Urban Cleaver</span>
        </h1>
        <p className="hero-description">
          Engineered with vertical slice architecture, secure email OTP authentication, and WhatsApp-ready customer notifications.
        </p>

        {!isAuthenticated && (
          <div className="hero-cta-group">
            <Link to="/register" className="hero-btn-primary">
              <ShoppingBag size={18} /> Create Account & Verify OTP
            </Link>
            <Link to="/login" className="hero-btn-secondary">
              Sign In to Your Kitchen
            </Link>
          </div>
        )}
      </section>

      {/* Authenticated Dashboard Card */}
      {isAuthenticated && (
        <section className="dashboard-section">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="profile-info">
                <div className="profile-name-row">
                  <h3 className="profile-name">{user?.name}</h3>
                  {user?.isVerified ? (
                    <span className="badge-verified">
                      <ShieldCheck size={14} /> Email Verified
                    </span>
                  ) : (
                    <span className="badge-unverified">Pending Verification</span>
                  )}
                </div>
                <p className="profile-role">
                  <Award size={14} /> Role: <span className="capitalize">{user?.role || 'Customer'}</span>
                </p>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="detail-item">
                <span className="detail-label">
                  <Mail size={15} /> Registered Email
                </span>
                <span className="detail-value">{user?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <Phone size={15} /> WhatsApp Phone
                </span>
                <span className="detail-value">{user?.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <UserCheck size={15} /> User ID
                </span>
                <span className="detail-value text-mono text-xs">{user?.id || user?._id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <ShieldCheck size={15} /> Active Session
                </span>
                <span className="detail-value text-success">JWT Secured (7-Day Expiry)</span>
              </div>
            </div>

            <div className="token-preview">
              <span className="token-label">Active JWT Bearer Token (Bearer):</span>
              <code className="token-box">{token?.slice(0, 36)}...{token?.slice(-16)}</code>
            </div>
          </div>
        </section>
      )}

      {/* Feature Highlights Grid */}
      <section className="feature-grid">
        <div className="feature-box">
          <div className="feature-icon-badge">01</div>
          <h4 className="feature-title">Feature-Based Architecture</h4>
          <p className="feature-desc">
            Vertical slices group routes, controllers, services, models, and UI components by business domain.
          </p>
        </div>
        <div className="feature-box">
          <div className="feature-icon-badge">02</div>
          <h4 className="feature-title">6-Digit OTP Security</h4>
          <p className="feature-desc">
            10-minute expiry with 60-second cooldown timers, automatic input navigation, and instant email dispatch.
          </p>
        </div>
        <div className="feature-box">
          <div className="feature-icon-badge">03</div>
          <h4 className="feature-title">Dual Identifier Login</h4>
          <p className="feature-desc">
            Seamless sign-in with verified email or +91 phone number with automatic unverified account detection.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
