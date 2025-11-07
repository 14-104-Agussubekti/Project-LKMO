import React from 'react';
import styles from './HalamanProfilDesa.module.css';

// Data dummy (nanti akan diambil dari Backend)
const dummyData = {
  profil: {
    sejarah: "Desa kami memiliki sejarah panjang yang dimulai sejak tahun 1800-an, didirikan oleh para pendahulu yang mencari lahan subur. Sejak saat itu, desa kami terus berkembang...",
    visi: "Menjadi desa yang mandiri, sejahtera, berbudaya, dan berakhlak mulia, serta tanggap terhadap kemajuan zaman.",
    misi: "1. Meningkatkan kualitas Sumber Daya Manusia (SDM).\n2. Membangun infrastruktur desa yang memadai.\n3. Mengembangkan potensi ekonomi lokal berbasis pertanian dan UMKM.\n4. Menjaga kelestarian lingkungan dan budaya lokal.",
    tugas: "1. Menyelenggarakan urusan pemerintahan desa.\n2. Melaksanakan pembangunan desa.\n3. Melakukan pembinaan kemasyarakatan.\n4. Memberdayakan masyarakat desa."
  },
  struktur: [
    { nama: "Kepala Desa", jabatan: "Ahmad Subarjo" },
    { nama: "Sekretaris Desa", jabatan: "Siti Aminah" },
    { nama: "Kaur Keuangan", jabatan: "Budi Santoso" },
    { nama: "Kasi Pemerintahan", jabatan: "Dewi Lestari" },
    { nama: "Kasi Kesejahteraan", jabatan: "Eko Prasetyo" },
    { nama: "Kasi Pelayanan", jabatan: "Fitri Handayani" },
  ]
};

// --- ICON SVG UNTUK FOOTER ---
// Didefinisikan di sini agar file tetap rapi
// (Warna fill akan diatur oleh style CSS)
const IconFacebook = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3v9h4v-9Z"/></svg>
);
const IconInstagram = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.217.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.048 1.066.06 1.405.06 4.122s-.012 3.056-.06 4.122c-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.048-1.405.06-4.122.06s-3.056-.012-4.122-.06c-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12s.012-3.056.06-4.122c.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2Zm0 1.802c-2.67 0-2.987.01-4.042.059-1.002.048-1.604.208-2.126.41-.554.21-.96.477-1.382.896-.419.42-.686.828-.896 1.382-.201.522-.36 1.124-.41 2.126-.048 1.054-.059 1.371-.059 4.042s.01 2.987.059 4.042c.048 1.002.208 1.604.41 2.126.21.554.477.96.896 1.382.42.419.828.686 1.382.896.522.201 1.124.36 2.126.41 1.054.048 1.371.059 4.042.059s2.987-.01 4.042-.059c1.002-.048 1.604-.208 2.126-.41.554-.21.96-.477 1.382-.896.419-.42.686-.828.896-1.382.201-.522.36-1.124.41-2.126.048-1.054.059-1.371.059-4.042s-.01-2.987-.059-4.042c-.048-1.002-.208-1.604-.41-2.126-.21-.554-.477-.96-.896-1.382-.42-.419-.828-.686-1.382-.896-.522-.201-1.124-.36-2.126-.41-1.054-.048-1.371-.059-4.042-.059ZM12 6.865a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27Zm0 8.468a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666Zm5.338-9.87a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z"/></svg>
);
const IconMessenger = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.02 2 11.025c0 3.122 1.874 5.86 4.67 7.233v3.53a.5.5 0 0 0 .78.42l3.43-2.936a10.83 10.83 0 0 0 1.12-.044C17.523 19.03 22 15.01 22 10.005 22 5.001 17.523 2 12 2Z"/></svg>
);
const IconYoutube = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.582 7.104c-.23-.84-.87-1.484-1.71-1.715C18.25 5 12 5 12 5s-6.25 0-7.872.389c-.84.23-1.48.875-1.71 1.715C2 8.734 2 12 2 12s0 3.266.418 4.896c.23.84.87 1.484 1.71 1.715C5.75 19 12 19 12 19s6.25 0 7.872-.389c.84-.23 1.48-.875 1.71-1.715C22 15.266 22 12 22 12s0-3.266-.418-4.896ZM9.75 14.867V9.133L15.025 12 9.75 14.867Z"/></svg>
);
const IconTwitter = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.46 6c-.64.28-1.31.47-2.02.55.73-.44 1.29-1.13 1.55-1.94-.68.4-1.44.7-2.26.86C18.9 4.6 18.01 4 17 4c-1.93 0-3.5 1.57-3.5 3.5 0 .28.03.55.09.81-2.91-.15-5.49-1.54-7.22-3.66-.3.52-.47 1.13-.47 1.77 0 1.22.62 2.29 1.56 2.92-.58-.02-1.12-.18-1.6-.44v.04c0 1.7.1.2.3.1l-.1-.1c.32 1.3.93 2.1 1.74 2.8-.32.09-.66.13-1.02.13-.26 0-.51-.03-.76-.07.45 1.4 1.74 2.41 3.27 2.44-1.2.94-2.72 1.5-4.37 1.5-.28 0-.56-.02-.84-.05 1.55 1 3.39 1.58 5.37 1.58 6.44 0 9.97-5.34 9.97-9.97 0-.15 0-.3-.01-.45.68-.49 1.27-1.1 1.74-1.81z"/></svg>
);
// ------------------------------


