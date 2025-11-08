
import React from 'react';

// Style inline juga lebih mudah untuk komponen dinamis kecil ini
const StatusBadge = ({ status }) => {
  const statusColors = {
    // --- TAMBAHKAN DUA STATUS BARU DI BAWAH INI ---
    submitted: {
      backgroundColor: '#fef9c3', // bg-yellow-100 (Sama seperti tertunda)
      color: '#854d0e', // text-yellow-800
    },
    rejected: {
      backgroundColor: '#fee2e2', // bg-red-100
      color: '#991b1b', // text-red-800
    },
    // --- Status yang sudah ada ---
    tertunda: {
      backgroundColor: '#fef9c3', // bg-yellow-100
      color: '#854d0e', // text-yellow-800
    },
    in_progress: {
      backgroundColor: '#dbeafe', // bg-blue-100
      color: '#1e40af', // text-blue-800
    },
    resolved: {
      backgroundColor: 'var(--color-bg-main)', // Latar Jerami (Sesuai palet)
      color: 'var(--color-accent-dark)', // Hijau Hutan
      border: '1px solid var(--color-accent-light)' // Border Hijau Segar
    },
  };

  const style = {
    padding: '0.25rem 0.75rem', // px-3 py-1
    fontSize: '0.75rem', // text-xs
    fontWeight: '600', // font-semibold
    borderRadius: '9999px', // rounded-full
    display: 'inline-flex',
    lineHeight: '1.25',
    textTransform: 'capitalize',
    ...(statusColors[status] || statusColors['tertunda']), // Ambil style, atau default ke tertunda
  };

  // Mengganti underscore dengan spasi untuk tampilan
  const formattedStatus = status.replace('_', ' ');

  return <span style={style}>{formattedStatus}</span>;
};
export default StatusBadge;
