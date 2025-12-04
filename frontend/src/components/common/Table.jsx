import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Table = ({
    columns,
    data,
    loading = false,
    emptyMessage = 'Tidak ada data',
    onRowClick,
    className = '',
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-12 bg-gray-100 border-b" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 border-b last:border-0">
                            <div className="flex items-center px-6 py-4 space-x-4">
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/6" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={column.key || index}
                                    scope="col"
                                    className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${column.className || ''}`}
                                    style={{ width: column.width }}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    <div className="flex flex-col items-center">
                                        <svg
                                            className="w-12 h-12 text-gray-300 mb-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                            />
                                        </svg>
                                        <span>{emptyMessage}</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={row.id || row.uuid || rowIndex}
                                    className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                                    onClick={() => onRowClick && onRowClick(row)}
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={column.key || colIndex}
                                            className={`px-6 py-4 whitespace-nowrap text-sm ${column.cellClassName || ''}`}
                                        >
                                            {column.render
                                                ? column.render(row[column.key], row, rowIndex)
                                                : row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Pagination Component
export const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (totalPages <= 1) return null;

    return (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Menampilkan{' '}
                        <span className="font-medium">{startItem}</span>
                        {' '}-{' '}
                        <span className="font-medium">{endItem}</span>
                        {' '}dari{' '}
                        <span className="font-medium">{totalItems}</span> data
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        {startPage > 1 && (
                            <>
                                <button
                                    onClick={() => onPageChange(1)}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    1
                                </button>
                                {startPage > 2 && (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        ...
                                    </span>
                                )}
                            </>
                        )}
                        {pages.map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    page === currentPage
                                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        {endPage < totalPages && (
                            <>
                                {endPage < totalPages - 1 && (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        ...
                                    </span>
                                )}
                                <button
                                    onClick={() => onPageChange(totalPages)}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Table;
