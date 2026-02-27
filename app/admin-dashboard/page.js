'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiDollarSign, FiClock, FiCheckCircle, FiImage, FiDownload, FiRefreshCw, FiTrash2, FiSearch, FiCalendar, FiArchive } from 'react-icons/fi';
import { MdOutlineContentCopy, MdOutlineWhatsapp } from 'react-icons/md';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [listWakaf, setListWakaf] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') fetchData();
  }, [status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wakaf/all');
      const data = await res.json();
      setListWakaf(data);
      setFilteredList(data);
      setLastUpdated(new Date().toLocaleTimeString('id-ID'));
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data", error);
      Swal.fire('Error', 'Gagal memuat data', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = listWakaf.filter(item =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.whatsapp.includes(searchTerm) ||
      (item.kelas && item.kelas.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (filterStatus !== 'ALL') results = results.filter(item => item.status === filterStatus);
    if (startDate) results = results.filter(item => new Date(item.createdAt) >= new Date(startDate));
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      results = results.filter(item => new Date(item.createdAt) <= end);
    }
    
    setFilteredList(results);
    setCurrentPage(1); 
  }, [searchTerm, listWakaf, filterStatus, startDate, endDate]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const formatWA = (number) => {
    if (!number) return '';
    let formatted = number.replace(/\D/g, '');
    if (formatted.startsWith('0')) formatted = '62' + formatted.slice(1);
    return formatted;
  };

  const handleApprove = async (id, nama, whatsapp, nominal, kelas) => {
    const { value: confirmed } = await Swal.fire({
      title: 'Konfirmasi Donasi',
      html: `<div style="text-align: left; padding: 1rem 0;">
              <p><strong>Nama:</strong> ${nama}</p>
              <p><strong>Kelas:</strong> ${kelas || 'Umum'}</p>
              <p><strong>Nominal:</strong> ${formatRupiah(nominal)}</p>
             </div>
             <p>Apakah donasi ini sudah diverifikasi?</p>`,
      icon: 'question', showCancelButton: true, confirmButtonText: 'Ya, Konfirmasi', cancelButtonText: 'Batal'
    });
    if (!confirmed) return;

    try {
      const updateRes = await fetch('/api/admin/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!updateRes.ok) throw new Error('Update gagal');

      const text = `Assalamu'alaikum Wr. Wb. Kak *${nama}*,\n\nAlhamdulillah, wakaf sebesar *${formatRupiah(nominal)}* telah kami terima.\n\n_Semoga Allah memberikan pahala atas apa yang engkau berikan._ 🙏`;
      const linkWA = `https://wa.me/${formatWA(whatsapp)}?text=${encodeURIComponent(text)}`;

      await Swal.fire({ icon: 'success', title: 'Berhasil Dikonfirmasi!', showCancelButton: true, confirmButtonText: 'Kirim WhatsApp', cancelButtonText: 'Tutup' }).then((result) => {
        if (result.isConfirmed) window.open(linkWA, '_blank');
      });
      fetchData();
    } catch (error) { Swal.fire('Error', 'Gagal mengkonfirmasi', 'error'); }
  };

  const handleDelete = async (id, nama) => {
    const { value: confirmed } = await Swal.fire({ title: 'Hapus Data?', text: `Yakin ingin menghapus ${nama}?`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, Hapus!' });
    if (!confirmed) return;
    try {
      await fetch('/api/admin/delete', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      fetchData();
    } catch (error) { Swal.fire('Error', 'Gagal hapus', 'error'); }
  };

  const copyWhatsApp = (number) => { navigator.clipboard.writeText(number); Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 }).fire({ icon: 'success', title: 'Tersalin!' }); };

  const downloadSingleProof = async (filename, namaDonatur) => {
    try {
      const response = await fetch(`/uploads/${filename}`);
      const blob = await response.blob();
      saveAs(blob, `Bukti_${namaDonatur.replace(/\s+/g, '_')}_${filename}`);
    } catch (error) { Swal.fire('Error', 'Gagal mendownload gambar', 'error'); }
  };

  const viewProof = (filename, namaDonatur) => {
    if (filename) {
      Swal.fire({
        title: 'Bukti Transfer',
        html: `<img src="/uploads/${filename}" alt="Bukti" style="max-width: 100%; border-radius: 10px; margin-bottom: 15px;" />
               <button id="downloadBtn" class="swal2-confirm swal2-styled" style="background-color: #16a34a; display: flex; align-items: center; gap: 8px; margin: 0 auto;">Download Bukti</button>`,
        showCloseButton: true, showConfirmButton: false, width: '80%',
        didRender: () => { document.getElementById('downloadBtn').addEventListener('click', () => downloadSingleProof(filename, namaDonatur)); }
      });
    } else { Swal.fire('Info', 'Tidak ada bukti bayar.', 'info'); }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageIds = currentItems.map(item => item.id);
      setSelectedIds([...new Set([...selectedIds, ...currentPageIds])]);
    } else {
      const currentPageIds = currentItems.map(item => item.id);
      setSelectedIds(selectedIds.filter(id => !currentPageIds.includes(id)));
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleDownloadBulk = async (downloadAll = false) => {
    let itemsToDownload = [];
    if (downloadAll) {
      itemsToDownload = filteredList.filter(item => item.buktiBayar);
      if (itemsToDownload.length === 0) return Swal.fire('Oops', 'Tidak ada satupun bukti bayar di rentang tanggal ini.', 'info');
    } else {
      itemsToDownload = filteredList.filter(item => selectedIds.includes(item.id) && item.buktiBayar);
      if (itemsToDownload.length === 0) return Swal.fire('Oops', 'Data yang dipilih tidak memiliki bukti bayar.', 'warning');
    }

    Swal.fire({ title: 'Menyiapkan ZIP...', html: `Menggabungkan ${itemsToDownload.length} gambar...`, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }});

    try {
      const zip = new JSZip();
      const folder = zip.folder("Bukti_Transfer_Wakaf");

      for (let item of itemsToDownload) {
        const response = await fetch(`/uploads/${item.buktiBayar}`);
        const blob = await response.blob();
        const cleanName = item.nama.replace(/\s+/g, '_');
        const dateStr = new Date(item.createdAt).toISOString().split('T')[0];
        const ext = item.buktiBayar.split('.').pop();
        folder.file(`${cleanName}_${dateStr}_${item.id}.${ext}`, blob);
      }

      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, `Rekap_Bukti_Wakaf_${new Date().getTime()}.zip`);
      
      Swal.fire('Berhasil!', `${itemsToDownload.length} gambar berhasil diunduh.`, 'success');
      if (!downloadAll) setSelectedIds([]); 
    } catch (error) { Swal.fire('Error', 'Gagal membuat file ZIP', 'error'); }
  };

  const exportToExcel = () => {
    if (filteredList.length === 0) return Swal.fire('Kosong', 'Tidak ada data', 'info');
    const dataToExport = filteredList.map((item, index) => ({
      'No': index + 1, 'Tanggal': new Date(item.createdAt).toLocaleDateString('id-ID'), 'Waktu': new Date(item.createdAt).toLocaleTimeString('id-ID'), 
      'Nama Donatur': item.nama, 
      'Kelas': item.kelas || 'Umum', // 👇 Masuk ke Excel
      'WhatsApp': item.whatsapp, 'Nominal': item.nominal, 'Status': item.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Wakaf");
    XLSX.writeFile(workbook, `Rekap_Wakaf.xlsx`);
  };

  const totalUang = listWakaf.filter(item => item.status === 'SUCCESS').reduce((acc, curr) => acc + curr.nominal, 0); 
  const totalDonatur = listWakaf.filter(item => item.status === 'SUCCESS').length;
  const pendingCount = listWakaf.filter(item => item.status === 'PENDING').length;

  if (loading) return <div className={styles.container}><div className={styles.loading}>Memuat Data Dashboard...</div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div><h2 className={styles.pageTitle}>Ringkasan Wakaf</h2><p className={styles.pageSubtitle}>Pantau dan kelola semua transaksi donasi wakaf.</p></div>
        <div className={styles.lastUpdateInfo}><FiClock /> Terakhir diperbarui: {lastUpdated}</div>
      </div>

      <div className={styles.statsGrid}>
         <div className={styles.card}><div className={styles.cardHeader}><div><h3 className={styles.cardTitle}>Total Terkumpul</h3><p className={styles.cardValue}>{formatRupiah(totalUang)}</p></div><div className={`${styles.iconBox} ${styles.greenIcon}`}><FiDollarSign /></div></div></div>
         <div className={styles.card}><div className={styles.cardHeader}><div><h3 className={styles.cardTitle}>Total Donatur</h3><p className={styles.cardValue}>{totalDonatur} <span>Orang</span></p></div><div className={`${styles.iconBox} ${styles.blueIcon}`}><FiUsers /></div></div></div>
         <div className={styles.card}><div className={styles.cardHeader}><div><h3 className={styles.cardTitle}>Menunggu Konfirmasi</h3><p className={styles.cardValue}>{pendingCount} <span>Data</span></p></div><div className={`${styles.iconBox} ${styles.orangeIcon}`}><FiClock /></div></div></div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.actionBar}>
           <div className={styles.tableTitleArea}>
              <h3 className={styles.tableTitle}>Daftar Transaksi</h3>
              <span className={styles.badgeCount}>{filteredList.length} Transaksi</span>
              {selectedIds.length > 0 && (
                <button onClick={() => handleDownloadBulk(false)} style={{ marginLeft: '1rem', padding: '0.4rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                  <FiArchive /> Download {selectedIds.length} Pilihan (ZIP)
                </button>
              )}
           </div>

           <div className={styles.filterArea}>
              <div className={styles.dateFilter}>
                 <FiCalendar className={styles.filterIcon} />
                 <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={styles.dateInput} /><span>-</span>
                 <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={styles.dateInput} />
                 {(startDate || endDate) && (<button onClick={() => {setStartDate(''); setEndDate('');}} className={styles.clearDateBtn}>X</button>)}
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={styles.statusSelect}>
                 <option value="ALL">Semua Status</option><option value="PENDING">Pending</option><option value="SUCCESS">Berhasil</option>
              </select>
              <div className={styles.searchWrapper}>
                 <FiSearch className={styles.searchIcon} />
                 <input type="text" placeholder="Cari donatur, WA, atau Kelas..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className={styles.actionButtonsGroup}>
                 <button onClick={fetchData} className={styles.btnRefresh} title="Refresh"><FiRefreshCw /></button>
                 <button onClick={() => handleDownloadBulk(true)} style={{ padding: '0.6rem 1rem', background: '#eab308', color: 'white', border: 'none', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} title="Download Semua Bukti Bayar">
                    <FiArchive /> Semua Bukti
                 </button>
                 <button onClick={exportToExcel} className={styles.btnExport}><FiDownload /> Excel</button>
              </div>
           </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th width="5%" style={{ textAlign: 'center' }}>
                  <input type="checkbox" onChange={handleSelectAll} checked={currentItems.length > 0 && currentItems.every(item => selectedIds.includes(item.id))} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} />
                </th>
                <th width="12%">Tanggal</th>
                <th width="18%">Donatur</th>
                {/* 👇 Header Kelas Baru 👇 */}
                <th width="10%">Kelas</th>
                <th width="12%">Nominal</th>
                <th width="12%">Bukti</th>
                <th width="11%">Status</th>
                <th width="20%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr><td colSpan="8" className={styles.emptyState}><div className={styles.emptyStateContent}><FiSearch size={40} className={styles.emptyIcon} /><p>Tidak ada data transaksi yang ditemukan.</p></div></td></tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} style={{ backgroundColor: selectedIds.includes(item.id) ? '#f0f9ff' : 'transparent' }}>
                    <td style={{ textAlign: 'center' }}>
                       <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleSelectOne(item.id)} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} />
                    </td>
                    <td>
                      <div className={styles.tdDate}>{new Date(item.createdAt).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</div>
                      <div className={styles.tdTime}>{new Date(item.createdAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})} WIB</div>
                    </td>
                    <td>
                      <div className={styles.tdName}>{item.nama}</div>
                      <div className={styles.waWrapper}><MdOutlineWhatsapp className={styles.waIcon} /><span className={styles.waNumber}>{item.whatsapp}</span></div>
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
                        <button onClick={() => viewProof(item.buktiBayar, item.nama)} className={styles.btnProof}><FiImage /> Lihat</button>
                      ) : <span className={styles.noProof}>-</span>}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${item.status === 'SUCCESS' ? styles.badgeSuccess : styles.badgePending}`}>{item.status}</span>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                         {item.status === 'PENDING' ? (
                           <button className={styles.btnApprove} onClick={() => handleApprove(item.id, item.nama, item.whatsapp, item.nominal, item.kelas)}><FiCheckCircle /> Konfirmasi</button>
                         ) : (<div className={styles.approvedStatus}><FiCheckCircle /> OK</div>)}
                         <button onClick={() => handleDelete(item.id, item.nama)} className={styles.btnDelete}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Menampilkan <strong>{indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, filteredList.length)}</strong> dari <strong>{filteredList.length}</strong> data
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: currentPage === 1 ? '#f1f5f9' : 'white', color: currentPage === 1 ? '#94a3b8' : '#334155', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: '500', transition: 'all 0.2s' }}>Sebelumnya</button>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', margin: '0 0.5rem' }}>{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: currentPage === totalPages ? '#f1f5f9' : 'white', color: currentPage === totalPages ? '#94a3b8' : '#334155', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: '500', transition: 'all 0.2s' }}>Selanjutnya</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}