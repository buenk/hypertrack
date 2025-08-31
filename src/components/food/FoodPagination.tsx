"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useFoodFilters } from "@/hooks/useFoodFilters";

export function FoodPagination() {
  const { filters, setFilters } = useFoodFilters();

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const current = filters.page || 1;
  const center = current;
  const left = Math.max(1, center - 1);
  const right = center + 1;

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handlePageChange(Math.max(1, current - 1))}
          />
        </PaginationItem>
        {left > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href="#" onClick={() => handlePageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            {left > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {[left, center, right]
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                isActive={pageNum === current}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

        {/* Right ellipsis and last page button would need totalPages; omitted for now */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handlePageChange(current + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
