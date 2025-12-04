import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ComputerDesktopIcon,
    CheckCircleIcon,
    WrenchScrewdriverIcon,
    ArchiveBoxXMarkIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon
} from "@heroicons/react/24/outline";
import { dashboardAPI } from "../../api/axios";
import { formatDate, formatNumber } from "../../utils/helpers";
import { ASSET_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from "../../utils/constants";

const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="card">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{formatNumber(value)}</p>
                {change !== undefined && (
                    <p className={`mt-1 text-sm flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change >= 0 ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(change)}% dari bulan lalu
                    </p>
                )}
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="h-8 w-8 text-white" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await dashboardAPI.getStats();
            const data = response.data.data;
            
            // Map backend snake_case to frontend expected format
            setStats({
                totalAssets: data.summary?.total_assets || 0,
                availableAssets: data.assets_by_status?.available || 0,
                assignedAssets: data.assets_by_status?.in_use || 0,
                repairAssets: data.assets_by_status?.under_repair || 0,
                retiredAssets: data.assets_by_status?.disposed || 0,
                assetsByCategory: (data.assets_by_category || []).map(cat => ({
                    name: cat.category?.name || cat["category.name"] || "Unknown",
                    count: parseInt(cat.count) || 0
                })),
                recentTransactions: data.recent_transactions || []
            });
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
            setError("Gagal memuat data dashboard");
            // Set dummy data for development
            setStats({
                totalAssets: 150,
                availableAssets: 80,
                assignedAssets: 55,
                repairAssets: 10,
                retiredAssets: 5,
                assetsByCategory: [],
                recentTransactions: []
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Ringkasan aset dan aktivitas terkini</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Aset"
                    value={stats?.totalAssets || 0}
                    icon={ComputerDesktopIcon}
                    color="bg-primary-600"
                />
                <StatCard
                    title="Tersedia"
                    value={stats?.availableAssets || 0}
                    icon={CheckCircleIcon}
                    color="bg-green-500"
                />
                <StatCard
                    title="Dipinjam"
                    value={stats?.assignedAssets || 0}
                    icon={ComputerDesktopIcon}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Dalam Perbaikan"
                    value={stats?.repairAssets || 0}
                    icon={WrenchScrewdriverIcon}
                    color="bg-yellow-500"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Transaksi Terkini</h2>
                        <Link to="/transactions" className="text-sm text-primary-600 hover:text-primary-700">
                            Lihat semua →
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {stats?.recentTransactions?.length > 0 ? (
                            stats.recentTransactions.map((tx, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="font-medium text-gray-900">{tx.asset?.name || "Asset"}</p>
                                        <p className="text-sm text-gray-500">
                                            {TRANSACTION_TYPE_LABELS[tx.action_type]} • {tx.user?.name || "User"}
                                        </p>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(tx.transaction_date)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">Belum ada transaksi</p>
                        )}
                    </div>
                </div>

                {/* Assets by Category */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Aset per Kategori</h2>
                        <Link to="/assets" className="text-sm text-primary-600 hover:text-primary-700">
                            Lihat semua →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats?.assetsByCategory?.length > 0 ? (
                            stats.assetsByCategory.map((cat, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-gray-700">{cat.name}</span>
                                    <div className="flex items-center">
                                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full"
                                                style={{ width: `${(cat.count / stats.totalAssets) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 w-10 text-right">
                                            {cat.count}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">Belum ada data kategori</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/assets/add"
                        className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <ComputerDesktopIcon className="h-8 w-8 text-primary-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Tambah Aset</span>
                    </Link>
                    <Link
                        to="/transactions/checkout"
                        className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Pinjam Aset</span>
                    </Link>
                    <Link
                        to="/transactions/checkin"
                        className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowTrendingDownIcon className="h-8 w-8 text-green-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Kembalikan Aset</span>
                    </Link>
                    <Link
                        to="/reports"
                        className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <ArchiveBoxXMarkIcon className="h-8 w-8 text-yellow-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Laporan</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
