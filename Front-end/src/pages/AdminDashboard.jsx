// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import StatusBadge from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
import styles from "./AdminDashboard.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";
const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const makeAttachmentUrl = (attachment) => {
  if (!attachment) return null;
  if (attachment.startsWith("http://") || attachment.startsWith("https://")) return attachment;
  return BACKEND_ORIGIN + (attachment.startsWith("/") ? attachment : `/${attachment}`);
};

const formatDate = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const AdminDashboard = () => {
  const { authFetch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pengaduan, setPengaduan] = useState([]);
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/complaints/all`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Gagal memuat pengaduan");
      }
      const data = await res.json();
      const mapped = data.map((c) => ({
        id: c.id,
        judul: c.title ?? c.judul ?? "(no title)",
        pelapor: c.user?.name ?? c.user?.email ?? c.pelapor ?? "-",
        lokasi: c.location ?? c.lokasi ?? "-",
        isi: c.message ?? c.isi ?? "",
        foto_bukti: makeAttachmentUrl(c.attachment ?? c.foto_bukti ?? null),
        alasan_penolakan: c.rejectionReason ?? c.alasan_penolakan ?? null,
        waktu_dibuat: formatDate(c.createdAt),
        rawStatus: c.status,
      }));
      setPengaduan(mapped);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, backendStatus, reason = null) => {
    setProcessing(true);
    try {
      const body = reason ? { status: backendStatus, reason } : { status: backendStatus };
      const res = await authFetch(`${API_BASE}/complaints/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const resp = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(resp.error || "Gagal update status");
      setPengaduan((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, rawStatus: resp.status ?? backendStatus, alasan_penolakan: resp.rejectionReason ?? p.alasan_penolakan }
            : p
        )
      );
      if (selected?.id === id)
        setSelected((s) => ({ ...s, rawStatus: resp.status ?? backendStatus, alasan_penolakan: resp.rejectionReason ?? s.alasan_penolakan }));
    } catch (err) {
      alert(err.message || "Gagal update status");
    } finally {
      setProcessing(false);
    }
  };

  const handleTerima = (id) => {
    if (!window.confirm("Terima pengaduan dan set jadi 'Diproses'?")) return;
    updateStatus(id, "in_progress");
  };

  const handleTolak = (id) => {
    const alasan = window.prompt("Masukkan alasan penolakan:");
    if (!alasan) return;
    updateStatus(id, "rejected", alasan);
  };

  return (
    <div className={`${styles.card} animate-fadeIn`}>
      <h1 className={styles.title}>Manajemen Pengaduan (Admin)</h1>

      {loading && <p style={{ padding: 12 }}>Memuat data...</p>}
      {error && <p style={{ padding: 12, color: "crimson" }}>Error: {error}</p>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>Judul</th>
              <th>Waktu</th>
              <th>Pelapor</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {!loading && pengaduan.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 18 }}>
                  Belum ada pengaduan.
                </td>
              </tr>
            ) : (
              pengaduan.map((p) => (
                <tr key={p.id}>
                  <td className={styles.cellTitle}>{p.judul}</td>
                  <td className={styles.cellWaktu}>{p.waktu_dibuat}</td>
                  <td>{p.pelapor}</td>
                  <td className={styles.cellLokasi}>{p.lokasi}</td>
                  <td>
                    <StatusBadge status={p.rawStatus} />
                    {p.rawStatus === "rejected" && p.alasan_penolakan && (
                      <div style={{ fontSize: 12, color: "#666" }}>{p.alasan_penolakan}</div>
                    )}
                  </td>
                  <td className={styles.actionCell}>
                    {p.rawStatus === "submitted" && (
                      <>
                        <button className={styles.actionButton} onClick={() => handleTerima(p.id)} disabled={processing}>
                          Terima
                        </button>
                        <button className={styles.actionButtonTolak} onClick={() => handleTolak(p.id)} disabled={processing}>
                          Tolak
                        </button>
                        <button className={styles.actionButton} onClick={() => setSelected(p)}>
                          Detail
                        </button>
                      </>
                    )}
                    {p.rawStatus === "in_progress" && (
                      <>
                        <button className={styles.actionButton} onClick={() => updateStatus(p.id, "resolved")} disabled={processing}>
                          Set Selesai
                        </button>
                        <button className={styles.actionButton} onClick={() => setSelected(p)}>
                          Detail
                        </button>
                      </>
                    )}
                    {(p.rawStatus === "resolved" || p.rawStatus === "rejected") && (
                      <button className={styles.actionButton} onClick={() => setSelected(p)}>
                        Detail
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selected.judul}</h2>
              <button className={styles.modalCloseButton} onClick={() => setSelected(null)}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                <strong>Waktu Dibuat:</strong> {selected.waktu_dibuat}
              </p>
              <p>
                <strong>Pelapor:</strong> {selected.pelapor}
              </p>
              <p>
                <strong>Lokasi:</strong> {selected.lokasi}
              </p>
              <p>
                <strong>Status:</strong> <StatusBadge status={selected.rawStatus} />
              </p>
              <hr className={styles.modalDivider} />
              <p>
                <strong>Isi Laporan:</strong>
              </p>
              <p>{selected.isi}</p>

              <div className={styles.modalImageContainer}>
                <p>
                  <strong>Foto Bukti:</strong>
                </p>
                {selected.foto_bukti ? (
                  <img
                    src={selected.foto_bukti}
                    alt="Foto Bukti"
                    style={{ maxWidth: "100%", borderRadius: 8, marginTop: 8, objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ color: "#777", fontSize: 14, marginTop: 8 }}>Tidak ada foto bukti.</div>
                )}
              </div>

              {selected.rawStatus === "rejected" && selected.alasan_penolakan && (
                <>
                  <hr />
                  <p>
                    <strong>Alasan Penolakan:</strong>
                  </p>
                  <p>{selected.alasan_penolakan}</p>
                </>
              )}

              <div style={{ marginTop: 12 }}>
                {selected.rawStatus === "submitted" && (
                  <>
                    <button
                      onClick={() => {
                        handleTerima(selected.id);
                        setSelected(null);
                      }}
                      disabled={processing}
                    >
                      Terima
                    </button>
                    <button
                      onClick={() => {
                        const r = prompt("Masukkan alasan penolakan:");
                        if (r) {
                          updateStatus(selected.id, "rejected", r);
                          setSelected(null);
                        }
                      }}
                      disabled={processing}
                    >
                      Tolak
                    </button>
                  </>
                )}
                {selected.rawStatus === "in_progress" && (
                  <button
                    onClick={() => {
                      updateStatus(selected.id, "resolved");
                      setSelected(null);
                    }}
                    disabled={processing}
                  >
                    Set Selesai
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
