"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import styles from '../../../../styles/Payment.module.css'; // Pastikan path ke styles/Payment.module.css benar

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Fetch Data Invoice
  useEffect(() => {
    if (!params.id) return; // Jangan fetch kalau ID belum ada

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/wakaf/${params.id}`);
        
        // Cek dulu status response
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

  const handleUpload = async () => {
    if (!file) return Swal.fire({ icon:'warning', text: 'Pilih foto bukti transfer dulu ya kak' });
    setLoading(true);

    const formData = new FormData();
    formData.append('buktiBayar', file);

    try {
      const res = await fetch(`/api/wakaf/${params.id}`, { method: 'POST', body: formData });
      const json = await res.json();
      
      if (json.success) {
        // --- UPDATE DI SINI: TAMPILAN DOA ---
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
            router.push('/wakaf'); // Balik ke halaman utama setelah Aamiin
        });
        // ------------------------------------

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

        {/* Bank Info */}
        <div className={styles.bankSection}>
            <div className={styles.bankLabel}>Silakan Transfer ke:</div>
            <div className={styles.bankCard}>
                <div>
                    {/* Ganti src logo BSI jika perlu */}
                    <span style={{fontWeight:'800', color:'#1a5f51', fontSize:'1.2rem', display:'block', marginBottom:'5px'}}>BSI</span>
                    <div className={styles.bankNumber}>7253874184</div>
                    <div className={styles.bankName}>A.n Yayasan Wakfiah Al Mubarak</div>
                </div>
                <button onClick={() => copyToClipboard('7253874184')} className={styles.copyBtn}>
                    SALIN
                </button>
            </div>
        </div>

        {/* Upload Form */}
        <div className={styles.uploadSection}>
            <label className={styles.uploadLabel}>Upload Bukti Transfer</label>
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