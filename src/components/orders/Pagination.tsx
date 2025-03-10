
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const goToFirstPage = () => onPageChange(1);
  const goToPreviousPage = () => onPageChange(Math.max(currentPage - 1, 1));
  const goToNextPage = () => onPageChange(Math.min(currentPage + 1, totalPages));
  const goToLastPage = () => onPageChange(totalPages);
  
  // Generate page numbers
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={goToFirstPage}
        disabled={currentPage === 1}
        className="hidden sm:flex h-8 w-8"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Page Numbers */}
      <div className="hidden sm:flex items-center gap-1">
        {getPageNumbers().map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
            className="h-8 w-8"
          >
            {page}
          </Button>
        ))}
      </div>
      
      {/* Mobile Page Indicator */}
      <div className="sm:hidden px-2">
        <span className="text-sm">
          {currentPage} / {totalPages}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={goToLastPage}
        disabled={currentPage === totalPages}
        className="hidden sm:flex h-8 w-8"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
