'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiDollarSign, FiImage, FiDownload, FiRefreshCw, FiTrash2, FiSearch, FiCalendar, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { MdOutlineContentCopy, MdOutlineWhatsapp } from 'react-icons/md';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import styles from '../dashboard.module.css'; 

export default function DataDonasi() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [successList, setSuccessList] = useState([]); 
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') fetchData();
  }, [status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wakaf/all');
      const data = await res.json();
      
      const onlySuccess = data.filter(item => item.status === 'SUCCESS');
      
      setSuccessList(onlySuccess);
      setFilteredList(onlySuccess);
      setLastUpdated(new Date().toLocaleTimeString('id-ID'));
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data", error);
      Swal.fire('Error', 'Gagal memuat data', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = successList.filter(item =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.whatsapp.includes(searchTerm) ||
      (item.kelas && item.kelas.toLowerCase().includes(searchTerm.toLowerCase())) // Bisa search by kelas juga
    );

    if (startDate) {
      results = results.filter(item => new Date(item.createdAt) >= new Date(startDate));
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      results = results.filter(item => new Date(item.createdAt) <= end);
    }
    
    setFilteredList(results);
  }, [searchTerm, successList, startDate, endDate]);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const copyWhatsApp = (number) => {
    navigator.clipboard.writeText(number);
    Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 }).fire({ icon: 'success', title: 'Tersalin!' });
  };

  const viewProof = (filename) => {
    if (filename) {
      Swal.fire({
        title: 'Bukti Transfer',
        html: `<img src="/uploads/${filename}" alt="Bukti" style="max-width: 100%; border-radius: 10px;" />`,
        showCloseButton: true, showConfirmButton: false, width: '80%'
      });
    } else {
      Swal.fire({ icon: 'info', title: 'Tidak ada bukti', text: 'Sistem mencatat tanpa bukti gambar.' });
    }
  };

  const handleDelete = async (id, nama) => {
    const { value: confirmed } = await Swal.fire({
      title: 'Hapus Data Riwayat?',
      text: `Menghapus data ${nama} akan mengurangi total riwayat donasi. Yakin?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!confirmed) return;

    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Gagal hapus');
      Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
      fetchData();
    } catch (error) {
      Swal.fire('Error', 'Gagal menghapus data', 'error');
    }
  };

  const exportToExcel = () => {
    if (filteredList.length === 0) {
      Swal.fire('Kosong', 'Tidak ada data untuk diexport.', 'info');
      return;
    }

    const dataToExport = filteredList.map((item, index) => ({
      'No': index + 1,
      'Tanggal': new Date(item.createdAt).toLocaleDateString('id-ID'),
      'Waktu': new Date(item.createdAt).toLocaleTimeString('id-ID'),
      'Nama Donatur': item.nama,
      'Kelas': item.kelas || 'Umum', // 👇 Masuk ke Excel
      'WhatsApp': item.whatsapp,
      'Nominal': item.nominal,
      'Status': 'Berhasil Terverifikasi'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Berhasil");
    XLSX.writeFile(workbook, `Rekap_Wakaf_Berhasil_${startDate || 'Awal'}_sd_${endDate || 'Akhir'}.xlsx`);
  };

  const totalUang = successList.reduce((acc, curr) => acc + curr.nominal, 0); 
  const totalDonatur = successList.length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const donasiBulanIni = successList.filter(item => {
    const d = new Date(item.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((acc, curr) => acc + curr.nominal, 0);

  if (loading) return <div className={styles.container}><div className={styles.loading}>Memuat Riwayat Donasi...</div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Riwayat Donasi Berhasil</h2>
          <p className={styles.pageSubtitle}>Semua transaksi yang sudah terverifikasi dan masuk ke kas.</p>
        </div>
        <div className={styles.lastUpdateInfo}>
          <FiRefreshCw style={{cursor: 'pointer'}} onClick={fetchData} title="Refresh" /> 
          Update: {lastUpdated}
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.card}><div className={styles.cardHeader}><div><h3 className={styles.cardTitle}>Total Dana Terkumpul</h3><p className={styles.cardValue}>{formatRupiah(totalUang)}</p></div><div className={`${styles.iconBox} ${styles.greenIcon}`}><FiDollarSign /></div></div><div className={styles.cardFooter}>Dari awal hingga saat ini</div></div>
        <div className={styles.card}><div className={styles.cardHeader}><div><h3 className={styles.cardTitle}>Pemasukan Bulan Ini</h3><p className={styles.cardValue}>{formatRupiah(donasiBulanIni)}</p></div><div className={`${styles.iconBox} ${styles.blueIcon}`}><FiTrendingUp /></div></div><div className={styles.cardFooter}>Bulan {new Date().toLocaleDateString('id-ID', {month: 'long', year: 'numeric'})}</div></div>
        <div className={styles.card}><div className={styles.cardHeader}><div><h3 className={styles.cardTitle}>Total Hamba Allah</h3><p className={styles.cardValue}>{totalDonatur} <span style={{fontSize: '1rem'}}>Orang</span></p></div><div className={`${styles.iconBox} ${styles.orangeIcon}`}><FiUsers /></div></div><div className={styles.cardFooter}>Donatur terverifikasi</div></div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.actionBar}>
           <div className={styles.tableTitleArea}>
              <h3 className={styles.tableTitle}>Data Terverifikasi</h3>
              <span className={styles.badgeCount}>{filteredList.length} Transaksi</span>
           </div>

           <div className={styles.filterArea}>
              <div className={styles.dateFilter}>
                 <FiCalendar className={styles.filterIcon} />
                 <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={styles.dateInput} title="Dari Tanggal"/>
                 <span className={styles.dateSeparator}>-</span>
                 <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={styles.dateInput} title="Sampai Tanggal"/>
                 {(startDate || endDate) && (<button onClick={() => {setStartDate(''); setEndDate('');}} className={styles.clearDateBtn}>X</button>)}
              </div>
              <div className={styles.searchWrapper}>
                 <FiSearch className={styles.searchIcon} />
                 <input type="text" placeholder="Cari donatur, WA, atau Kelas..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className={styles.actionButtonsGroup}>
                 <button onClick={exportToExcel} className={styles.btnExport}><FiDownload /> Export Excel</button>
              </div>
           </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th width="12%">Tanggal</th>
                <th width="25%">Donatur</th>
                {/* 👇 Header Kelas Baru 👇 */}
                <th width="10%">Kelas</th>
                <th width="18%">Nominal</th>
                <th width="15%">Bukti</th>
                <th width="20%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr><td colSpan="6" className={styles.emptyState}><div className={styles.emptyStateContent}><FiSearch size={40} className={styles.emptyIcon} /><p>Tidak ada riwayat donasi di rentang waktu ini.</p></div></td></tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.tdDate}>{new Date(item.createdAt).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</div>
                      <div className={styles.tdTime}>{new Date(item.createdAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})} WIB</div>
                    </td>
                    <td>
                      <div className={styles.tdName}>{item.nama}</div>
                      <div className={styles.waWrapper}>
                        <MdOutlineWhatsapp className={styles.waIcon} />
                        <span className={styles.waNumber}>{item.whatsapp}</span>
                        <button onClick={() => copyWhatsApp(item.whatsapp)} className={styles.copyBtn} title="Salin nomor"><MdOutlineContentCopy /></button>
                      </div>
                    </td>
                    {/* 👇 Tampilan Kelas Baru 👇 */}
                    <td>
                      <span style={{ fontSize: '0.85rem', color: '#475569', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' }}>
                        {item.kelas || 'Umum'}
                      </span>
                    </td>
                    <td className={styles.tdNominal}>{formatRupiah(item.nominal)}</td>
                    <td>
                      {item.buktiBayar ? (
                        <button onClick={() => viewProof(item.buktiBayar)} className={styles.btnProof}><FiImage /> Lihat</button>
                      ) : <span className={styles.noProof}>Tanpa Bukti</span>}
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                         <div className={styles.approvedStatus} style={{background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px'}}><FiCheckCircle /> Lunas</div>
                         <button onClick={() => handleDelete(item.id, item.nama)} className={styles.btnDelete} title="Hapus Data"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}