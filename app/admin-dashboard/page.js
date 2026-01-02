'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiDollarSign, FiClock, FiCheckCircle, FiSearch, FiLogOut, FiImage, FiFilter, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { MdOutlineContentCopy, MdOutlineWhatsapp } from 'react-icons/md';
import Swal from 'sweetalert2';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [listWakaf, setListWakaf] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [lastUpdated, setLastUpdated] = useState('');

  // Proteksi Halaman
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') fetchData();
  }, [status, router]);

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wakaf/all');
      const data = await res.json();
      setListWakaf(data);
      setFilteredList(data);
      setLastUpdated(new Date().toLocaleTimeString('id-ID'));
      
      // SweetAlert untuk loading sukses
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      
      Toast.fire({
        icon: 'success',
        title: 'Data berhasil dimuat'
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal memuat data',
        text: 'Silakan coba lagi',
      });
      setLoading(false);
    }
  };

  // Filter dan Search Logic
  useEffect(() => {
    let results = listWakaf.filter(item =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.whatsapp.includes(searchTerm)
    );
    
    if (filterStatus !== 'ALL') {
      results = results.filter(item => item.status === filterStatus);
    }
    
    setFilteredList(results);
  }, [searchTerm, listWakaf, filterStatus]);

  // Format WA Number
  const formatWA = (number) => {
    if (!number) return '';
    let formatted = number.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
      formatted = '62' + formatted.slice(1);
    }
    return formatted;
  };

  // Logic Konfirmasi + Kirim WA
  const handleApprove = async (id, nama, whatsapp, nominal) => {
    const { value: confirmed } = await Swal.fire({
      title: 'Konfirmasi Donasi',
      html: `
        <div style="text-align: left; padding: 1rem 0;">
          <p><strong>Nama:</strong> ${nama}</p>
          <p><strong>Nominal:</strong> ${formatRupiah(nominal)}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        </div>
        <p>Apakah donasi ini sudah diterima dan diverifikasi?</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#166534',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Konfirmasi',
      cancelButtonText: 'Batal',
      reverseButtons: true
    });

    if (!confirmed) return;

    try {
      // 1. Update Database
      const updateRes = await fetch('/api/admin/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!updateRes.ok) throw new Error('Update gagal');

      // 2. Kirim Notifikasi WhatsApp
      const rupiah = formatRupiah(nominal);
      const text = `Assalamu'alaikum Wr. Wb. Kak *${nama}*,\n\nAlhamdulillah, kami dari Yayasan Al Mubarak menginformasikan bahwa wakaf pembangunan gedung sebesar *${rupiah}* telah kami terima dan verifikasi.\n\n_Doa kami: Semoga Allah memberikan pahala atas apa yang engkau berikan, memberikan berkah atas apa yang engkau sisakan, dan menjadikannya sebagai pembersih bagimu._\n\nTerima kasih atas kepercayaannya. 🙏`;
      
      const linkWA = `https://wa.me/${formatWA(whatsapp)}?text=${encodeURIComponent(text)}`;

      // 3. Tampilkan Success Modal
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil Dikonfirmasi!',
        html: `
          <div style="text-align: center; padding: 1rem 0;">
            <p>Status donasi telah diperbarui.</p>
            <p>Membuka WhatsApp untuk mengirim notifikasi...</p>
            <div style="margin: 1rem 0; padding: 1rem; background: #f0fdf4; border-radius: 10px; border-left: 4px solid #166534;">
              <p style="margin: 0; font-size: 0.9rem; color: #166534;">💡 Tips: Jika WhatsApp tidak terbuka, pastikan Anda login di browser</p>
            </div>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Buka WhatsApp',
        confirmButtonColor: '#25D366',
        showCancelButton: true,
        cancelButtonText: 'Nanti',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(linkWA, '_blank', 'noopener,noreferrer');
        }
      });

      fetchData(); // Refresh data

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal mengkonfirmasi',
        text: 'Silakan coba lagi',
      });
    }
  };

  // Lihat Bukti Logic
  const viewProof = (filename) => {
    if (filename) {
      Swal.fire({
        title: 'Bukti Transfer',
        html: `<img src="/uploads/${filename}" alt="Bukti Transfer" style="max-width: 100%; border-radius: 10px;" />`,
        showCloseButton: true,
        showConfirmButton: false,
        width: '80%'
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Tidak ada bukti',
        text: 'User tidak mengupload bukti transfer.',
      });
    }
  };

  // Copy WhatsApp Number
  const copyWhatsApp = (number) => {
    navigator.clipboard.writeText(number);
    
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    
    Toast.fire({
      icon: 'success',
      title: 'Nomor WhatsApp disalin!'
    });
  };

  // Export Data (contoh sederhana)
  const exportData = () => {
    const dataStr = JSON.stringify(filteredList, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `data-wakaf-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Stats Calculation
  const totalUang = listWakaf
    .filter(item => item.status === 'SUCCESS')
    .reduce((acc, curr) => acc + curr.nominal, 0); 
  
  const totalDonatur = listWakaf.filter(item => item.status === 'SUCCESS').length;
  const pendingCount = listWakaf.filter(item => item.status === 'PENDING').length;
  const recentDonations = listWakaf.filter(item => {
    const today = new Date();
    const donationDate = new Date(item.createdAt);
    return (today - donationDate) / (1000 * 60 * 60 * 24) <= 7;
  }).length;

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(num);

  if (loading) return (
    <div className={styles.container}>
      <div className={styles.loading}>Memuat Data Dashboard...</div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.title}>
          <h1>Dashboard Wakaf </h1>
          <p>Admin Panel Yayasan Al Mubarak</p>
          <small style={{color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem'}}>
            Terakhir diperbarui: {lastUpdated}
          </small>
        </div>
        <div className={styles.userProfile}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <span>👋 <b>{session?.user?.name}</b></span>
              <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>Administrator</div>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutBtn}>
  <FiLogOut /> Keluar
</button>
        </div>
      </header>

      {/* CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <div className={`${styles.iconBox} ${styles.greenIcon}`}><FiDollarSign /></div>
          <div className={styles.cardInfo}>
            <h3>Terkumpul</h3>
            <p>{formatRupiah(totalUang)}</p>
            <small style={{color: '#64748b', fontSize: '0.8rem'}}>
              {listWakaf.length} transaksi total
            </small>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={`${styles.iconBox} ${styles.blueIcon}`}><FiUsers /></div>
          <div className={styles.cardInfo}>
            <h3>Donatur</h3>
            <p>{totalDonatur} Orang</p>
            <small style={{color: '#64748b', fontSize: '0.8rem'}}>
              {recentDonations} donasi minggu ini
            </small>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={`${styles.iconBox} ${styles.orangeIcon}`}><FiClock /></div>
          <div className={styles.cardInfo}>
            <h3>Pending</h3>
            <p>{pendingCount} Transaksi</p>
            <small style={{color: '#64748b', fontSize: '0.8rem'}}>
              Menunggu konfirmasi
            </small>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={`${styles.iconBox}`} style={{color: '#7c3aed'}}><FiRefreshCw /></div>
          <div className={styles.cardInfo}>
            <h3>Refresh Data</h3>
            <p>Update Sekarang</p>
            <button 
              onClick={fetchData}
              style={{
                background: 'transparent',
                border: '1px solid #e2e8f0',
                padding: '0.3rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                marginTop: '0.5rem',
                color: '#64748b',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.color = '#334155';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#64748b';
              }}
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Daftar Transaksi Wakaf</div>
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '0.6rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.85rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="SUCCESS">Success</option>
            </select>
            
            <div className={styles.searchWrapper}>
              <input 
                type="text" 
                placeholder="Cari nama/no. WA..." 
                className={styles.searchInput} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={exportData}
              style={{
                padding: '0.6rem 1rem',
                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#475569',
                fontWeight: '500'
              }}
            >
              <FiDownload /> Export
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{width: '100px'}}>Tanggal</th>
                <th>Donatur</th>
                <th style={{width: '150px'}}>Nominal</th>
                <th style={{width: '100px'}}>Bukti</th>
                <th style={{width: '120px'}}>Status</th>
                <th style={{width: '150px'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
                    {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data transaksi'}
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{fontWeight:'500'}}>
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {day: '2-digit', month: 'short'})}
                      </div>
                      <div style={{fontSize:'0.75rem', color:'#94a3b8'}}>
                        {new Date(item.createdAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </td>
                    <td>
                      <div style={{fontWeight:'600', color: '#1e293b'}}>{item.nama}</div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.25rem'
                      }}>
                        <MdOutlineWhatsapp style={{color: '#25D366'}} />
                        <span style={{fontSize:'0.85rem', color:'#64748b'}}>{item.whatsapp}</span>
                        <button 
                          onClick={() => copyWhatsApp(item.whatsapp)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            color: '#94a3b8'
                          }}
                          title="Salin nomor"
                        >
                          <MdOutlineContentCopy size={14} />
                        </button>
                      </div>
                    </td>
                    <td style={{fontWeight:'700', color: '#166534'}}>
                      {formatRupiah(item.nominal)}
                    </td>
                    <td>
                      {item.buktiBayar ? (
                        <button onClick={() => viewProof(item.buktiBayar)} className={styles.btnProof}>
                            <FiImage /> Lihat
                        </button>
                      ) : <span style={{color:'#cbd5e1', fontSize:'0.8rem', fontStyle: 'italic'}}>-</span>}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${item.status === 'SUCCESS' ? styles.success : styles.pending}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === 'PENDING' ? (
                        <button 
                          className={styles.actionBtn} 
                          onClick={() => handleApprove(item.id, item.nama, item.whatsapp, item.nominal)}
                        >
                          <FiCheckCircle /> Konfirmasi
                        </button>
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.85rem',
                          color: '#166534'
                        }}>
                          <FiCheckCircle /> Terkonfirmasi
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Table */}
        <div style={{
          padding: '1rem 2rem',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <div>
            Menampilkan <strong>{filteredList.length}</strong> dari <strong>{listWakaf.length}</strong> transaksi
          </div>
          <div>
            {filteredList.filter(item => item.status === 'PENDING').length} transaksi menunggu konfirmasi
          </div>
        </div>
      </div>
    </div>
  );
}