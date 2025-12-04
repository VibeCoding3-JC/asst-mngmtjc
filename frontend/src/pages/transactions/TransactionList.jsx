import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
    ArrowUpTrayIcon,
    ArrowDownTrayIcon,
    WrenchScrewdriverIcon,
    ArrowsRightLeftIcon,
    EyeIcon
} from "@heroicons/react/24/outline";
import { transactionAPI, userAPI } from "../../api/axios";
import { formatDateTime, debounce } from "../../utils/helpers";
import { TRANSACTION_TYPES } from "../../utils/constants";
import { 
    Button, 
    Table, 
    Badge, 
    SearchBar, 
    Select,
    Card 
} from "../../components/common";
import { getTransactionLabel } from "../../components/common/Badge";
import toast from "react-hot-toast";

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    // Filter states
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [userFilter, setUserFilter] = useState("");

    // Fetch options
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await userAPI.getAll({ limit: 100 });
                setUsers(response.data.data || []);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchOptions();
    }, []);

    // Fetch transactions
    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };
            if (search) params.search = search;
            if (typeFilter) params.action_type = typeFilter;
            if (userFilter) params.user_id = userFilter;

            const response = await transactionAPI.getAll(params);
            const data = response.data;
            
            setTransactions(data.data || []);
            if (data.pagination) {
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination.total,
                    totalPages: data.pagination.totalPages
                }));
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error("Gagal memuat data transaksi");
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search, typeFilter, userFilter]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Debounced search
    const handleSearch = useCallback(
        debounce((value) => {
            setSearch(value);
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 300),
        []
    );

    // Get transaction icon
    const getTransactionIcon = (type) => {
        switch (type) {
            case TRANSACTION_TYPES.CHECKOUT:
                return <ArrowUpTrayIcon className="h-4 w-4 text-blue-600" />;
            case TRANSACTION_TYPES.CHECKIN:
                return <ArrowDownTrayIcon className="h-4 w-4 text-green-600" />;
            case TRANSACTION_TYPES.MAINTENANCE:
                return <WrenchScrewdriverIcon className="h-4 w-4 text-yellow-600" />;
            case TRANSACTION_TYPES.TRANSFER:
                return <ArrowsRightLeftIcon className="h-4 w-4 text-purple-600" />;
            default:
                return null;
        }
    };

    // Table columns
    const columns = [
        {
            key: "action_type",
            label: "Tipe",
            render: (value) => (
                <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${
                        value === TRANSACTION_TYPES.CHECKOUT ? 'bg-blue-100' :
                        value === TRANSACTION_TYPES.CHECKIN ? 'bg-green-100' :
                        value === TRANSACTION_TYPES.MAINTENANCE ? 'bg-yellow-100' :
                        'bg-purple-100'
                    }`}>
                        {getTransactionIcon(value)}
                    </div>
                    <Badge variant={`transaction-${value}`}>
                        {getTransactionLabel(value)}
                    </Badge>
                </div>
            )
        },
        {
            key: "asset",
            label: "Aset",
            render: (value) => (
                <div>
                    <Link 
                        to={`/assets/${value?.id}`}
                        className="font-medium text-primary-600 hover:text-primary-800"
                    >
                        {value?.name || "-"}
                    </Link>
                    <p className="text-sm text-gray-500">{value?.asset_code}</p>
                </div>
            )
        },
        {
            key: "user",
            label: "Pengguna",
            render: (value) => value?.name || "-"
        },
        {
            key: "transaction_date",
            label: "Tanggal",
            render: (value) => formatDateTime(value)
        },
        {
            key: "notes",
            label: "Catatan",
            render: (value) => (
                <span className="text-gray-600 truncate max-w-xs block">
                    {value || "-"}
                </span>
            )
        },
        {
            key: "actions",
            label: "Aksi",
            render: (_, row) => (
                <Link
                    to={`/assets/${row.asset?.id}`}
                    className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                    title="Lihat Aset"
                >
                    <EyeIcon className="h-5 w-5" />
                </Link>
            )
        }
    ];

    // Type options
    const typeOptions = [
        { value: "", label: "Semua Tipe" },
        { value: TRANSACTION_TYPES.CHECKOUT, label: "Peminjaman" },
        { value: TRANSACTION_TYPES.CHECKIN, label: "Pengembalian" },
        { value: TRANSACTION_TYPES.MAINTENANCE, label: "Maintenance" },
        { value: TRANSACTION_TYPES.TRANSFER, label: "Transfer" }
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
                    <p className="text-gray-500">Lihat semua aktivitas aset</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link to="/transactions/checkout">
                        <Button variant="primary" icon={ArrowUpTrayIcon}>
                            Pinjam Aset
                        </Button>
                    </Link>
                    <Link to="/transactions/checkin">
                        <Button variant="success" icon={ArrowDownTrayIcon}>
                            Kembalikan
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Cari transaksi..."
                            onSearch={handleSearch}
                            defaultValue={search}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            value={typeFilter}
                            onChange={(e) => {
                                setTypeFilter(e.target.value);
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            options={typeOptions}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            value={userFilter}
                            onChange={(e) => {
                                setUserFilter(e.target.value);
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            options={[
                                { value: "", label: "Semua Pengguna" },
                                ...users.map(user => ({ value: user.id, label: user.name }))
                            ]}
                        />
                    </div>
                </div>
            </Card>

            {/* Transactions Table */}
            <Card>
                <Table
                    columns={columns}
                    data={transactions}
                    loading={loading}
                    emptyMessage="Tidak ada transaksi ditemukan"
                    pagination={{
                        currentPage: pagination.page,
                        totalPages: pagination.totalPages,
                        totalItems: pagination.total,
                        itemsPerPage: pagination.limit,
                        onPageChange: (page) => setPagination(prev => ({ ...prev, page }))
                    }}
                />
            </Card>
        </div>
    );
};

export default TransactionList;
