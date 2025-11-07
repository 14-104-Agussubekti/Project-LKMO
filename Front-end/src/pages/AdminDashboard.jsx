import React, { useState } from 'react';
import StatusBadge from '../components/common/StatusBadge';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  // --- Data Mockup Diperbarui ---
  // Menambahkan 'waktu_dibuat'
  const [pengaduan, setPengaduan] = useState([
    { 
      id: 1, 
      judul: 'Jalan Rusak di RT 01', 
      status: 'menunggu_persetujuan',
      pelapor: 'Warga A', 
      isi: 'Jalanan di depan rumah saya (RT 01/RW 05) rusak parah...', 
      foto_bukti: 'https://placehold.co/600x400/ccc/999?text=Contoh+Foto+Jalan+Rusak',
      lokasi: 'Depan rumah saya (RT 01/RW 05)',
      alasan_penolakan: null,
      waktu_dibuat: '4 Nov 2025, 15:01' // <-- BARU
    },
    { 
      id: 2, 
      judul: 'Lampu Jalan Mati', 
      status: 'tertunda',
      pelapor: 'Warga B', 
      isi: 'Lampu jalan di pertigaan utama desa sudah mati 3 hari...', 
      foto_bukti: null,
      lokasi: 'Pertigaan utama desa',
      alasan_penolakan: null,
      waktu_dibuat: '3 Nov 2025, 09:30' // <-- BARU
    },
    { 
      id: 3, 
      judul: 'Bantuan Sosial Belum Datang', 
      status: 'diproses', 
      pelapor: 'Warga C', 
      isi: 'Saya ingin melaporkan bahwa bantuan sosial (sembako) ...', 
      foto_bukti: null,
      lokasi: 'Balai Warga RW 02',
      alasan_penolakan: null,
      waktu_dibuat: '3 Nov 2025, 08:15' // <-- BARU
    },
    { 
      id: 4, 
      judul: 'Permintaan Fogging DBD', 
      status: 'ditolak',
      pelapor: 'Warga D', 
      isi: 'Permintaan fogging karena ada yang terkena DBD.', 
      foto_bukti: null,
      lokasi: 'Area RT 03',
      alasan_penolakan: 'Area Anda sudah masuk jadwal fogging rutin minggu depan.',
      waktu_dibuat: '1 Nov 2025, 11:15' // <-- BARU
    },
  ]);

  const [selectedPengaduan, setSelectedPengaduan] = useState(null);
  
  // --- STATE BARU UNTUK MODAL PENOLAKAN ---
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [currentRejection, setCurrentRejection] = useState({ id: null, alasan: '' });

  // --- FUNGSI HANDLER ---
  const handleStatusChange = (id, newStatus) => {
    setPengaduan(prev =>
      prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const handleTerima = (id) => {
    handleStatusChange(id, 'tertunda');
  };

  // --- FUNGSI DIPERBARUI ---
  const handleBukaModalTolak = (id) => {
    setCurrentRejection({ id: id, alasan: '' });
    setRejectionModalOpen(true);
  };
  
  const handleTutupModalTolak = () => {
    setRejectionModalOpen(false);
    setCurrentRejection({ id: null, alasan: '' });
  };
  
  const handleSubmitRejection = (e) => {
    e.preventDefault();
    const { id, alasan } = currentRejection;
    if (alasan.trim() === '') {
      alert('Alasan penolakan tidak boleh kosong.');
      return;
    }
    
    // Perbarui state pengaduan dengan status 'ditolak' dan alasannya
    setPengaduan(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'ditolak', alasan_penolakan: alasan } : p))
    );
    
    console.log(`MOCK REJECT: ID ${id}, Alasan: ${alasan}`);
    handleTutupModalTolak();
  };

  const handleBukaDetail = (pengaduan) => {
    setSelectedPengaduan(pengaduan);
  };

  const handleTutupModal = () => {
    setSelectedPengaduan(null);
  };

  const renderAksi = (pengaduan) => {
    switch (pengaduan.status) {
      case 'menunggu_persetujuan':
        return (
          <>
            <button 
              className={`${styles.actionButton} ${styles.actionButtonTerima}`}
              onClick={() => handleTerima(pengaduan.id)}
            >
              Terima
            </button>
            <button 
              className={`${styles.actionButton} ${styles.actionButtonTolak}`}
              onClick={() => handleBukaModalTolak(pengaduan.id)} // <-- Diperbarui
            >
              Tolak
            </button>
            <button 
              className={styles.actionButton}
              onClick={() => handleBukaDetail(pengaduan)}
            >
              Detail
            </button>
          </>
        );
      
      case 'tertunda':
      case 'diproses':
        return (
          <>
            <select
              className={styles.statusSelect}
              value={pengaduan.status}
              onChange={(e) => handleStatusChange(pengaduan.id, e.target.value)}
            >
              <option value="tertunda">Tertunda</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
            <button 
              className={styles.actionButton}
              onClick={() => handleBukaDetail(pengaduan)}
            >
              Detail
            </button>
          </>
        );
      
      case 'selesai':
      case 'ditolak':
        return (
          <button 
            className={styles.actionButton}
            onClick={() => handleBukaDetail(pengaduan)}
          >
            Lihat Detail
          </button>
        );
        
      default:
        return null;
    }
  };


  return (
    <>
      <div className={`${styles.card} animate-fadeIn`}>
        <h1 className={styles.title}>Manajemen Pengaduan (Admin)</h1>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Judul</th>
                <th>Waktu Dibuat</th> {/* <-- KOLOM BARU */}
                <th>Pelapor</th>
                <th>Lokasi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {pengaduan.map(p => (
                <tr key={p.id}>
                  <td className={styles.cellTitle}>{p.judul}</td>
                  
                  {/* --- SEL BARU UNTUK WAKTU --- */}
                  <td className={styles.cellWaktu}>{p.waktu_dibuat}</td>
                  
                  <td>{p.pelapor}</td>
                  <td className={styles.cellLokasi}>{p.lokasi}</td>
                  <td>
                    <StatusBadge status={p.status} />
                    {p.status === 'ditolak' && p.alasan_penolakan && (
                      <p className={styles.rejectionReasonInTable}>
                        {p.alasan_penolakan}
                      </p>
                    )}
                  </td>
                  <td className={styles.actionCell}>
                    {renderAksi(p)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DETAIL --- */}
      {selectedPengaduan && (
        <div className={styles.modalOverlay} onClick={handleTutupModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedPengaduan.judul}</h2>
              <button className={styles.modalCloseButton} onClick={handleTutupModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              
              {/* --- INFO WAKTU DITAMBAHKAN DI MODAL --- */}
              <p><strong>Waktu Dibuat:</strong> {selectedPengaduan.waktu_dibuat}</p>
              
              <p><strong>Pelapor:</strong> {selectedPengaduan.pelapor}</p>
              <p><strong>Lokasi:</strong> {selectedPengaduan.lokasi}</p>
              <p><strong>Status:</strong> <StatusBadge status={selectedPengaduan.status} /></p>
              <hr className={styles.modalDivider} />
              <p><strong>Isi Laporan:</strong></p>
              <p>{selectedPengaduan.isi}</p>
              
              {selectedPengaduan.foto_bukti && (
                <div className={styles.modalImageContainer}>
                  <p><strong>Foto Bukti:</strong></p>
                  <img 
                    src={selectedPengaduan.foto_bukti} 
                    alt="Foto Bukti" 
                    className={styles.modalImage}
                  />
                </div>
              )}

              {selectedPengaduan.status === 'ditolak' && selectedPengaduan.alasan_penolakan && (
                <div className={styles.rejectionInfo}>
                  <strong>Alasan Penolakan:</strong>
                  <p>{selectedPengaduan.alasan_penolakan}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL PENOLAKAN --- */}
      {rejectionModalOpen && (
        <div className={styles.modalOverlay} onClick={handleTutupModalTolak}>
          <form className={styles.modalContent} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmitRejection}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Tolak Pengaduan</h2>
              <button type="button" className={styles.modalCloseButton} onClick={handleTutupModalTolak}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <label htmlFor="alasan" className={styles.rejectionLabel}>
                Mohon masukkan alasan penolakan:
              </label>
              <textarea
                id="alasan"
                rows="4"
                className={styles.rejectionTextarea}
                value={currentRejection.alasan}
                onChange={(e) => setCurrentRejection(prev => ({ ...prev, alasan: e.target.value }))}
                required
              />
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.modalButtonCancel} onClick={handleTutupModalTolak}>
                Batal
              </button>
              <button type="submit" className={styles.modalButtonSubmitTolak}>
                Kirim Penolakan
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
export default AdminDashboard;

