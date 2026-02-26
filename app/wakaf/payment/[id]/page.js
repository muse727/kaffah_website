"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { MdAccountBalance, MdQrCodeScanner } from 'react-icons/md'; 
import styles from '../../../../styles/Payment.module.css'; 

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [metodeBayar, setMetodeBayar] = useState('bank');

  // Fetch Data Invoice
  useEffect(() => {
    if (!params.id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/wakaf/${params.id}`);
        if (!res.ok) {
            console.error("Gagal fetch:", res.status, res.statusText);
            Swal.fire("Error", "Gagal memuat data transaksi", "error");
            return;
        }
        const json = await res.json();
        if (json.success) {
            setData(json.data);
        } else {
            Swal.fire("Gagal", json.message, "error");
            router.push('/wakaf');
        }
      } catch (err) {
        console.error("Network Error:", err);
      }
    };
    fetchData();
  }, [params.id, router]);

  // Logic Timer 24 Jam
  useEffect(() => {
    if (!data) return;
    const interval = setInterval(() => {
      const created = new Date(data.createdAt).getTime();
      const expiry = created + (24 * 60 * 60 * 1000); 
      const now = new Date().getTime();
      const distance = expiry - now;

      if (distance < 0) {
        setTimeLeft("Waktu Habis");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  // 👇 INI MESIN YANG TADI GUA POTONG (UDAH BALIK) 👇
  const handleUpload = async () => {
    if (!file) return Swal.fire({ icon:'warning', text: 'Pilih foto bukti transfer dulu ya kak' });
    setLoading(true);

    const formData = new FormData();
    formData.append('buktiBayar', file);

    try {
      const res = await fetch(`/api/wakaf/${params.id}`, { method: 'POST', body: formData });
      const json = await res.json();
      
      if (json.success) {
        Swal.fire({
            icon: 'success', 
            title: 'Alhamdulillah, Jazakumullah Khairan!', 
            html: `
              <div style="font-size: 0.95rem; line-height: 1.6; color: #4a5568;">
                <p>Terima kasih <b>${data.nama}</b>, bukti transfer telah terkirim.</p>
                <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 15px; border-radius: 10px; margin: 15px 0;">
                  <p style="font-style: italic; color: #2f855a; font-weight: 600; font-size: 1.1rem; margin-bottom: 5px;">
                    "Aajaraka Allahu fiima a'thayta, wa baaraka fiima abqayta, wa ja'alahu laka thahuran"
                  </p>
                  <p style="font-size: 0.85rem; color: #276749;">
                    "Semoga Allah memberikan pahala atas apa yang engkau berikan, memberikan berkah atas apa yang engkau sisakan, dan menjadikannya sebagai pembersih bagimu."
                  </p>
                </div>
                <p>Admin akan segera memverifikasi dan mengirim notifikasi ke WhatsApp Anda.</p>
              </div>
            `,
            confirmButtonText: 'Aamiin 🤲',
            confirmButtonColor: '#1a5f51',
            allowOutsideClick: false
        }).then(() => {
            router.push('/wakaf'); 
        });

      } else {
        Swal.fire('Gagal Upload', json.message, 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Terjadi kesalahan sistem', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({ icon: 'success', title: 'Disalin!', timer: 1000, showConfirmButton: false, toast: true, position: 'top' });
  };

  if (!data) return <div className={styles.container}><p className={styles.loading}>Memuat Tagihan...</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* Header & Timer */}
        <div className={styles.header}>
            <p className={styles.timerLabel}>Selesaikan Pembayaran Dalam:</p>
            <div className={styles.timerBox}>
                ⏱️ {timeLeft}
            </div>
        </div>

        {/* Total Summary */}
        <div className={styles.summary}>
            <div className={styles.summaryTitle}>Total Tagihan Wakaf</div>
            <div className={styles.summaryAmount}>
                Rp {data.nominal.toLocaleString('id-ID')}
            </div>
            <div className={styles.summaryId}>
                ID Transaksi: <b>#{data.id}</b>
            </div>
        </div>

        {/* TAB PILIH METODE */}
        <div style={{ display: 'flex', gap: '10px', margin: '20px 0', padding: '0 20px' }}>
          <button 
            onClick={() => setMetodeBayar('bank')}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px', 
              border: metodeBayar === 'bank' ? '2px solid #1a5f51' : '1px solid #e2e8f0',
              background: metodeBayar === 'bank' ? '#f0fdf4' : 'white',
              color: metodeBayar === 'bank' ? '#1a5f51' : '#64748b',
              fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <MdAccountBalance size={22} /> Transfer Bank
          </button>
          <button 
            onClick={() => setMetodeBayar('qris')}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px', 
              border: metodeBayar === 'qris' ? '2px solid #1a5f51' : '1px solid #e2e8f0',
              background: metodeBayar === 'qris' ? '#f0fdf4' : 'white',
              color: metodeBayar === 'qris' ? '#1a5f51' : '#64748b',
              fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <MdQrCodeScanner size={22} /> Scan QRIS
          </button>
        </div>

        {/* KONTEN PEMBAYARAN */}
        {metodeBayar === 'bank' ? (
          <div className={styles.bankSection}>
              <div className={styles.bankLabel}>Silakan Transfer ke:</div>
              <div className={styles.bankCard}>
                  <div>
                      <span style={{fontWeight:'800', color:'#1a5f51', fontSize:'1.2rem', display:'block', marginBottom:'5px'}}>BSI</span>
                      <div className={styles.bankNumber}>7253874184</div>
                      <div className={styles.bankName}>A.n  Wakaf Pendidikan Yayasan Wakfiah Al Mubarak</div>
                  </div>
                  <button onClick={() => copyToClipboard('7253874184')} className={styles.copyBtn}>
                      SALIN
                  </button>
              </div>
          </div>
        ) : (
          <div className={styles.bankSection} style={{ textAlign: 'center' }}>
              <div className={styles.bankLabel}>Scan QRIS di bawah ini:</div>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>Buka m-Banking atau e-Wallet Anda (Gopay, Dana, dll), lalu scan gambar ini.</p>
              
              <div style={{ 
                background: 'white', 
                padding: '15px', 
                borderRadius: '15px', 
                display: 'inline-block', 
                border: '2px dashed #1a5f51',
                width: '100%',
                maxWidth: '340px' 
              }}>
                  <img 
                    src="/qris-bsi.jpeg" 
                    alt="QRIS Yayasan Al Mubarak" 
                    style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '8px' }} 
                  />
              </div>
          </div>
        )}

        {/* Upload Form */}
        <div className={styles.uploadSection}>
            <label className={styles.uploadLabel}>Upload Bukti {metodeBayar === 'qris' ? 'Scan/Bayar' : 'Transfer'}</label>
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files[0])} 
                className={styles.fileInput}
            />
            
            <button onClick={handleUpload} disabled={loading || !file} className={styles.submitBtn}>
                {loading ? 'Mengupload...' : 'Kirim Bukti Pembayaran'}
            </button>
        </div>

      </div>
    </div>
  );
}