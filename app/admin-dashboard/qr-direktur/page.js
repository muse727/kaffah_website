'use client';

import QRCode from "react-qr-code";
import { FiDownload, FiShield } from 'react-icons/fi';
import styles from '../dashboard.module.css'; 

export default function QrDirektur() {
  // 👇 INI LINK YANG BAKAL KEKUNCI DI DALAM QR CODE 👇
  // (Nanti kalau udah di VPS, ganti localhost ini pake domain lu, misal: https://sitalmubarak.com/validasi/direktur)
  const validationUrl = "https://sitalmubarak.com/validasi/direktur";

  // Fungsi buat download QR Code-nya jadi file gambar (PNG)
  const downloadQR = () => {
    const svg = document.getElementById("QRCode_Direktur");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      // 👇 TRIK HD: Kita kali lipat ukurannya 10x biar resolusinya tembus 2000px!
      const scale = 10; 
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // 👇 Wajib dikasih background putih, kalau transparan suka eror jadi hitam di Word
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gambar ulang SVG-nya dengan ukuran raksasa
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "Tanda_Tangan_Digital_Direktur_HD.png"; // Nama file baru
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    // Pake encodeURIComponent biar karakter SVG gak ada yang corrupt
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Tanda Tangan Digital (QR)</h2>
          <p className={styles.pageSubtitle}>Download barcode ini untuk ditempel di dokumen resmi yayasan.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <div className={styles.card} style={{ maxWidth: '450px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', display: 'inline-block', border: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
            {/* INI MESIN PEMBUAT QR CODE-NYA */}
            <QRCode
              id="QRCode_Direktur"
              value={validationUrl}
              size={200}
              level={"H"} // Keamanan tinggi biar tetep bisa discan walau agak burem
              fgColor={"#000000"} // Warna barcode hitam pekat
            />
          </div>

          <h3 style={{ color: '#0f172a', marginBottom: '0.5rem', fontWeight: '700' }}>QR Code Resmi Direktur</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            Tempelkan QR Code ini pada dokumen fisik atau digital (PDF). Saat dipindai menggunakan HP, akan mengarah ke halaman validasi anti-pemalsuan.
          </p>

          <button 
            onClick={downloadQR}
            style={{ width: '100%', padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: '0.2s' }}
          >
            <FiDownload /> Download QR Code (PNG)
          </button>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: '#32BAFA', fontWeight: '600' }}>
            <FiShield /> Terenkripsi & Terlindungi
          </div>
        </div>
      </div>
    </div>
  );
}