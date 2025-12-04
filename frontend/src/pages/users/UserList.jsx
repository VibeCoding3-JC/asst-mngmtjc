import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    EnvelopeIcon,
    UserIcon
} from "@heroicons/react/24/outline";
import { userAPI } from "../../api/axios";
import { formatDateTime, debounce } from "../../utils/helpers";
import { USER_ROLES } from "../../utils/constants";
import { 
    Button, 
    Table, 
    Badge, 
    SearchBar, 
    Select, 
    ConfirmDialog,
    Card 
} from "../../components/common";
import { getRoleLabel } from "../../components/common/Badge";
import toast from "react-hot-toast";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    // Filter states
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Delete confirmation
    const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
    const [deleting, setDeleting] = useState(false);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };
            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;

            const response = await userAPI.getAll(params);
            const data = response.data;
            
            setUsers(data.data || []);
            if (data.pagination) {
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination.total,
                    totalPages: data.pagination.totalPages
                }));
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Gagal memuat data pengguna");
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search, roleFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Debounced search
    const handleSearch = useCallback(
        debounce((value) => {
            setSearch(value);
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 300),
        []
    );

    // Delete user
    const handleDelete = async () => {
        if (!deleteModal.user) return;
        
        try {
            setDeleting(true);
            await userAPI.delete(deleteModal.user.uuid);
            toast.success("Pengguna berhasil dihapus");
            setDeleteModal({ open: false, user: null });
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus pengguna");
        } finally {
            setDeleting(false);
        }
    };

    // Table columns
    const columns = [
        {
            key: "name",
            label: "Nama",
            render: (value, row) => (
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-primary-600" />
                        </div>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{value}</p>
                        <p className="text-sm text-gray-500">{row.employee_id || "-"}</p>
                    </div>
                </div>
            )
        },
        {
            key: "email",
            label: "Email",
            render: (value) => (
                <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span>{value}</span>
                </div>
            )
        },
        {
            key: "role",
            label: "Role",
            render: (value) => <Badge variant={`role-${value}`}>{getRoleLabel(value)}</Badge>
        },
        {
            key: "department",
            label: "Departemen",
            render: (value) => value || "-"
        },
        {
            key: "createdAt",
            label: "Terdaftar",
            render: (value) => formatDateTime(value)
        },
        {
            key: "actions",
            label: "Aksi",
            render: (_, row) => (
                <div className="flex items-center space-x-2">
                    <Link
                        to={`/users/edit/${row.uuid}`}
                        className="p-1 text-gray-500 hover:text-yellow-600 transition-colors"
                        title="Edit"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                        onClick={() => setDeleteModal({ open: true, user: row })}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Hapus"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            )
        }
    ];

    // Role options
    const roleOptions = [
        { value: "", label: "Semua Role" },
        { value: USER_ROLES.ADMIN, label: "Admin" },
        { value: USER_ROLES.STAFF, label: "Staff" }
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Daftar Pengguna</h1>
                    <p className="text-gray-500">Kelola pengguna sistem</p>
                </div>
                <Link to="/users/add">
                    <Button icon={PlusIcon}>
                        Tambah Pengguna
                    </Button>
                </Link>
            </div>

            {/* Search and Filters */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Cari pengguna berdasarkan nama atau email..."
                            onSearch={handleSearch}
                            defaultValue={search}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            options={roleOptions}
                        />
                    </div>
                </div>
            </Card>

            {/* Users Table */}
            <Card>
                <Table
                    columns={columns}
                    data={users}
                    loading={loading}
                    emptyMessage="Tidak ada pengguna ditemukan"
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
                onClose={() => setDeleteModal({ open: false, user: null })}
                onConfirm={handleDelete}
                title="Hapus Pengguna"
                message={`Apakah Anda yakin ingin menghapus pengguna "${deleteModal.user?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
                type="danger"
                loading={deleting}
            />
        </div>
    );
};

export default UserList;