const HalamanProfilDesa = () => {
  return (
    <div className={`${styles.container} animate-fadeIn`}>
      {/* Bagian Hero Header */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Selamat Datang di Portal Pengaduan Desa</h1>
        <p className={styles.heroSubtitle}>Layanan aspirasi dan pengaduan online masyarakat</p>
      </div>

      {/* Bagian Konten */}
      <div className={styles.content}>
        
        {/* Kolom Kiri (Profil, Visi, Misi) */}
        <div className={styles.mainContent}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Profil Instansi</h2>
            <h3 className={styles.cardSubtitle}>Sejarah Singkat</h3>
            <p>{dummyData.profil.sejarah}</p>
          </div>
          
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Visi & Misi</h2>
            <h3 className={styles.cardSubtitle}>Visi</h3>
            <p>{dummyData.profil.visi}</p>
            <h3 className={styles.cardSubtitle} style={{ marginTop: '1rem' }}>Misi</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{dummyData.profil.misi}</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Tugas Pokok & Fungsi</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{dummyData.profil.tugas}</p>
          </div>
        </div>

        {/* Kolom Kanan (Struktur Organisasi) */}
        <div className={styles.sidebar}>
          <div className={`${styles.card} ${styles.stickyCard}`}>
            <h2 className={styles.cardTitle}>Struktur Organisasi</h2>
            <div className={styles.strukturGrid}>
              {dummyData.struktur.map((item, index) => (
                <div key={index} className={styles.strukturItem}>
                  <h4 className={styles.strukturNama}>{item.nama}</h4>
                  <p className={styles.strukturJabatan}>{item.jabatan}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER BARU DITAMBAHKAN --- */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          
          {/* Kolom 1: Portal Layanan Digital */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Portal Layanan Digital</h3>
            <p className={styles.footerText}>
              Website resmi Pemerintah Desa yang berfungsi sebagai pusat informasi,
              media transparansi, dan sarana pengaduan publik.
              Dikelola secara profesional untuk melayani masyarakat.
            </p>
          </div>

          {/* Kolom 2: Link Terkait */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Link Terkait</h3>
            {/* Anda bisa menggunakan <Link> dari react-router-dom jika ini 
              link internal, atau <a> untuk link eksternal 
            */}
            <a href="#" className={styles.footerLink}>E-Layanan Desa</a>
            <a href="#" className={styles.footerLink}>Pengaduan</a>
            <a href="#" className={styles.footerLink}>Website Pusat</a>
          </div>

          {/* Kolom 3: Operator Desa */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Operator Desa</h3>
            <a href="mailto:portaldesakita@gmail.com" className={styles.footerContact}>
              portaldesakita@gmail.com
            </a>
            <a href="tel:085334343435" className={styles.footerContact}>
              0853-3434-3435
            </a>
            <div className={styles.socialIcons}>
              {/* Ikon-ikon ini akan mengambil warna dari variabel CSS */}
              <a href="#" className={styles.socialIcon} style={{ color: '#1877F2' }}><IconFacebook /></a>
              <a href="#" className={styles.socialIcon} style={{ color: '#E4405F' }}><IconInstagram /></a>
              <a href="#" className={styles.socialIcon} style={{ color: '#00B2FF' }}><IconMessenger /></a>
              <a href="#" className={styles.socialIcon} style={{ color: '#FF0000' }}><IconYoutube /></a>
              <a href="#" className={styles.socialIcon} style={{ color: '#1DA1F2' }}><IconTwitter /></a>
            </div>
          </div>

        </div>
      </footer>
      
    </div>
  );
};

export default HalamanProfilDesa;
