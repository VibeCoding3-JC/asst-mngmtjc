import { useState, useEffect, useCallback } from "react";
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    TagIcon
} from "@heroicons/react/24/outline";
import { categoryAPI } from "../../api/axios";
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

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // Modal states
    const [formModal, setFormModal] = useState({ open: false, category: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, category: null });
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [errors, setErrors] = useState({});

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;

            const response = await categoryAPI.getAll(params);
            setCategories(response.data.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Gagal memuat data kategori");
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Debounced search
    const handleSearch = useCallback(
        debounce((value) => {
            setSearch(value);
        }, 300),
        []
    );

    // Open form modal
    const openFormModal = (category = null) => {
        if (category) {
            setFormData({ name: category.name, description: category.description || "" });
        } else {
            setFormData({ name: "", description: "" });
        }
        setErrors({});
        setFormModal({ open: true, category });
    };

    // Close form modal
    const closeFormModal = () => {
        setFormModal({ open: false, category: null });
        setFormData({ name: "", description: "" });
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
            newErrors.name = "Nama kategori wajib diisi";
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
            
            if (formModal.category) {
                await categoryAPI.update(formModal.category.uuid, formData);
                toast.success("Kategori berhasil diperbarui");
            } else {
                await categoryAPI.create(formData);
                toast.success("Kategori berhasil ditambahkan");
            }
            
            closeFormModal();
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error(error.response?.data?.message || "Gagal menyimpan kategori");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deleteModal.category) return;
        
        try {
            setDeleting(true);
            await categoryAPI.delete(deleteModal.category.uuid);
            toast.success("Kategori berhasil dihapus");
            setDeleteModal({ open: false, category: null });
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus kategori");
        } finally {
            setDeleting(false);
        }
    };

    // Table columns
    const columns = [
        {
            key: "name",
            label: "Nama Kategori",
            render: (value) => (
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                        <TagIcon className="h-5 w-5 text-primary-600" />
                    </div>
                    <span className="font-medium text-gray-900">{value}</span>
                </div>
            )
        },
        {
            key: "description",
            label: "Deskripsi",
            render: (value) => value || "-"
        },
        {
            key: "_count",
            label: "Jumlah Aset",
            render: (value) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {value?.assets || 0} aset
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
                        onClick={() => setDeleteModal({ open: true, category: row })}
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
                    <h1 className="text-2xl font-bold text-gray-900">Kategori Aset</h1>
                    <p className="text-gray-500">Kelola kategori untuk klasifikasi aset</p>
                </div>
                <Button icon={PlusIcon} onClick={() => openFormModal()}>
                    Tambah Kategori
                </Button>
            </div>

            {/* Search */}
            <Card>
                <SearchBar
                    placeholder="Cari kategori..."
                    onSearch={handleSearch}
                    defaultValue={search}
                />
            </Card>

            {/* Categories Table */}
            <Card>
                <Table
                    columns={columns}
                    data={categories}
                    loading={loading}
                    emptyMessage="Tidak ada kategori ditemukan"
                />
            </Card>

            {/* Form Modal */}
            <Modal
                isOpen={formModal.open}
                onClose={closeFormModal}
                title={formModal.category ? "Edit Kategori" : "Tambah Kategori"}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nama Kategori"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Contoh: Laptop"
                        required
                    />
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
                            placeholder="Deskripsi kategori (opsional)..."
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={closeFormModal}>
                            Batal
                        </Button>
                        <Button type="submit" loading={submitting}>
                            {formModal.category ? "Simpan" : "Tambah"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, category: null })}
                onConfirm={handleDelete}
                title="Hapus Kategori"
                message={`Apakah Anda yakin ingin menghapus kategori "${deleteModal.category?.name}"? Kategori tidak dapat dihapus jika masih memiliki aset.`}
                confirmText="Hapus"
                type="danger"
                loading={deleting}
            />
        </div>
    );
};

export default CategoryList;
