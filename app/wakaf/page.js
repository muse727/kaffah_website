"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '../../components/PageWrapper';
import styles from '../../styles/Wakaf.module.css';
import Swal from 'sweetalert2';
import { FiShare2, FiClock, FiChevronRight } from 'react-icons/fi'; // 👈 Tambah icon panah

export default function WakafPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('cerita');
  const [loading, setLoading] = useState(false);
  
  const [campaignData, setCampaignData] = useState({
    title: "Pembangunan Ruang Kelas & Aula 3 Lantai SDIT Al Mubarak",
    target: 3197531396, 
    collected: 0, 
    donorCount: 0, 
    donors: []
  });

  const [listKabar, setListKabar] = useState([]);
  const [loadingKabar, setLoadingKabar] = useState(true);

  const [amount, setAmount] = useState(100000);
  const [customAmount, setCustomAmount] = useState('');
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [doa, setDoa] = useState('');
  const [isNiatChecked, setIsNiatChecked] = useState(false);

  useEffect(() => {
    const fetchDataDonasi = async () => {
      try {
        const res = await fetch('/api/wakaf');
        const json = await res.json();
        if (json.success) {
          setCampaignData(prev => ({
            ...prev, 
            collected: json.data.collected,
            donorCount: json.data.donorCount,
            donors: json.data.donors
          }));
        }
      } catch (err) { console.error("Error fetching donasi", err); }
    };

    const fetchDataKabar = async () => {
      try {
        const res = await fetch('/api/admin/kabar');
        const json = await res.json();
        if (json.success) setListKabar(json.data);
      } catch (err) { console.error("Error fetching kabar", err); } 
      finally { setLoadingKabar(false); }
    };

    fetchDataDonasi();
    fetchDataKabar();
  }, []);

  const percentage = campaignData.target > 0 
    ? Math.min((campaignData.collected / campaignData.target) * 100, 100) : 0;
  const finalAmount = amount > 0 ? amount : parseInt(customAmount || 0);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    Swal.fire({ icon: 'success', title: 'Link Disalin!', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
  };

  const handleNext = async () => {
    if (!finalAmount || finalAmount < 10000) return Swal.fire({ icon: 'warning', text: 'Minimal Wakaf Rp 10.000' }); 
    if (!nama.trim()) return Swal.fire({ icon: 'warning', text: 'Nama wajib diisi' }); 
    if (!wa.trim()) return Swal.fire({ icon: 'warning', text: 'Nomor WhatsApp wajib diisi' }); 

    setLoading(true);
    try {
      const res = await fetch('/api/wakaf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount, wakif_name: nama.trim(), wakif_phone: wa.trim(), niat_doa: doa.trim(), unit: 'RENOVASI GEDUNG' })
      });
      const data = await res.json();
      if (data.success) router.push(`/wakaf/payment/${data.id}`);
      else Swal.fire({ icon: 'error', title: 'Gagal', text: data.message || 'Gagal memproses data' });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Koneksi bermasalah' });
    } finally {
      setLoading(false);
    }
  };

  // 👇 FUNGSI BARU: BACA SELENGKAPNYA (POPUP BERITA) 👇
  const readMoreKabar = (kabar) => {
    Swal.fire({
      html: `
        <div style="text-align: left; font-family: 'Poppins', sans-serif;">
          ${kabar.gambar ? `<img src="/uploads/${kabar.gambar}" style="width: 100%; height: auto; border-radius: 12px; margin-bottom: 15px; object-fit: cover;" alt="Progres Pembangunan" />` : ''}
          <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
            📅 ${new Date(kabar.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <h2 style="color: #0f172a; margin-top: 0; font-size: 1.3rem; font-weight: 700; line-height: 1.4;">${kabar.judul}</h2>
          <div style="font-size: 0.95rem; color: #334155; line-height: 1.7; white-space: pre-wrap; margin-top: 15px;">${kabar.konten}</div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '600px', // Bikin popup agak lebar biar enak dibaca
      padding: '2rem',
      customClass: {
        popup: 'swal-wide-popup' // Opsional kalau mau styling tambahan
      }
    });
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        
        {/* HERO SECTION */}
        <div className={styles.heroSection}>
          <div className={styles.heroImage}>
            <img src="/images/sekolah-renov.png" alt="Pembangunan Sekolah" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;background:#f5f5f5;display:flex;align-items:center;justify-content:center;color:#888;font-size:0.9rem">Gambar Pembangunan</div>'; }} />
          </div>
          <div className={styles.heroContent}>
            <h1 className={styles.campaignTitle}>{campaignData.title}</h1>
            <div className={styles.progressWrapper}>
              <div className={styles.statsRow}>
                <span className={styles.amountCollected}>Rp {campaignData.collected.toLocaleString('id-ID')}</span>
                <span className={styles.amountTarget}>dari Rp {campaignData.target.toLocaleString('id-ID')}</span>
              </div>
              <div className={styles.progressBarBg}><div className={styles.progressBarFill} style={{ width: `${percentage}%` }}></div></div>
              <div className={styles.metaStats}><span><strong>{campaignData.donorCount}</strong> Orang Baik</span><span>{percentage.toFixed(1)}% Terkumpul</span></div>
            </div>
            <button className={styles.shareBtn} onClick={handleShare}><FiShare2 /> Bagikan Kebaikan</button>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className={styles.tabsNav}>
          <button className={`${styles.tabBtn} ${activeTab === 'cerita' ? styles.activeTab : ''}`} onClick={() => setActiveTab('cerita')}>Cerita</button>
          <button className={`${styles.tabBtn} ${activeTab === 'kabar' ? styles.activeTab : ''}`} onClick={() => setActiveTab('kabar')}>Kabar Terbaru</button>
          <button className={`${styles.tabBtn} ${activeTab === 'doa' ? styles.activeTab : ''}`} onClick={() => setActiveTab('doa')}>Doa & Donatur</button>
        </div>

        {/* TAB CONTENT */}
        <div className={styles.contentBody}>
          {activeTab === 'cerita' && (
            <div>
              <p><strong>Bismillah, Mari Bangun Peradaban.</strong></p>
              <p>SIT Al-Mubarak sedang berikhtiar membangun <strong>Ruang Kelas & Aula 3 Lantai</strong> untuk menunjang kenyamanan para santri penghafal Quran. Dengan fasilitas yang memadai, diharapkan proses belajar mengajar dan penghafalan Al-Quran dapat berjalan lebih optimal.</p>
              <div className={styles.rabCard}>
                <h4 className={styles.rabTitle}>Ringkasan RAB Pembangunan</h4>
                <ul className={styles.rabList}>
                  <li className={styles.rabItem}><span>🏗️ Persiapan & Pekerjaan Tanah</span><span className={styles.rabPrice}>Rp 32.299.600</span></li>
                  <li className={styles.rabItem}><span>🏢 Pekerjaan Lantai 1 (Lengkap)</span><span className={styles.rabPrice}>Rp 938.757.481</span></li>
                  <li className={styles.rabItem}><span>🏢 Pekerjaan Lantai 2 & 3 (Lengkap)</span><span className={styles.rabPrice}>Rp 2.258.773.915</span></li>
                  <li className={styles.rabTotal}><span>TOTAL KEBUTUHAN</span><span>Rp 3.197.531.396</span></li>
                </ul>
                <p className={styles.rabNote}>*Sesuai dokumen RAB 2025</p>
              </div>
            </div>
          )}

          {/* 👇 KABAR TERBARU PREMIUM UI 👇 */}
          {activeTab === 'kabar' && (
            <div>
              {loadingKabar ? (
                <div style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>Memuat kabar terbaru...</div>
              ) : listKabar.length === 0 ? (
                <div style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>
                  <p>Belum ada kabar terbaru untuk saat ini.</p>
                </div>
              ) : (
                // 👇 INI DIA KUNCI SCROLL-NYA BRO 👇
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.5rem',
                  maxHeight: '550px', /* Batas maksimal tinggi area berita */
                  overflowY: 'auto',  /* Bakal munculin scrollbar otomatis kalau berita kepanjangan */
                  paddingRight: '10px' /* Jarak dikit biar scrollbar gak nabrak border */
                }}>
                  {listKabar.map((kabar) => (
                    <div key={kabar.id} style={{ 
                      background: '#fff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '16px', 
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                      transition: 'transform 0.2s',
                      flexShrink: 0 // Biar card-nya gak gepeng kepencet
                    }}>
                      
                      {/* GAMBAR THUMBNAIL (DI ATAS) */}
                      {kabar.gambar && (
                        <div style={{ width: '100%', height: '180px', overflow: 'hidden', background: '#f8fafc' }}>
                           <img 
                             src={`/uploads/${kabar.gambar}`} 
                             alt="Kabar Terbaru" 
                             style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                           />
                        </div>
                      )}
                      
                      {/* AREA TEKS */}
                      <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>
                          <FiClock /> 
                          {new Date(kabar.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        
                        <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 8px 0', fontWeight: '700', lineHeight: '1.3' }}>
                          {kabar.judul}
                        </h3>
                        
                        <p style={{ 
                          fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', margin: '0 0 15px 0',
                          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>
                          {kabar.konten}
                        </p>
                        
                        <button 
                          onClick={() => readMoreKabar(kabar)}
                          style={{ 
                            background: 'transparent', color: '#1a5f51', border: 'none', padding: '0',
                            fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' 
                          }}
                        >
                          Baca Selengkapnya <FiChevronRight />
                        </button>
                      </div>
                      
                    </div>
                  ))}
                </div>
                // 👆 BATAS AREA SCROLL 👆
              )}
            </div>
          )}

          {activeTab === 'doa' && (
            <div>
              {campaignData.donors.length === 0 ? (
                <div style={{textAlign: 'center', color: '#94a3b8', padding: '20px'}}>Belum ada donatur. Jadilah yang pertama!</div>
              ) : (
                campaignData.donors.map((donor, index) => (
                  <div key={index} className={styles.donorItem}>
                    <div className={styles.donorAvatar}>{donor.wakifName.charAt(0).toUpperCase()}</div>
                    <div className={styles.donorInfo}>
                      <div className={styles.donorName}>{donor.wakifName} <span className={styles.donorDate}>• {new Date(donor.createdAt).toLocaleDateString('id-ID')}</span></div>
                      <div className={styles.donorAmount}>Rp {Number(donor.amount).toLocaleString('id-ID')}</div>
                      {donor.niatDoa && (<div className={styles.donorDoa}>"{donor.niatDoa}"</div>)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* DONATION FORM (TETAP SAMA) */}
        <div className={styles.donationBox}>
          <h3 className={styles.sectionTitle}>1. Pilih Nominal Wakaf</h3>
          <div className={styles.gridNominal}>
            {[50000, 100000, 200000, 500000, 1000000].map((val) => (
              <button key={val} className={`${styles.nominalBtn} ${amount === val ? styles.nominalActive : ''}`} onClick={() => { setAmount(val); setCustomAmount(''); }}>Rp {val.toLocaleString('id-ID')}</button>
            ))}
            <button className={`${styles.nominalBtn} ${amount === 0 ? styles.nominalActive : ''}`} onClick={() => { setAmount(0); setCustomAmount(''); }}>Nominal Lain</button>
          </div>
          
          {amount === 0 && (<input type="number" placeholder="Min Rp 10.000" className={styles.inputCustom} value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }} min="10000" />)}

          <div style={{marginTop: '24px'}}>
            <h3 className={styles.sectionTitle}>2. Data Pewakaf</h3>
            <input type="text" placeholder="Nama Lengkap (Hamba Allah)" className={styles.inputCustom} value={nama} onChange={(e) => setNama(e.target.value)} />
            <input type="tel" placeholder="Nomor WhatsApp (Aktif)" className={styles.inputCustom} value={wa} onChange={(e) => setWa(e.target.value)} />
            <textarea placeholder="Tulis Doa (Opsional)" className={styles.inputCustom} style={{height: '100px', resize: 'none'}} value={doa} onChange={(e) => setDoa(e.target.value)} />
          </div>

          <div className={styles.niatBox}>
            <input type="checkbox" id="niatCheck" className={styles.checkbox} checked={isNiatChecked} onChange={(e) => setIsNiatChecked(e.target.checked)} />
            <label htmlFor="niatCheck" className={styles.niatText}>Bismillah, saya niat mewakafkan harta ini untuk pembangunan sekolah karena Allah Ta'ala.</label>
          </div>

          <button className={styles.submitBtn} disabled={!finalAmount || !isNiatChecked || loading || finalAmount < 10000} onClick={handleNext}>{loading ? 'Memproses...' : 'Lanjut Pembayaran ➔'}</button>
        </div>

      </div>
    </PageWrapper>
  );
}