import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FormPengaduan.module.css';

const FormPengaduan = () => {
  const [judul, setJudul] = useState('');
  
  // --- STATE BARU ---
  const [jenisPengaduan, setJenisPengaduan] = useState(''); // Untuk <select>
  const [showJenisLainnya, setShowJenisLainnya] = useState(false); // Kontrol kemunculan field 'Lainnya'
  const [jenisLainnya, setJenisLainnya] = useState(''); // Untuk field 'Lainnya'
  const [lokasi, setLokasi] = useState(''); // Untuk field 'Lokasi'
  // --- STATE LAMA ---
  const [isi, setIsi] = useState('');
  const [foto, setFoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // --- HANDLER BARU UNTUK DROPDOWN ---
  const handleJenisChange = (e) => {
    const value = e.target.value;
    setJenisPengaduan(value);
    
    // Tampilkan/sembunyikan field kustom 'Lainnya'
    if (value === 'Lainnya') {
      setShowJenisLainnya(true);
    } else {
      setShowJenisLainnya(false);
      setJenisLainnya(''); // Kosongkan field 'Lainnya' jika pilihan diganti
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi tambahan untuk field 'Lainnya'
    if (jenisPengaduan === 'Lainnya' && jenisLainnya.trim() === '') {
      alert('Harap sebutkan jenis pengaduan lainnya.'); // Nanti bisa diganti notifikasi lebih baik
      return;
    }
    
    setSubmitting(true);
    
    // Tentukan jenis pengaduan final yang akan dikirim
    const jenisFinal = jenisPengaduan === 'Lainnya' ? jenisLainnya : jenisPengaduan;

    console.log('MOCK SUBMIT PENGADUAN:', { 
      judul, 
      jenis: jenisFinal, // <-- Data baru
      lokasi,            // <-- Data baru
      isi, 
      foto_nama: foto?.name 
    });
    
    setTimeout(() => {
      setSubmitting(false);
      navigate('/dashboard'); 
    }, 1000);
  };

  return (
    <div className={`${styles.card} animate-fadeIn`}>
      <h1 className={styles.title}>Buat Pengaduan Baru</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label className={styles.label}>Judul Pengaduan</label>
          <input
            type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required
            placeholder="Contoh: Jalan Rusak di RT 01"
          />
        </div>

        {/* --- FIELD BARU: JENIS PENGADUAN (DROPDOWN) --- */}
        <div>
          <label className={styles.label}>Jenis Pengaduan</label>
          <select value={jenisPengaduan} onChange={handleJenisChange} required>
            <option value="" disabled>Pilih satu kategori...</option>
            <option value="Infrastruktur">Infrastruktur (Jalan, Jembatan, Air)</option>
            <option value="Lingkungan">Lingkungan (Sampah, Banjir, Pohon Tumbang)</option>
            <option value="Sosial">Sosial (Bantuan, Keamanan, Kependudukan)</option>
            <option value="Lainnya">Lainnya...</option>
          </select>
        </div>

        {/* --- FIELD BARU: KONDISIONAL 'LAINNYA' --- */}
        {showJenisLainnya && (
          <div className={styles.jenisLainnyaWrapper}>
            <label className={styles.label}>Sebutkan Jenis Pengaduan Lainnya</label>
            <input
              type="text"
              value={jenisLainnya}
              onChange={(e) => setJenisLainnya(e.target.value)}
              required
              placeholder="Contoh: Fasilitas Olahraga"
            />
          </div>
        )}

        {/* --- FIELD BARU: LOKASI --- */}
        <div>
          <label className={styles.label}>Lokasi Kejadian</label>
          <input
            type="text" value={lokasi} onChange={(e) => setLokasi(e.target.value)} required
            placeholder="Contoh: Depan Balai Desa, RT 01/RW 05"
          />
        </div>

        <div>
          <label className={styles.label}>Isi Pengaduan</label>
          <textarea
            value={isi} onChange={(e) => setIsi(e.target.value)} required rows="4"
            placeholder="Jelaskan detail pengaduan Anda di sini..."
          ></textarea>
        </div>
        
        <div>
          <label className={styles.label}>Foto Bukti (Wajib)</label>
          <input
            type="file" onChange={(e) => setFoto(e.target.files[0])}
            className={styles.fileInput}
          />
        </div>
        
        <button
          type="submit" disabled={submitting}
          className={styles.button}
        >
          {submitting ? 'Mengirim...' : 'Kirim Pengaduan'}
        </button>
      </form>
    </div>
  );
};
export default FormPengaduan;
