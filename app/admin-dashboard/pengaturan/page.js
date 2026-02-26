'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiLock, FiUserPlus, FiTrash2, FiShield, FiUser } from 'react-icons/fi';
import Swal from 'sweetalert2';
import styles from '../dashboard.module.css';

export default function PengaturanAdmin() {
  const { data: session } = useSession();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('ADMIN');
  const [adminPassword, setAdminPassword] = useState('');

  const [adminList, setAdminList] = useState([]);

  // 👇 FETCH DATA ADMIN DARI DATABASE 👇
  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setAdminList(data);
    } catch (error) {
      console.error('Gagal ambil data admin', error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 👇 LOGIC GANTI PASSWORD 👇
  const handleGantiPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return Swal.fire('Error', 'Password baru dan konfirmasi tidak cocok!', 'error');
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Pake username dari session Next-Auth
        body: JSON.stringify({ username: session?.user?.name, oldPassword, newPassword }) 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire('Berhasil!', 'Password Anda berhasil diperbarui.', 'success');
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  // 👇 LOGIC TAMBAH ADMIN 👇
  const handleTambahAdmin = async (e) => {
    e.preventDefault();
    if (!newUsername || !newName || !adminPassword) {
      return Swal.fire('Error', 'Semua kolom wajib diisi!', 'warning');
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, username: newUsername, role: newRole, password: adminPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire('Berhasil!', 'Akun admin berhasil ditambahkan', 'success');
      setNewUsername(''); setNewName(''); setAdminPassword('');
      fetchAdmins(); // Refresh tabel
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  // 👇 LOGIC HAPUS ADMIN 👇
  const handleHapusAdmin = async (id, name, role) => {
    if (role === 'SUPERADMIN') {
      return Swal.fire('Ditolak!', 'Super Admin tidak bisa dihapus dari sini.', 'error');
    }

    const { value: confirmed } = await Swal.fire({
      title: 'Cabut Akses?',
      text: `Yakin ingin mencabut akses admin untuk ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Ya, Cabut Akses!'
    });

    if (confirmed) {
      try {
        const res = await fetch('/api/admin/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });

        if (!res.ok) throw new Error('Gagal menghapus');
        Swal.fire('Terhapus!', 'Akses admin berhasil dicabut.', 'success');
        fetchAdmins(); // Refresh tabel
      } catch (error) {
        Swal.fire('Error', 'Gagal mencabut akses', 'error');
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Pengaturan Sistem</h2>
          <p className={styles.pageSubtitle}>Kelola keamanan akun dan hak akses pengurus yayasan.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {/* PANEL GANTI PASSWORD */}
        <div className={styles.card} style={{ justifyContent: 'flex-start', gap: '1.5rem' }}>
          <div className={styles.cardHeader} style={{ marginBottom: '0' }}>
             <div>
                <h3 className={styles.cardTitle} style={{ color: '#0f172a', fontWeight: '700' }}>Ubah Password Anda</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Pastikan menggunakan password yang kuat.</p>
             </div>
             <div className={`${styles.iconBox} ${styles.orangeIcon}`}><FiLock /></div>
          </div>
          
          <form onSubmit={handleGantiPassword} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
               <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Password Lama</label>
               <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={styles.searchInput} style={{ width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }} required />
            </div>
            <div>
               <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Password Baru</label>
               <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={styles.searchInput} style={{ width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }} required />
            </div>
            <div>
               <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Konfirmasi Password Baru</label>
               <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={styles.searchInput} style={{ width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }} required />
            </div>
            <button type="submit" className={styles.btnExport} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              Simpan Password
            </button>
          </form>
        </div>

        {/* PANEL TAMBAH ADMIN */}
        <div className={styles.card} style={{ justifyContent: 'flex-start', gap: '1.5rem' }}>
          <div className={styles.cardHeader} style={{ marginBottom: '0' }}>
             <div>
                <h3 className={styles.cardTitle} style={{ color: '#0f172a', fontWeight: '700' }}>Tambah Pengurus Baru</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Buat akun untuk staf atau admin yayasan.</p>
             </div>
             <div className={`${styles.iconBox} ${styles.blueIcon}`}><FiUserPlus /></div>
          </div>

          <form onSubmit={handleTambahAdmin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Nama Lengkap</label>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className={styles.searchInput} style={{ width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }} placeholder="Misal: Ustadz Budi" required />
               </div>
               <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Username</label>
                  <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className={styles.searchInput} style={{ width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }} placeholder="admin_budi" required />
               </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Hak Akses</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className={styles.statusSelect} style={{ width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }}>
                     <option value="ADMIN">Admin Yayasan</option>
                     <option value="SUPERADMIN">Super Admin</option>
                  </select>
               </div>
               <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Password Awal</label>
                  <input type="text" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className={styles.searchInput} style={{ width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }} placeholder="Ketik password..." required />
               </div>
            </div>
            <button type="submit" className={styles.btnApprove} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', background: '#2563eb', color: 'white', border: 'none' }}>
              Buat Akun Pengurus
            </button>
          </form>
        </div>
      </div>

      {/* TABLE DAFTAR ADMIN */}
      <div className={styles.tableContainer}>
        <div className={styles.actionBar}>
           <div className={styles.tableTitleArea}>
              <h3 className={styles.tableTitle}>Daftar Pengurus Aktif</h3>
              <span className={styles.badgeCount}>{adminList.length} Akun</span>
           </div>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th width="30%">Nama & Username</th>
                <th width="30%">Hak Akses (Role)</th>
                <th width="20%">Status</th>
                <th width="20%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {adminList.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div className={styles.tdName} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <FiUser style={{ color: '#94a3b8' }}/> {admin.name}
                    </div>
                    <div className={styles.tdTime}>@{admin.username}</div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${admin.role === 'SUPERADMIN' ? styles.badgeSuccess : styles.badgePending}`} style={admin.role === 'ADMIN' ? {background: '#dbeafe', color: '#2563eb', border: '1px solid #bfdbfe'} : {}}>
                      <FiShield /> {admin.role === 'SUPERADMIN' ? 'Super Admin' : 'Admin Yayasan'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.approvedStatus} style={{ color: '#16a34a' }}>Aktif</div>
                  </td>
                  <td>
                    {admin.role !== 'SUPERADMIN' ? (
                       <button onClick={() => handleHapusAdmin(admin.id, admin.name, admin.role)} className={styles.btnDelete} title="Cabut Akses">
                         <FiTrash2 /> Cabut Akses
                       </button>
                    ) : (
                       <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}