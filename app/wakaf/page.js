"use client";
import { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
import styles from '../../styles/Wakaf.module.css';
import Swal from 'sweetalert2';

export default function WakafPage() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('cerita'); // Options: cerita | kabar | donatur
  const [loadingPay, setLoadingPay] = useState(false);
  
  // State Data Realtime (Default sebelum fetch)
  const [campaignData, setCampaignData] = useState({
    title: "Memuat Data...",
    target: 0,
    collected: 0,
    donorCount: 0,
    donors: [],
    description: "Sedang mengambil data terbaru...",
    // Default dummy kalo API belum connect, tapi nanti ketimpa fetch
  });

  // State Form Input
  const [amount, setAmount] = useState(100000); // Default 100rb
  const [customAmount, setCustomAmount] = useState('');
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [doa, setDoa] = useState('');
  const [isNiatChecked, setIsNiatChecked] = useState(false);

  // --- 1. FETCH DATA REALTIME (Pas Web Dibuka) ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/wakaf');
      const json = await res.json();
      if (json.success) {
        setCampaignData(json.data);
      }
    } catch (err) {
      console.error("Gagal ambil data API", err);
    }
  };

  // Logic Progress Bar (Max 100%)
  const percentage = campaignData.target > 0 
    ? Math.min((campaignData.collected / campaignData.target) * 100, 100) 
    : 0;

  // Logic Nominal Akhir (Pilihan vs Custom)
  const finalAmount = amount > 0 ? amount : parseInt(customAmount || 0);

  // --- 2. FITUR SHARE ---
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    Swal.fire({
      icon: 'success',
      title: 'Link Disalin!',
      text: 'Silakan bagikan ke WhatsApp atau media sosial.',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // --- 3. HANDLE DONASI (POST KE API) ---
  const handlePayment = async () => {
    if (!finalAmount || finalAmount < 10000) {
        Swal.fire({ icon: 'warning', title: 'Nominal Kurang', text: 'Minimal wakaf Rp 10.000 ya kak :)' });
        return;
    }

    setLoadingPay(true);
    const payload = { 
        amount: finalAmount, 
        wakif_name: nama, 
        wakif_phone: wa, 
        niat_doa: doa 
    };

    try {
      const res = await fetch('/api/wakaf', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
            icon: 'success',
            title: 'Bismillah!',
            text: 'Mengarahkan ke pembayaran aman...',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            // Redirect ke DOKU
            window.location.href = data.data.paymentUrl;
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: data.message });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error Koneksi', text: 'Cek internet kamu ya.' });
    } finally {
      setLoadingPay(false);
    }
  };

  // --- 4. RENDER UI ---
  return (
    <PageWrapper>
      <div className={styles.container}>
        
        {/* === HERO SECTION === */}
        <div className={styles.heroSection}>
          <div className={styles.heroImage}>
             {/* Ganti src ini dengan foto sekolah asli nanti */}
             <img src="/images/sekolah-renov.jpg" alt="Renovasi Sekolah" onError={(e) => {
                 e.target.onerror = null; 
                 e.target.parentNode.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#888;background:#eee;">FOTO RENOVASI SEKOLAH</div>'
             }} />
          </div>
          
          <div className={styles.heroContent}>
            <h1 className={styles.campaignTitle}>{campaignData.title}</h1>
            
            <div className={styles.progressWrapper}>
              <div className={styles.statsRow}>
                <span className={styles.amountCollected}>Rp {campaignData.collected.toLocaleString()}</span>
                <span className={styles.amountTarget}>dari Rp {campaignData.target.toLocaleString()}</span>
              </div>
              
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${percentage}%` }}></div>
              </div>
              
              <div className={styles.metaStats}>
                <span><strong>{campaignData.donorCount}</strong> Orang Baik</span>
                <span>{percentage.toFixed(1)}% Terkumpul</span>
              </div>
            </div>

            <button className={styles.shareBtn} onClick={handleShare}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
              Bagikan Kebaikan
            </button>
          </div>
        </div>

        {/* === TABS NAVIGATION === */}
        <div className={styles.tabsNav}>
          {['Cerita', 'Kabar Terbaru', 'Doa & Donatur'].map((tab) => {
            const key = tab.split(' ')[0].toLowerCase(); // cerita, kabar, doa
            return (
              <button 
                key={key}
                onClick={() => setActiveTab(key)}
                className={`${styles.tabBtn} ${activeTab === key ? styles.active : ''}`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* === TAB CONTENT === */}
        <div className={styles.contentBody}>
          
          {/* TAB 1: CERITA (Data Real dari RAB PDF) */}
          {activeTab === 'cerita' && (
            <div style={{lineHeight: '1.6', color: '#444'}}>
              <p><strong>Assalamualaikum Warahmatullahi Wabarakatuh.</strong></p>
              <p>Ayah Bunda dan Orang Baik, saat ini SIT Al-Mubarak sedang melakukan renovasi besar untuk kenyamanan belajar santri. Kondisi bangunan saat ini membutuhkan perbaikan mendesak di beberapa sektor vital.</p>
              
              <div className={styles.rabCard}>
                <h4 className={styles.rabTitle}>Rincian Kebutuhan Dana (RAB)</h4>
                <ul className={styles.rabList}>
                  <li className={styles.rabItem}>
                    <span>🛠️ Persiapan & Bongkaran</span>
                    <span className={styles.rabPrice}>Rp 7.336.000</span>
                  </li>
                  <li className={styles.rabItem}>
                    <span>🧱 Pasangan & Sanitasi (WC/Toren)</span>
                    <span className={styles.rabPrice}>Rp 34.300.000</span>
                  </li>
                  <li className={styles.rabItem}>
                    <span>🎨 Pengecatan (Dinding & Plafon)</span>
                    <span className={styles.rabPrice}>Rp 28.000.000</span>
                  </li>
                  <li className={styles.rabItem}>
                    <span>⚡ Instalasi Listrik & Lampu</span>
                    <span className={styles.rabPrice}>Rp 4.800.000</span>
                  </li>
                  <li className={styles.rabItem}>
                    <span>🚛 Pembersihan Puing</span>
                    <span className={styles.rabPrice}>Rp 2.460.000</span>
                  </li>
                  <li className={styles.rabTotal}>
                    <span>TOTAL KEBUTUHAN</span>
                    <span>Rp 76.896.000</span>
                  </li>
                </ul>
                <p style={{fontSize:'0.75rem', color:'#888', marginTop:'10px', fontStyle:'italic', textAlign:'right'}}>
                  *Sesuai Dokumen RAB Renovasi 2025
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: KABAR (Empty State) */}
          {activeTab === 'kabar' && (
            <div style={{textAlign:'center', padding:'30px 10px'}}>
              <div style={{fontSize:'3rem', marginBottom:'10px', opacity:0.5}}>📢</div>
              <h4 style={{margin:'0 0 10px 0', color:'#555'}}>Belum Ada Kabar Terbaru</h4>
              <p style={{color:'#888', fontSize:'0.9rem'}}>
                Update mengenai pencairan dana dan progres renovasi fisik akan ditampilkan di sini secara transparan.
              </p>
            </div>
          )}

          {/* TAB 3: DONATUR (Fetch dari DB) */}
          {activeTab === 'doa' && (
            <div>
              {campaignData.donors.length === 0 ? (
                <div style={{textAlign:'center', padding:'20px', color:'#888'}}>
                  Belum ada donatur. <br/><strong>Jadilah Orang Baik pertama!</strong>
                </div>
              ) : (
                campaignData.donors.map((donor, idx) => (
                  <div key={idx} className={styles.donorItem}>
                    <div className={styles.donorAvatar}>
                      {donor.wakifName.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.donorInfo}>
                      <div className={styles.donorName}>
                        {donor.wakifName} 
                        <span className={styles.donorDate}>• {new Date(donor.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className={styles.donorAmount}>
                        Berwakaf Rp {Number(donor.amount).toLocaleString()}
                      </div>
                      {donor.niatDoa && (
                        <div className={styles.donorDoa}>
                          "{donor.niatDoa}"
                          <div style={{marginTop:'3px', fontSize:'0.7rem', color:'#1a5f51', fontWeight:'bold'}}>Aamiin</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* === FORM DONASI === */}
        <div className={styles.donationBox}>
          <h3 className={styles.sectionTitle}>Pilih Nominal Wakaf</h3>
          
          <div className={styles.gridNominal}>
            {[50000, 100000, 200000, 500000, 1000000, 0].map((val) => (
              <button
                key={val}
                className={`${styles.nominalBtn} ${amount === val ? styles.active : ''}`}
                onClick={() => { setAmount(val); setCustomAmount(''); }}
              >
                {val === 0 ? 'Nominal Lain' : `Rp ${val.toLocaleString()}`}
              </button>
            ))}
          </div>

          {amount === 0 && (
            <input 
              type="number" 
              placeholder="Masukkan nominal (Min Rp 10.000)"
              className={styles.inputCustom}
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
            />
          )}

          <div style={{marginTop: '1.5rem'}}>
            <h3 className={styles.sectionTitle}>Data Pewakaf</h3>
            <input 
                type="text" placeholder="Nama Lengkap (Hamba Allah)" 
                className={styles.inputCustom}
                value={nama} onChange={(e) => setNama(e.target.value)}
            />
            <input 
                type="text" placeholder="Nomor WhatsApp (08xxx)" 
                className={styles.inputCustom}
                value={wa} onChange={(e) => setWa(e.target.value)}
            />
            <textarea 
              placeholder="Tulis Doa (Akan muncul di tab Doa)" 
              className={styles.inputCustom} style={{height: '80px', resize:'none'}} 
              value={doa} onChange={(e) => setDoa(e.target.value)}
            />
          </div>

          <div className={styles.niatBox}>
            <input 
              type="checkbox" id="niatCheck" 
              checked={isNiatChecked} onChange={(e) => setIsNiatChecked(e.target.checked)}
              style={{marginTop: '3px', cursor:'pointer'}}
            />
            <label htmlFor="niatCheck" className={styles.niatText}>
              Bismillah, saya niat mewakafkan harta ini karena Allah Ta’ala untuk pembangunan sekolah dan kemaslahatan umat.
            </label>
          </div>

          <button 
            className={styles.submitBtn} 
            disabled={!finalAmount || !isNiatChecked || loadingPay}
            onClick={handlePayment}
          >
            {loadingPay ? 'Memproses...' : `Lanjut Pembayaran (Rp ${finalAmount.toLocaleString()})`}
          </button>
          
          <div style={{textAlign:'center', marginTop:'15px', fontSize:'0.75rem', color:'#adb5bd'}}>
            Pembayaran diverifikasi otomatis oleh sistem
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}