import { useState, useEffect, useCallback } from "react";
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    MapPinIcon,
    BuildingOfficeIcon
} from "@heroicons/react/24/outline";
import { locationAPI } from "../../api/axios";
import { formatDateTime, debounce } from "../../utils/helpers";
import { 
    Button, 
    Table, 
    SearchBar, 
    Modal,
    Input,
    ConfirmDialog,
    Card 
} from "../../components/common";
import toast from "react-hot-toast";

const LocationList = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // Modal states
    const [formModal, setFormModal] = useState({ open: false, location: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, location: null });
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({ 
        name: "", 
        building: "", 
        floor: "", 
        description: "" 
    });
    const [errors, setErrors] = useState({});

    // Fetch locations
    const fetchLocations = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;

            const response = await locationAPI.getAll(params);
            setLocations(response.data.data || []);
        } catch (error) {
            console.error("Error fetching locations:", error);
            toast.error("Gagal memuat data lokasi");
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    // Debounced search
    const handleSearch = useCallback(
        debounce((value) => {
            setSearch(value);
        }, 300),
        []
    );

    // Open form modal
    const openFormModal = (location = null) => {
        if (location) {
            setFormData({ 
                name: location.name, 
                building: location.building || "",
                floor: location.floor || "",
                description: location.description || "" 
            });
        } else {
            setFormData({ name: "", building: "", floor: "", description: "" });
        }
        setErrors({});
        setFormModal({ open: true, location });
    };

    // Close form modal
    const closeFormModal = () => {
        setFormModal({ open: false, location: null });
        setFormData({ name: "", building: "", floor: "", description: "" });
        setErrors({});
    };

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Nama lokasi wajib diisi";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            
            if (formModal.location) {
                await locationAPI.update(formModal.location.uuid, formData);
                toast.success("Lokasi berhasil diperbarui");
            } else {
                await locationAPI.create(formData);
                toast.success("Lokasi berhasil ditambahkan");
            }
            
            closeFormModal();
            fetchLocations();
        } catch (error) {
            console.error("Error saving location:", error);
            toast.error(error.response?.data?.message || "Gagal menyimpan lokasi");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deleteModal.location) return;
        
        try {
            setDeleting(true);
            await locationAPI.delete(deleteModal.location.uuid);
            toast.success("Lokasi berhasil dihapus");
            setDeleteModal({ open: false, location: null });
            fetchLocations();
        } catch (error) {
            console.error("Error deleting location:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus lokasi");
        } finally {
            setDeleting(false);
        }
    };

    // Table columns
    const columns = [
        {
            key: "name",
            label: "Nama Lokasi",
            render: (value) => (
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">{value}</span>
                </div>
            )
        },
        {
            key: "building",
            label: "Gedung",
            render: (value, row) => (
                <div className="flex items-center space-x-2">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                    <span>{value || "-"}</span>
                    {row.floor && (
                        <span className="text-gray-500">• Lt. {row.floor}</span>
                    )}
                </div>
            )
        },
        {
            key: "description",
            label: "Deskripsi",
            render: (value) => value || "-"
        },
        {
            key: "asset_count",
            label: "Jumlah Aset",
            render: (value) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {value || 0} aset
                </span>
            )
        },
        {
            key: "createdAt",
            label: "Dibuat",
            render: (value) => formatDateTime(value)
        },
        {
            key: "actions",
            label: "Aksi",
            render: (_, row) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => openFormModal(row)}
                        className="p-1 text-gray-500 hover:text-yellow-600 transition-colors"
                        title="Edit"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setDeleteModal({ open: true, location: row })}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Hapus"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lokasi Aset</h1>
                    <p className="text-gray-500">Kelola lokasi penyimpanan aset</p>
                </div>
                <Button icon={PlusIcon} onClick={() => openFormModal()}>
                    Tambah Lokasi
                </Button>
            </div>

            {/* Search */}
            <Card>
                <SearchBar
                    placeholder="Cari lokasi..."
                    onSearch={handleSearch}
                    defaultValue={search}
                />
            </Card>

            {/* Locations Table */}
            <Card>
                <Table
                    columns={columns}
                    data={locations}
                    loading={loading}
                    emptyMessage="Tidak ada lokasi ditemukan"
                />
            </Card>

            {/* Form Modal */}
            <Modal
                isOpen={formModal.open}
                onClose={closeFormModal}
                title={formModal.location ? "Edit Lokasi" : "Tambah Lokasi"}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nama Lokasi"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Contoh: Ruang IT"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Gedung"
                            name="building"
                            value={formData.building}
                            onChange={handleChange}
                            placeholder="Contoh: Gedung A"
                        />
                        <Input
                            label="Lantai"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            placeholder="Contoh: 3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deskripsi
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                            placeholder="Deskripsi lokasi (opsional)..."
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={closeFormModal}>
                            Batal
                        </Button>
                        <Button type="submit" loading={submitting}>
                            {formModal.location ? "Simpan" : "Tambah"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, location: null })}
                onConfirm={handleDelete}
                title="Hapus Lokasi"
                message={`Apakah Anda yakin ingin menghapus lokasi "${deleteModal.location?.name}"? Lokasi tidak dapat dihapus jika masih memiliki aset.`}
                confirmText="Hapus"
                type="danger"
                loading={deleting}
            />
        </div>
    );
};

export default LocationList;
