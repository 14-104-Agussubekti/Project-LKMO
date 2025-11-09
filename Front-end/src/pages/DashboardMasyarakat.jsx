// src/pages/DashboardMasyarakat.jsx
import React, { useEffect, useState } from "react";
import StatusBadge from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
import styles from "./DashboardMasyarakat.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";
const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const makeAttachmentUrl = (attachment) => {
  if (!attachment) return null;

  // already absolute
  if (/^https?:\/\//i.test(attachment)) return attachment;

  // normalize backslashes to slashes
  let a = attachment.replace(/\\/g, "/").trim();

  // remove leading "./" or leading slash
  a = a.replace(/^\.?\//, "");

  // backend origin (ensure no trailing slash)
  const backend = BACKEND_ORIGIN.replace(/\/$/, "");

  // If a already contains backend origin (odd case)
  if (a.startsWith(backend)) return a;

  // If a already starts with "uploads" or "uploads/"
  if (/^uploads\//i.test(a)) {
    return backend + "/" + encodeURI(a);
  }

  // If a looks like "/uploads/<file>" handled here
  if (/^\/?uploads\//i.test(attachment)) {
    const pathPart = attachment.replace(/^\/+/, "");
    return backend + "/" + encodeURI(pathPart);
  }

  // fallback: assume it's filename, place under /uploads/
  return backend + "/uploads/" + encodeURI(a);
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

const DashboardMasyarakat = () => {
  const { authFetch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pengaduan, setPengaduan] = useState([]);
  const [selected, setSelected] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadMine = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/complaints/mine`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Gagal memuat pengaduan");
      }
      const data = await res.json();
      const mapped = data.map((c) => ({
        id: c.id,
        judul: c.title ?? c.judul ?? "(Tanpa Judul)",
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
    loadMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengaduan ini? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      setDeletingId(id);
      const res = await authFetch(`${API_BASE}/complaints/${id}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Gagal menghapus pengaduan");
      }
      // remove from state
      setPengaduan((prev) => prev.filter((p) => p.id !== id));
      // if currently viewing modal for this id, close it
      if (selected?.id === id) setSelected(null);
      alert("Pengaduan berhasil dihapus.");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Gagal menghapus pengaduan.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={`${styles.card} animate-fadeIn`}>
      <h1 className={styles.title}>Riwayat Pengaduan Saya</h1>

      {loading && <p style={{ padding: 12 }}>Memuat pengaduan...</p>}
      {error && <p style={{ padding: 12, color: "crimson" }}>Error: {error}</p>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>Judul</th>
              <th>Waktu</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {!loading && pengaduan.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 18 }}>
                  Anda belum membuat pengaduan.
                </td>
              </tr>
            ) : (
              pengaduan.map((p) => (
                <tr key={p.id}>
                  <td className={styles.cellTitle}>{p.judul}</td>
                  <td className={styles.cellWaktu}>{p.waktu_dibuat}</td>
                  <td className={styles.cellLokasi}>{p.lokasi}</td>
                  <td>
                    <StatusBadge status={p.rawStatus} />
                    {p.rawStatus === "rejected" && p.alasan_penolakan && (
                      <div style={{ fontSize: 12, color: "#666" }}>{p.alasan_penolakan}</div>
                    )}
                  </td>
                  <td className={styles.actionCell}>
                    <button className={styles.actionButton} onClick={() => setSelected(p)}>
                      Lihat Detail
                    </button>

                    <button
                      className={styles.actionButtonTolak ? styles.actionButtonTolak : styles.actionButton}
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      style={{ marginLeft: 8 }}
                    >
                      {deletingId === p.id ? "Menghapus..." : "Hapus"}
                    </button>
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
                    onError={(e) => {
                      console.warn("Image failed to load:", selected.foto_bukti);
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "data:image/svg+xml;utf8," +
                        encodeURIComponent(
                          `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23777' font-size='20'>Gagal memuat gambar</text></svg>`
                        );
                    }}
                  />
                ) : (
                  <div style={{ color: "#777", fontSize: 14, marginTop: 8 }}>Tidak ada foto bukti.</div>
                )}
              </div>

              {selected.rawStatus === "rejected" && selected.alasan_penolakan && (
                <div className={styles.rejectionInfo}>
                  <strong>Alasan Penolakan:</strong>
                  <p>{selected.alasan_penolakan}</p>
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <button
                  onClick={() => {
                    handleDelete(selected.id);
                  }}
                  disabled={deletingId === selected.id}
                  style={{
                    backgroundColor: "#e03e2d",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: 0,
                    cursor: "pointer",
                  }}
                >
                  {deletingId === selected.id ? "Menghapus..." : "Hapus Pengaduan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMasyarakat;
