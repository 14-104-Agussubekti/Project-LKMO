import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './RegisterPage.module.css';

// --- FUNGSI BARU UNTUK VALIDASI PASSWORD ---
const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password harus memiliki minimal 8 karakter.';
  }
  // Regex ini memeriksa setidaknya satu karakter unik (spesial)
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(password)) {
    return 'Password harus mengandung setidaknya satu karakter unik (misal: !@#$).';
  }
  return ''; // Kosong berarti valid
};

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // --- STATE BARU UNTUK ERROR PASSWORD ---
  const [passwordError, setPasswordError] = useState('');

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError(''); // Reset error setiap kali submit

    // --- VALIDASI PASSWORD BARU ---
    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError); // Tampilkan error password
      return; // Hentikan proses submit
    }
    // --- AKHIR VALIDASI ---

    if (!register) {
      setError('Fungsi register belum diimplementasikan di AuthContext.');
      return;
    }

    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.error || 'Registrasi gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat registrasi.');
    }
  };

  return (
    <div className={`${styles.loginWrapper} animate-fadeIn`}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Buat Akun Baru</h1>
          <p className={styles.subtitle}>Daftar untuk memulai pengaduan Anda</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Nama Lengkap</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
              placeholder="Nama Anda"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="email@anda.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="Minimal 8 karakter, 1 unik"
            />
            {/* --- PESAN ERROR PASSWORD BARU --- */}
            {passwordError && (
              <p className={styles.passwordError}>{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Mendaftar...' : 'Register'}
          </button>
        </form>

        <p className={styles.signupText}>
          Sudah punya akun?{' '}
          <Link to="/login" className={styles.link}>
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

