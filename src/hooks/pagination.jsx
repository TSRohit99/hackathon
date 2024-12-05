"use client";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TablePagination = ({ handlePagination, MainData }) => {
  const [currPage, setCurrPage] = useState(1);

  const todosPerPage = 3;
  const totalPages = Math.ceil(MainData.length / todosPerPage);

  // Paginate data when page changes or MainData updates
  useEffect(() => {
    const startIndex = (currPage - 1) * todosPerPage;
    const endIndex = currPage * todosPerPage;
    const paginatedData = MainData.slice(startIndex, endIndex);
    handlePagination(paginatedData); // Send paginated data to parent
  }, [currPage, MainData]);

  // Handle navigation buttons
  const handlePrevious = () => {
    setCurrPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (index) => {
    setCurrPage(index);
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem className="text-slate-500 font-semibold hover:cursor-pointer">
          <PaginationPrevious onClick={handlePrevious} />
        </PaginationItem>

        {/* Page Numbers */}
        {[...Array(totalPages).keys()].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageChange(page + 1)}
              className={`text-slate-500 font-semibold hover:cursor-pointer ${
                currPage === page + 1 ? "text-slate-700 font-bold" : ""
              }`}
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis */}
        {totalPages > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next Button */}
        <PaginationItem className="text-slate-500 font-semibold hover:cursor-pointer">
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;