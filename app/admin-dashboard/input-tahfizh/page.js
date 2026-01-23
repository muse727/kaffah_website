'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './input.module.css';
import { FiUploadCloud, FiSave, FiArrowLeft, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

export default function InputTahfizhPage() {
  // STATE
  const [statusKelulusan, setStatusKelulusan] = useState('LULUS'); 
  const [form, setForm] = useState({ nama: '', juz: '', predikat: '', pesanSemangat: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // LOAD HISTORY SAAT PERTAMA BUKA
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
        const res = await fetch('/api/admin/get-santri'); 
        if(res.ok) {
            const data = await res.json();
            setHistoryData(data);
        }
    } catch (e) {
        console.error("Gagal ambil history", e);
    }
  };

  // HANDLE FILE UPLOAD
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // HANDLE SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalPosterUrl = null;

      // 1. Upload Gambar (Khusus LULUS)
      if (statusKelulusan === 'LULUS') {
        if (!file) {
            alert("⚠️ Santri LULUS wajib punya poster digital!");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.set("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadJson = await uploadRes.json();
        
        if (!uploadJson.success) throw new Error("Gagal upload gambar");
        finalPosterUrl = uploadJson.url;
      }

      // 2. Simpan Data ke Database
      const payload = {
          nama: form.nama,
          status: statusKelulusan, 
          juz: statusKelulusan === 'LULUS' ? form.juz : null,
          predikat: statusKelulusan === 'LULUS' ? form.predikat : null,
          posterUrl: finalPosterUrl,
          pesan: statusKelulusan === 'LULUS' ? 'Selamat Wisuda!' : (form.pesanSemangat || "Tetap semangat! Kegagalan adalah keberhasilan yang tertunda.") 
      };

      const simpanRes = await fetch("/api/admin/input-kelulusan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (simpanRes.ok) {
        alert("✅ DATA BERHASIL DISIMPAN!");
        // Reset Form
        setForm({ nama: '', juz: '', predikat: '', pesanSemangat: '' });
        setFile(null);
        setPreview(null);
        setStatusKelulusan('LULUS');
        if(document.getElementById('fileInput')) document.getElementById('fileInput').value = "";
        
        // Refresh Tabel History
        fetchHistory(); 
      } else {
        alert("❌ Gagal simpan data ke database");
      }

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Input Data Wisudawan</h1>
          <p className={styles.subtitle}>Panel Admin Yayasan Al-Mubarak</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formBody}>
          
          {/* PILIHAN STATUS */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Status Kelulusan Santri</label>
            <div className={styles.statusContainer}>
              {/* KARTU LULUS */}
              <div 
                className={`${styles.statusCard} ${statusKelulusan === 'LULUS' ? styles.activeLulus : ''}`}
                onClick={() => setStatusKelulusan('LULUS')}
              >
                <span className={styles.statusIcon}>🎓</span>
                <div className={styles.statusText}>Lulus Wisuda</div>
                {statusKelulusan === 'LULUS' && <FiCheckCircle className="inline-block mt-2 text-xl"/>}
              </div>

              {/* KARTU BELUM LULUS */}
              <div 
                className={`${styles.statusCard} ${statusKelulusan === 'BELUM_LULUS' ? styles.activeBelum : ''}`}
                onClick={() => setStatusKelulusan('BELUM_LULUS')}
              >
                <span className={styles.statusIcon}>💪</span>
                <div className={styles.statusText}>Belum Lulus</div>
                {statusKelulusan === 'BELUM_LULUS' && <FiCheckCircle className="inline-block mt-2 text-xl"/>}
              </div>
            </div>
          </div>

          {/* INPUT NAMA */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Nama Lengkap Santri</label>
            <input 
              type="text" 
              className={styles.input} 
              value={form.nama}
              onChange={(e) => setForm({...form, nama: e.target.value})}
              placeholder="Masukkan nama lengkap..."
              required 
            />
          </div>

          {/* FORM DINAMIS */}
          {statusKelulusan === 'LULUS' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Capaian Juz</label>
                        <select className={styles.select} value={form.juz} onChange={(e) => setForm({...form, juz: e.target.value})} required>
                            <option value="">Pilih Capaian...</option>
                            <option value="30 Juz">30 Juz (Khatam)</option>
                            <option value="Juz 30">Juz 30 (Amma)</option>
                            <option value="10 Juz">10 Juz</option>
                            <option value="5 Juz">5 Juz</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Predikat</label>
                        <select className={styles.select} value={form.predikat} onChange={(e) => setForm({...form, predikat: e.target.value})} required>
                            <option value="">Pilih Predikat...</option>
                            <option value="Mumtaz">Mumtaz (Istimewa)</option>
                            <option value="Jayyid Jiddan">Jayyid Jiddan (Sangat Baik)</option>
                            <option value="Jayyid">Jayyid (Baik)</option>
                        </select>
                    </div>
                </div>

                {/* UPLOAD BOX */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Poster Digital</label>
                    <div className={styles.uploadBox} onClick={() => document.getElementById('fileInput').click()}>
                        <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                        {preview ? (
                            <div>
                                <img src={preview} alt="Preview" className={styles.previewImage} />
                                <p className="text-green-700 font-bold text-sm">Ganti Gambar?</p>
                            </div>
                        ) : (
                            <div>
                                <FiUploadCloud className="text-5xl text-green-600 mb-3 mx-auto opacity-50" />
                                <p className="font-bold text-gray-600 text-lg">Klik untuk Upload Poster</p>
                                <p className="text-sm text-gray-400 mt-1">Format JPG/PNG • Maksimal 2MB</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          ) : (
             <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-orange-50 p-6 rounded-xl border border-orange-100">
                <div className={styles.formGroup}>
                    <label className={styles.label}>Pesan Penyemangat (Opsional)</label>
                    <textarea 
                        className={styles.textarea} 
                        rows="3"
                        placeholder="Tulis pesan khusus untuk santri ini..."
                        value={form.pesanSemangat}
                        onChange={(e) => setForm({...form, pesanSemangat: e.target.value})}
                    ></textarea>
                </div>
             </div>
          )}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            <FiSave className="mr-2 text-xl" /> {loading ? "Menyimpan Data..." : "SIMPAN DATA SANTRI"}
          </button>

        </form>

        {/* --- TABEL HISTORY (GANTENG) --- */}
        <div className={styles.historySection}>
            <div className={styles.historyHeader}>
                <h3 className={styles.historyTitle}>📋 Data Terakhir Diinput</h3>
                <button onClick={fetchHistory} className={styles.refreshBtn}>
                  <FiRefreshCw/> Refresh Data
                </button>
            </div>
            
            <div className={styles.tableContainer}>
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th>Nama Santri</th>
                            <th>Status Kelulusan</th>
                            <th style={{textAlign: 'center'}}>Poster</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData.length === 0 ? (
                            <tr>
                                <td colSpan="3" className={styles.emptyState}>
                                  Belum ada data inputan hari ini.
                                </td>
                            </tr>
                        ) : (
                            historyData.map((item, idx) => (
                                <tr key={idx}>
                                    <td style={{fontWeight: '600'}}>{item.nama}</td>
                                    <td>
                                        {item.status === 'LULUS' ? (
                                            <span className={styles.badgeLulus}>✅ LULUS</span>
                                        ) : (
                                            <span className={styles.badgeBelum}>💪 BELUM</span>
                                        )}
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        {item.posterUrl ? (
                                            <a href={item.posterUrl} target="_blank" className={styles.linkLihat}>
                                              👁️ Lihat
                                            </a>
                                        ) : (
                                            <span style={{color:'#cbd5e1'}}>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Link href="/admin-dashboard" className={styles.backLink}>
               <FiArrowLeft className="mr-2" /> Kembali ke Dashboard Utama
            </Link>
        </div>

      </div>
    </div>
  );
}