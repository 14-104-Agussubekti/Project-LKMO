// src/pages/FormPengaduan.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // pastikan path ini benar
import styles from "./FormPengaduan.module.css";

const FormPengaduan = () => {
  // ---- STATE ----
  const [judul, setJudul] = useState("");
  const [jenisPengaduan, setJenisPengaduan] = useState("");
  const [showJenisLainnya, setShowJenisLainnya] = useState(false);
  const [jenisLainnya, setJenisLainnya] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [isi, setIsi] = useState("");
  const [foto, setFoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ---- HOOKS (HANYA DI SINI) ----
  const { authFetch } = useAuth(); // <-- PENTING: dipanggil **di dalam** function component
  const navigate = useNavigate();

  // ---- HANDLERS ----
  const handleJenisChange = (e) => {
    const value = e.target.value;
    setJenisPengaduan(value);
    setShowJenisLainnya(value === "Lainnya");
    if (value !== "Lainnya") setJenisLainnya("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setFoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validasi sederhana
    if (jenisPengaduan === "Lainnya" && jenisLainnya.trim() === "") {
      alert("Harap sebutkan jenis pengaduan lainnya.");
      return;
    }

    setSubmitting(true);
    const jenisFinal = jenisPengaduan === "Lainnya" ? jenisLainnya : jenisPengaduan;

    const formData = new FormData();
    formData.append("title", judul);
    formData.append("category", jenisFinal);
    formData.append("location", lokasi);
    formData.append("message", isi);
    if (foto) formData.append("attachment", foto);

    try {
      // gunakan authFetch supaya Authorization header otomatis dilekatkan
      const res = await authFetch("http://localhost:8080/api/complaints", {
        method: "POST",
        body: formData,
      });

      // debug friendly: baca body text / json
      const text = await res.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
      console.log("POST /api/complaints =>", res.status, body);

      if (!res.ok) {
        const msg = (body && body.error) || (typeof body === "string" ? body : "Gagal mengirim pengaduan");
        throw new Error(msg);
      }

      const ticket = body.ticket ?? body.id ?? "(tidak tersedia)";
      alert(`✅ Pengaduan berhasil dikirim. Kode tiket: ${ticket}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submit pengaduan:", err);
      alert(`Gagal mengirim pengaduan: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ---- RENDER ----
  return (
    <div className={`${styles.card} animate-fadeIn`}>
      <h1 className={styles.title}>Buat Pengaduan Baru</h1>

      <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
        <div>
          <label className={styles.label}>Judul Pengaduan</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            placeholder="Contoh: Jalan Rusak di RT 01"
          />
        </div>

        <div>
          <label className={styles.label}>Jenis Pengaduan</label>
          <select value={jenisPengaduan} onChange={handleJenisChange} required>
            <option value="" disabled>
              Pilih satu kategori...
            </option>
            <option value="Infrastruktur">Infrastruktur (Jalan, Jembatan, Air)</option>
            <option value="Lingkungan">Lingkungan (Sampah, Banjir, Pohon Tumbang)</option>
            <option value="Sosial">Sosial (Bantuan, Keamanan, Kependudukan)</option>
            <option value="Lainnya">Lainnya...</option>
          </select>
        </div>

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

        <div>
          <label className={styles.label}>Lokasi Kejadian</label>
          <input
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            required
            placeholder="Contoh: Depan Balai Desa, RT 01/RW 05"
          />
        </div>

        <div>
          <label className={styles.label}>Isi Pengaduan</label>
          <textarea
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            required
            rows="4"
            placeholder="Jelaskan detail pengaduan Anda di sini..."
          />
        </div>

        <div>
          <label className={styles.label}>Foto Bukti (Wajib)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
        </div>

        <button type="submit" disabled={submitting} className={styles.button}>
          {submitting ? "Mengirim..." : "Kirim Pengaduan"}
        </button>
      </form>
    </div>
  );
};

export default FormPengaduan;
