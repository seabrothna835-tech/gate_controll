import React from "react";
import { TbArrowBigLeftLinesFilled, TbArrowBigRightLinesFilled } from "react-icons/tb";
function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    visiblePages = 3,
}) {
    // Make sure current page is valid
    const safeTotalPages = Math.max(1, totalPages);
    // Calculate starting page
    let startPage;
    if (currentPage <= 2) {
        startPage = 1;
    } else if (currentPage >= safeTotalPages - 1) {
        startPage = Math.max(
            safeTotalPages - visiblePages + 1,
            1
        );
    } else {
        startPage = currentPage;
    }
    // Generate visible pages
    const pages = [];
    for (
        let i = startPage;
        i <= Math.min(
            startPage + visiblePages - 1,
            safeTotalPages
        );
        i++
    ) {
        pages.push(i);
    }
    const disabledPrev = currentPage === 1;
    const disabledNext = currentPage === safeTotalPages;
    return (
        <div className="flex items-center justify-center gap-2 mt-5">
            {/* Previous */}
            <button
                onClick={() =>
                    onPageChange(Math.max(currentPage - 1, 1))
                }
                disabled={disabledPrev}
                className={`
            px-4 py-2
            rounded-lg
            ${disabledPrev
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }
            `}
            >
                <TbArrowBigLeftLinesFilled />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded ${currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-gray-400"
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next */}
            <button
                onClick={() =>
                    onPageChange(
                        Math.min(currentPage + 1, safeTotalPages)
                    )
                }
                disabled={disabledNext}
                className={`
            px-4 py-2
            rounded-lg
            ${disabledNext
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }
            `}
            >
                <TbArrowBigRightLinesFilled />
            </button>

        </div>
    );
}

export default Pagination;