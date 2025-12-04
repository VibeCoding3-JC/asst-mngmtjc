import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
    PlusIcon, 
    FunnelIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    XMarkIcon,
    TableCellsIcon
} from "@heroicons/react/24/outline";
import { assetAPI, categoryAPI, locationAPI } from "../../api/axios";
import { formatCurrency, formatDate, debounce } from "../../utils/helpers";
import { ASSET_STATUS } from "../../utils/constants";
import { 
    Button, 
    Table, 
    Badge, 
    SearchBar, 
    Select, 
    ConfirmDialog,
    Card 
} from "../../components/common";
import { getStatusLabel } from "../../components/common/Badge";
import toast from "react-hot-toast";
import { 
    exportToExcel, 
    exportToPDF, 
    formatAssetDataForExport 
} from "../../utils/exportUtils";

const AssetList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "");
    const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");

    // Options for filters
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);

    // Delete confirmation
    const [deleteModal, setDeleteModal] = useState({ open: false, asset: null });
    const [deleting, setDeleting] = useState(false);

    // Fetch filter options
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [catRes, locRes] = await Promise.all([
                    categoryAPI.getAll(),
                    locationAPI.getAll()
                ]);
                setCategories(catRes.data.data || []);
                setLocations(locRes.data.data || []);
            } catch (error) {
                console.error("Error fetching filter options:", error);
            }
        };
        fetchFilterOptions();
    }, []);

    // Fetch assets
    const fetchAssets = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            if (categoryFilter) params.category_id = categoryFilter;
            if (locationFilter) params.location_id = locationFilter;

            const response = await assetAPI.getAll(params);
            const data = response.data;
            
            setAssets(data.data || []);
            if (data.pagination) {
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination.total,
                    totalPages: data.pagination.totalPages
                }));
            }
        } catch (error) {
            console.error("Error fetching assets:", error);
            toast.error("Gagal memuat data aset");
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search, statusFilter, categoryFilter, locationFilter]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (statusFilter) params.set("status", statusFilter);
        if (categoryFilter) params.set("category", categoryFilter);
        if (locationFilter) params.set("location", locationFilter);
        setSearchParams(params);
    }, [search, statusFilter, categoryFilter, locationFilter, setSearchParams]);

    // Debounced search
    const handleSearch = useCallback(
        debounce((value) => {
            setSearch(value);
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 300),
        []
    );

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        setPagination(prev => ({ ...prev, page: 1 }));
        switch (filterName) {
            case "status":
                setStatusFilter(value);
                break;
            case "category":
                setCategoryFilter(value);
                break;
            case "location":
                setLocationFilter(value);
                break;
            default:
                break;
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setSearch("");
        setStatusFilter("");
        setCategoryFilter("");
        setLocationFilter("");
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Delete asset
    const handleDelete = async () => {
        if (!deleteModal.asset) return;
        
        try {
            setDeleting(true);
            await assetAPI.delete(deleteModal.asset.uuid);
            toast.success("Aset berhasil dihapus");
            setDeleteModal({ open: false, asset: null });
            fetchAssets();
        } catch (error) {
            console.error("Error deleting asset:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus aset");
        } finally {
            setDeleting(false);
        }
    };

    // Export assets to Excel
    const handleExportExcel = async () => {
        const toastId = toast.loading("Mengekspor data ke Excel...");
        try {
            // Fetch all assets with current filters
            const params = { limit: 1000 };
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            if (categoryFilter) params.category_id = categoryFilter;
            if (locationFilter) params.location_id = locationFilter;
            
            const response = await assetAPI.getAll(params);
            const allAssets = response.data?.data || [];
            
            if (allAssets.length === 0) {
                toast.error("Tidak ada data untuk diekspor", { id: toastId });
                return;
            }
            
            const formattedData = formatAssetDataForExport(allAssets);
            exportToExcel(formattedData, `daftar-aset-${new Date().toISOString().split('T')[0]}`, 'Daftar Aset');
            toast.success(`${allAssets.length} data aset berhasil diekspor ke Excel`, { id: toastId });
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Gagal mengekspor data", { id: toastId });
        }
    };

    // Export assets to PDF
    const handleExportPDF = async () => {
        const toastId = toast.loading("Mengekspor data ke PDF...");
        try {
            // Fetch all assets with current filters
            const params = { limit: 1000 };
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            if (categoryFilter) params.category_id = categoryFilter;
            if (locationFilter) params.location_id = locationFilter;
            
            const response = await assetAPI.getAll(params);
            const allAssets = response.data?.data || [];
            
            if (allAssets.length === 0) {
                toast.error("Tidak ada data untuk diekspor", { id: toastId });
                return;
            }
            
            const formattedData = formatAssetDataForExport(allAssets);
            exportToPDF({
                title: 'Laporan Daftar Aset IT',
                subtitle: `Total: ${allAssets.length} aset`,
                columns: [
                    { header: 'No', key: 'No' },
                    { header: 'Kode', key: 'Kode Aset' },
                    { header: 'Nama', key: 'Nama Aset' },
                    { header: 'Kategori', key: 'Kategori' },
                    { header: 'Lokasi', key: 'Lokasi' },
                    { header: 'Status', key: 'Status' },
                    { header: 'Kondisi', key: 'Kondisi' }
                ],
                data: formattedData,
                filename: `daftar-aset-${new Date().toISOString().split('T')[0]}`,
                orientation: 'landscape',
                footer: 'IT Asset Management System'
            });
            toast.success(`${allAssets.length} data aset berhasil diekspor ke PDF`, { id: toastId });
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Gagal mengekspor data", { id: toastId });
        }
    };

    // Table columns
    const columns = [
        {
            key: "asset_code",
            label: "Kode Aset",
            render: (value, row) => (
                <Link to={`/assets/${row.uuid}`} className="text-primary-600 hover:text-primary-800 font-medium">
                    {value}
                </Link>
            )
        },
        {
            key: "name",
            label: "Nama Aset",
            render: (value, row) => (
                <div>
                    <p className="font-medium text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{row.brand} {row.model}</p>
                </div>
            )
        },
        {
            key: "category",
            label: "Kategori",
            render: (value) => value?.name || "-"
        },
        {
            key: "location",
            label: "Lokasi",
            render: (value) => value?.name || "-"
        },
        {
            key: "status",
            label: "Status",
            render: (value) => <Badge variant={`status-${value}`}>{getStatusLabel(value)}</Badge>
        },
        {
            key: "purchase_price",
            label: "Harga",
            render: (value) => formatCurrency(value)
        },
        {
            key: "actions",
            label: "Aksi",
            render: (_, row) => (
                <div className="flex items-center space-x-2">
                    <Link
                        to={`/assets/${row.uuid}`}
                        className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                        title="Lihat Detail"
                    >
                        <EyeIcon className="h-5 w-5" />
                    </Link>
                    <Link
                        to={`/assets/edit/${row.uuid}`}
                        className="p-1 text-gray-500 hover:text-yellow-600 transition-colors"
                        title="Edit"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                        onClick={() => setDeleteModal({ open: true, asset: row })}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Hapus"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            )
        }
    ];

    // Status options
    const statusOptions = [
        { value: "", label: "Semua Status" },
        { value: ASSET_STATUS.AVAILABLE, label: "Tersedia" },
        { value: ASSET_STATUS.ASSIGNED, label: "Dipinjam" },
        { value: ASSET_STATUS.MAINTENANCE, label: "Perbaikan" },
        { value: ASSET_STATUS.RETIRED, label: "Dinonaktifkan" }
    ];

    const hasActiveFilters = statusFilter || categoryFilter || locationFilter;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Daftar Aset</h1>
                    <p className="text-gray-500">Kelola semua aset IT perusahaan</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button
                        variant="outline"
                        icon={ArrowDownTrayIcon}
                        onClick={handleExportPDF}
                    >
                        Export PDF
                    </Button>
                    <Button
                        variant="outline"
                        icon={TableCellsIcon}
                        onClick={handleExportExcel}
                    >
                        Export Excel
                    </Button>
                    <Link to="/assets/add">
                        <Button icon={PlusIcon}>
                            Tambah Aset
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Cari aset berdasarkan kode, nama, atau serial number..."
                            onSearch={handleSearch}
                            defaultValue={search}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant={showFilters ? "primary" : "outline"}
                            icon={FunnelIcon}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filter
                            {hasActiveFilters && (
                                <span className="ml-2 bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                                    {[statusFilter, categoryFilter, locationFilter].filter(Boolean).length}
                                </span>
                            )}
                        </Button>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={XMarkIcon}
                                onClick={clearFilters}
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            label="Status"
                            value={statusFilter}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            options={statusOptions}
                        />
                        <Select
                            label="Kategori"
                            value={categoryFilter}
                            onChange={(e) => handleFilterChange("category", e.target.value)}
                            options={[
                                { value: "", label: "Semua Kategori" },
                                ...categories.map(cat => ({ value: cat.id, label: cat.name }))
                            ]}
                        />
                        <Select
                            label="Lokasi"
                            value={locationFilter}
                            onChange={(e) => handleFilterChange("location", e.target.value)}
                            options={[
                                { value: "", label: "Semua Lokasi" },
                                ...locations.map(loc => ({ value: loc.id, label: loc.name }))
                            ]}
                        />
                    </div>
                )}
            </Card>

            {/* Assets Table */}
            <Card>
                <Table
                    columns={columns}
                    data={assets}
                    loading={loading}
                    emptyMessage="Tidak ada aset ditemukan"
                    pagination={{
                        currentPage: pagination.page,
                        totalPages: pagination.totalPages,
                        totalItems: pagination.total,
                        itemsPerPage: pagination.limit,
                        onPageChange: (page) => setPagination(prev => ({ ...prev, page }))
                    }}
                />
            </Card>

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, asset: null })}
                onConfirm={handleDelete}
                title="Hapus Aset"
                message={`Apakah Anda yakin ingin menghapus aset "${deleteModal.asset?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
                type="danger"
                loading={deleting}
            />
        </div>
    );
};

export default AssetList;
