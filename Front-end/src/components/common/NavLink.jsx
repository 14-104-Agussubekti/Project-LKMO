import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavLink.module.css'; // <-- 1. Impor file CSS Module

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  // 2. Hapus objek 'style' yang lama
  // const style = { ... };

  return (
    // 3. Ganti 'style={style}' dengan 'className'
    <Link 
      to={to} 
      className={`${styles.navLink} ${isActive ? styles.active : ''}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
