import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavLink from '../common/NavLink';
import styles from './MainLayout.module.css'; // <-- Impor CSS Module

const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.brand}>Desa Digital</Link>
          <div className={styles.navMenu}>
            <NavLink to="/">Profil Desa</NavLink>
            {isAuthenticated ? (
              <>
                {user.role === 'admin' && (<NavLink to="/admin/dashboard">Admin Dashboard</NavLink>)}
                {user.role === 'masyarakat' && (<NavLink to="/dashboard">My Dashboard</NavLink>)}
                {user.role === 'masyarakat' && (<NavLink to="/buat-pengaduan">Buat Pengaduan</NavLink>)}
                <span className={styles.userName}>Hi, {user.name}!</span>
                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
      
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};
export default MainLayout;
