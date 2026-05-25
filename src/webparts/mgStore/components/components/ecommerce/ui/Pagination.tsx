import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

function range(start: number, end: number) {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
}

const DOTS = "dots";

function usePagination({
  currentPage,
  totalPages,
  siblingCount = 1,
}: {
  currentPage: number;
  totalPages: number;
  siblingCount: number;
}) {
  const totalPageNumbers = siblingCount + 5;

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [firstPageIndex, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

  return range(1, totalPages);
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const paginationRange = usePagination({ currentPage, totalPages, siblingCount });

  if (totalPages <= 1) {
    return null;
  }

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const onNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex items-center justify-center gap-1"
    >
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:pointer-events-none transition-colors"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">Previous</span>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center w-10 h-10 text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const isActive = pageNumber === currentPage;

          return (
            <motion.button
              key={pageNumber}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(pageNumber as number)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-foreground"
              }`}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNumber}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:pointer-events-none transition-colors"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline text-sm">Next</span>
        <ChevronRight className="h-4 w-4" />
      </motion.button>
    </nav>
  );
}

interface PageInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function PageInfo({ currentPage, totalPages, totalItems, itemsPerPage }: PageInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <p className="text-sm text-muted-foreground">
      Showing <span className="font-medium text-foreground">{startItem}</span> to{" "}
      <span className="font-medium text-foreground">{endItem}</span> of{" "}
      <span className="font-medium text-foreground">{totalItems}</span> results
    </p>
  );
}
