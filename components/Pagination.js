// components/AdvancedPagination.js
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const AdvancedPagination = ({ pageInfo, currentPage = 1, totalPages = 1 }) => {
  const router = useRouter();
  const [visiblePages, setVisiblePages] = useState([]);

  useEffect(() => {
    // Generate visible page numbers
    const generateVisiblePages = () => {
      const pages = [];
      const delta = 2; // Number of pages to show on each side of current page
      
      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 || 
          i === totalPages || 
          (i >= currentPage - delta && i <= currentPage + delta)
        ) {
          pages.push(i);
        } else if (i === currentPage - delta - 1 || i === currentPage + delta + 1) {
          pages.push('...');
        }
      }
      
      return pages;
    };

    setVisiblePages(generateVisiblePages());
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page === '...' || page === currentPage) return;
    router.push(`/berita?page=${page}`);
  };

  const { hasNextPage, hasPreviousPage, endCursor, startCursor } = pageInfo || {};

  const handleNavigation = (url) => {
    router.push(url);
  };

  return (
    <>
      <style jsx>{`
        .pagination-advanced {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin: 4rem 0 2rem;
          padding: 2rem 0;
          border-top: 1px solid #f0f0f0;
        }

        .pagination-button {
          padding: 0.75rem 1.25rem;
          background: white;
          color: #333;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          min-height: 48px;
          min-width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .pagination-button:hover:not(.disabled):not(.active) {
          color: #107163;
          transform: translateY(-1px);
        }

        .pagination-button.active {
          background: linear-gradient(135deg, #107163 0%, #107163 100%);
          color: white;
        }

        .pagination-button.disabled {
          background: #f8f9fa;
          color: #6c757d;
          cursor: not-allowed;
          border-color: #dee2e6;
        }

        .pagination-button.ellipsis {
          background: transparent;
          border: none;
          cursor: default;
          min-width: auto;
        }

        .pagination-button.ellipsis:hover {
          transform: none;
          border: none;
        }

        .nav-button {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #107163 0%, #107163 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .nav-button:hover:not(.disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .nav-button.disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .nav-button.prev {
          margin-right: 1rem;
        }

        .nav-button.next {
          margin-left: 1rem;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .pagination-advanced {
            flex-wrap: wrap;
            gap: 0.25rem;
          }

          .pagination-button {
            padding: 0.5rem 0.75rem;
            min-height: 40px;
            min-width: 40px;
            font-size: 0.875rem;
          }

          .nav-button {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }

          .page-numbers {
            order: 2;
            width: 100%;
            justify-content: center;
            margin: 1rem 0;
          }
        }

        .page-numbers {
          display: flex;
          gap: 0.25rem;
        }
      `}</style>

      <div className="pagination-advanced">
        {hasPreviousPage ? (
          <button 
            onClick={() => handleNavigation(`/berita?before=${startCursor}`)}
            className="nav-button prev"
          >
            <span>←</span>
            <span>Sebelumnya</span>
          </button>
        ) : (
          <button 
            disabled
            className="nav-button prev disabled"
          >
            <span>←</span>
            <span>Sebelumnya</span>
          </button>
        )}

        <div className="page-numbers">
          {visiblePages.map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`pagination-button ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>

        {hasNextPage ? (
          <button 
            onClick={() => handleNavigation(`/berita?after=${endCursor}`)}
            className="nav-button next"
          >
            <span>Selanjutnya</span>
            <span>→</span>
          </button>
        ) : (
          <button 
            disabled
            className="nav-button next disabled"
          >
            <span>Selanjutnya</span>
            <span>→</span>
          </button>
        )}
      </div>
    </>
  );
};

export default AdvancedPagination;