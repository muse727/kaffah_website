'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from '../styles/Pagination.module.css';

const Pagination = ({ totalPages }) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) {
    return null; // Jangan tampilkan apa-apa jika hanya ada 1 halaman
  }

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Jumlah maksimal nomor halaman yang ditampilkan
    
    // Logika untuk menampilkan '...' jika halaman terlalu banyak
    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= maxPagesToShow) {
        for (let i = 1; i <= maxPagesToShow + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage > totalPages - maxPagesToShow) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - maxPagesToShow; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <nav className={styles.pagination}>
      {/* Tombol Previous */}
      <Link 
        href={currentPage > 1 ? `/berita?page=${currentPage - 1}` : '#'}
        className={`${styles.arrow} ${currentPage === 1 ? styles.disabled : ''}`}
      >
        &lt;
      </Link>

      {renderPageNumbers().map((number, index) =>
        typeof number === 'number' ? (
          <Link
            key={index}
            href={`/berita?page=${number}`}
            className={`${styles.pageNumber} ${currentPage === number ? styles.active : ''}`}
          >
            {number}
          </Link>
        ) : (
          <span key={index} className={styles.ellipsis}>{number}</span>
        )
      )}

      {/* Tombol Next */}
      <Link 
        href={currentPage < totalPages ? `/berita?page=${currentPage + 1}` : '#'}
        className={`${styles.arrow} ${currentPage === totalPages ? styles.disabled : ''}`}
      >
        &gt;
      </Link>
    </nav>
  );
};

export default Pagination;