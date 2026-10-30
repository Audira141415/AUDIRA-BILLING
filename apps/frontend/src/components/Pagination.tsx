import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showItemCount?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  totalPages: propTotalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  showItemCount = true,
  className = ''
}) => {
  const totalPages = propTotalPages ?? Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safePage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (safePage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handlePrev = () => {
    if (safePage > 1) {
      onPageChange(safePage - 1);
    }
  };

  const handleNext = () => {
    if (safePage < totalPages) {
      onPageChange(safePage + 1);
    }
  };

  const handleFirst = () => {
    if (safePage !== 1) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (safePage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--app-text-muted)] select-none ${className}`}
      aria-label="Paginasi Tabel"
    >
      {showItemCount && (
        <div className="text-[11px] font-medium text-[var(--app-text-muted)]">
          Menampilkan <span className="font-semibold text-[var(--app-text)]">{startItem}</span> -{' '}
          <span className="font-semibold text-[var(--app-text)]">{endItem}</span> dari{' '}
          <span className="font-semibold text-[var(--app-text)]">{totalItems.toLocaleString('id-ID')}</span> data
        </div>
      )}

      <div className="flex items-center gap-1.5 ml-auto">
        {onPageSizeChange && (
          <div className="flex items-center gap-1 mr-2 text-[11px]">
            <span className="hidden md:inline">Baris:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Jumlah baris per halaman"
              className="bg-[var(--app-surface-2)] text-[var(--app-text)] border border-[var(--app-border)] rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / hal
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={handleFirst}
          disabled={safePage === 1}
          aria-label="Halaman Pertama"
          title="Halaman Pertama"
          className="p-1.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsLeft size={13} />
        </button>

        <button
          type="button"
          onClick={handlePrev}
          disabled={safePage === 1}
          aria-label="Halaman Sebelumnya"
          title="Halaman Sebelumnya"
          className="p-1.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={13} />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (typeof p === 'string') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-[var(--app-text-muted)] text-[11px]"
                >
                  ...
                </span>
              );
            }
            const isActive = p === safePage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Halaman ${p}`}
                className={`min-w-[28px] h-7 px-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-[var(--app-surface-2)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] border border-[var(--app-border)]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={safePage === totalPages}
          aria-label="Halaman Berikutnya"
          title="Halaman Berikutnya"
          className="p-1.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={13} />
        </button>

        <button
          type="button"
          onClick={handleLast}
          disabled={safePage === totalPages}
          aria-label="Halaman Terakhir"
          title="Halaman Terakhir"
          className="p-1.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
