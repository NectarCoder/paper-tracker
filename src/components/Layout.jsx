import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, List, PlusCircle, Network } from 'lucide-react';

export default function Layout() {
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1.25rem',
          color: isActive ? 'white' : 'var(--text-secondary)',
          background: isActive ? 'var(--accent-primary)' : 'transparent',
          borderRadius: '8px',
          textDecoration: 'none',
          marginBottom: '0.5rem',
          transition: 'all var(--transition-fast)',
          fontWeight: isActive ? '600' : '500'
        }}
      >
        <Icon size={20} />
        {label}
      </Link>
    );
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h1 style={{ fontSize: '1.5rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Paper Tracker
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {currentUser?.email}
          </p>
        </div>
        
        <nav style={{ padding: '1.5rem', flex: 1 }}>
          <NavItem to="/" icon={List} label="All Papers" />
          <NavItem to="/graph" icon={Network} label="Graph View" />
          <NavItem to="/add" icon={PlusCircle} label="Add Paper" />
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%' }}>
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
