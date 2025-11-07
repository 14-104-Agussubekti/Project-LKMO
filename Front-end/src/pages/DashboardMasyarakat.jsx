import React, { useState } from 'react';
import StatusBadge from '../components/common/StatusBadge';
import styles from './DashboardMasyarakat.module.css';

const DashboardMasyarakat = () => {
  // --- Data Mockup Diperbarui ---
  // Menambahkan 'waktu_dibuat'
  const [pengaduan] = useState([
    { 
      id: 1, 
      judul: 'Jalan Rusak di RT 01', 
      status: 'tertunda', 
      lokasi: 'Depan rumah saya (RT 01/RW 05)',
      isi: 'Jalanan di depan rumah saya (RT 01/RW 05) rusak parah dan berlubang...',
      foto_bukti: 'https://placehold.co/600x400/ccc/999?text=Contoh+Foto+Jalan+Rusak',
      alasan_penolakan: null,
      waktu_dibuat: '4 Nov 2025, 15:01' // <-- BARU
    },
    { 
      id: 2, 
      judul: 'Lampu Jalan Mati', 
      status: 'diproses', 
      lokasi: 'Pertigaan utama desa',
      isi: 'Lampu jalan di pertigaan utama desa sudah mati 3 hari...',
      foto_bukti: null,
      alasan_penolakan: null,
      waktu_dibuat: '3 Nov 2025, 09:30' // <-- BARU
    },
    {
      id: 3,
      judul: 'Permintaan Fogging DBD',
      status: 'ditolak',
      lokasi: 'Area RT 03',
      isi: 'Permintaan fogging karena ada yang terkena DBD.',
      foto_bukti: null,
      alasan_penolakan: 'Area Anda sudah masuk jadwal fogging rutin minggu depan.',
      waktu_dibuat: '1 Nov 2025, 11:15' // <-- BARU
    }
  ]);

  // --- STATE BARU UNTUK MODAL ---
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);

  const handleBukaDetail = (pengaduan) => {
    setSelectedPengaduan(pengaduan);
  };

  const handleTutupModal = () => {
    setSelectedPengaduan(null);
  };

  return (
    <>
      <div className={`${styles.card} animate-fadeIn`}>
        <h1 className={styles.title}>Riwayat Pengaduan Saya</h1>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Judul Pengaduan</th>
                <th>Waktu Dibuat</th> {/* <-- KOLOM BARU */}
                <th>Lokasi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {pengaduan.length === 0 ? (
                <tr>
                  {/* Perbarui colSpan menjadi 5 */}
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    Anda belum membuat pengaduan.
                  </td>
                </tr>
              ) : (
                pengaduan.map(p => (
                  <tr key={p.id}>
                    <td className={styles.cellTitle}>{p.judul}</td>
                    
                    {/* --- SEL BARU UNTUK WAKTU --- */}
                    <td className={styles.cellWaktu}>{p.waktu_dibuat}</td>

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
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleBukaDetail(p)}
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL BARU UNTUK DETAIL PENGADUAN --- */}
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
    </>
  );
};

export default DashboardMasyarakat;

