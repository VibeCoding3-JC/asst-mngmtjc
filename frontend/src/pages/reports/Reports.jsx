import { useState, useEffect } from "react";
import { 
    DocumentChartBarIcon,
    ComputerDesktopIcon,
    ArrowsRightLeftIcon,
    TagIcon,
    MapPinIcon,
    ArrowDownTrayIcon,
    TableCellsIcon
} from "@heroicons/react/24/outline";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line
} from "recharts";
import { dashboardAPI, assetAPI, transactionAPI } from "../../api/axios";
import { formatCurrency, formatNumber } from "../../utils/helpers";
import { Button, Card, Select, Loader } from "../../components/common";
import { StatCard } from "../../components/common/Card";
import toast from "react-hot-toast";
import { 
    exportToExcel, 
    exportToPDF, 
    formatAssetDataForExport,
    formatTransactionDataForExport 
} from "../../utils/exportUtils";

const COLORS = ["#2563eb", "#16a34a", "#eab308", "#dc2626", "#8b5cf6", "#06b6d4"];

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [period, setPeriod] = useState("month");
    const [reportType, setReportType] = useState("overview");

    useEffect(() => {
        fetchReportData();
    }, [period]);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const response = await dashboardAPI.getStats({ period });
            setStats(response.data.data);
        } catch (error) {
            console.error("Error fetching report data:", error);
            toast.error("Gagal memuat data laporan");
            // Fallback data
            setStats({
                totalAssets: 150,
                availableAssets: 80,
                assignedAssets: 55,
                repairAssets: 10,
                retiredAssets: 5,
                totalValue: 750000000,
                assetsByCategory: [
                    { name: "Laptop", count: 50 },
                    { name: "Monitor", count: 40 },
                    { name: "Printer", count: 25 },
                    { name: "Network", count: 20 },
                    { name: "Other", count: 15 }
                ],
                assetsByLocation: [
                    { name: "Lantai 1", count: 45 },
                    { name: "Lantai 2", count: 35 },
                    { name: "Lantai 3", count: 40 },
                    { name: "Gudang", count: 30 }
                ],
                transactionsByMonth: [
                    { month: "Jan", checkout: 12, checkin: 8 },
                    { month: "Feb", checkout: 15, checkin: 10 },
                    { month: "Mar", checkout: 10, checkin: 14 },
                    { month: "Apr", checkout: 18, checkin: 12 },
                    { month: "May", checkout: 14, checkin: 16 },
                    { month: "Jun", checkout: 20, checkin: 15 }
                ],
                assetsByStatus: [
                    { name: "Tersedia", value: 80 },
                    { name: "Dipinjam", value: 55 },
                    { name: "Perbaikan", value: 10 },
                    { name: "Dinonaktifkan", value: 5 }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type) => {
        const toastId = toast.loading(`Mengekspor laporan ${type}...`);
        
        try {
            if (type === "PDF") {
                // Export overview/summary to PDF
                const summaryData = [
                    { 
                        'Metrik': 'Total Aset', 
                        'Nilai': stats?.totalAssets || 0 
                    },
                    { 
                        'Metrik': 'Aset Tersedia', 
                        'Nilai': stats?.availableAssets || 0 
                    },
                    { 
                        'Metrik': 'Aset Dipinjam', 
                        'Nilai': stats?.assignedAssets || 0 
                    },
                    { 
                        'Metrik': 'Aset Perbaikan', 
                        'Nilai': stats?.repairAssets || 0 
                    },
                    { 
                        'Metrik': 'Aset Dinonaktifkan', 
                        'Nilai': stats?.retiredAssets || 0 
                    },
                    { 
                        'Metrik': 'Total Nilai Aset', 
                        'Nilai': formatCurrency(stats?.totalValue || 0) 
                    }
                ];
                
                exportToPDF({
                    title: 'Laporan Ringkasan Aset',
                    subtitle: `Periode: ${getPeriodLabel(period)}`,
                    columns: [
                        { header: 'Metrik', key: 'Metrik' },
                        { header: 'Nilai', key: 'Nilai' }
                    ],
                    data: summaryData,
                    filename: `laporan-ringkasan-${new Date().toISOString().split('T')[0]}`,
                    orientation: 'portrait',
                    footer: 'IT Asset Management System'
                });
                
                toast.success('Laporan PDF berhasil diekspor', { id: toastId });
            } else if (type === "Aset") {
                // Fetch all assets and export
                const response = await assetAPI.getAll({ limit: 1000 });
                const assets = response.data?.data?.assets || response.data?.data || [];
                
                if (assets.length === 0) {
                    toast.error('Tidak ada data aset untuk diekspor', { id: toastId });
                    return;
                }
                
                const formattedData = formatAssetDataForExport(assets);
                exportToExcel(formattedData, `laporan-aset-${new Date().toISOString().split('T')[0]}`, 'Daftar Aset');
                toast.success(`${assets.length} data aset berhasil diekspor ke Excel`, { id: toastId });
            } else if (type === "Transaksi") {
                // Fetch all transactions and export
                const response = await transactionAPI.getAll({ limit: 1000 });
                const transactions = response.data?.data?.transactions || response.data?.data || [];
                
                if (transactions.length === 0) {
                    toast.error('Tidak ada data transaksi untuk diekspor', { id: toastId });
                    return;
                }
                
                const formattedData = formatTransactionDataForExport(transactions);
                exportToExcel(formattedData, `laporan-transaksi-${new Date().toISOString().split('T')[0]}`, 'Riwayat Transaksi');
                toast.success(`${transactions.length} data transaksi berhasil diekspor ke Excel`, { id: toastId });
            } else if (type === "Inventaris") {
                // Export inventory summary by category
                const categoryData = (stats?.assetsByCategory || []).map((cat, index) => ({
                    'No': index + 1,
                    'Kategori': cat.name,
                    'Jumlah': cat.count
                }));
                
                if (categoryData.length === 0) {
                    toast.error('Tidak ada data inventaris untuk diekspor', { id: toastId });
                    return;
                }
                
                exportToExcel(categoryData, `laporan-inventaris-${new Date().toISOString().split('T')[0]}`, 'Inventaris');
                toast.success('Laporan inventaris berhasil diekspor ke Excel', { id: toastId });
            } else if (type === "Maintenance") {
                // Fetch assets in repair status
                const response = await assetAPI.getAll({ status: 'repair', limit: 1000 });
                const assets = response.data?.data?.assets || response.data?.data || [];
                
                const formattedData = formatAssetDataForExport(assets);
                
                if (formattedData.length === 0) {
                    toast.success('Tidak ada aset dalam perbaikan saat ini', { id: toastId });
                    return;
                }
                
                exportToExcel(formattedData, `laporan-maintenance-${new Date().toISOString().split('T')[0]}`, 'Maintenance');
                toast.success(`${formattedData.length} data maintenance berhasil diekspor ke Excel`, { id: toastId });
            }
        } catch (error) {
            console.error('Export error:', error);
            toast.error(`Gagal mengekspor laporan: ${error.message}`, { id: toastId });
        }
    };
    
    const getPeriodLabel = (p) => {
        const labels = {
            'week': 'Minggu Ini',
            'month': 'Bulan Ini',
            'quarter': 'Kuartal Ini',
            'year': 'Tahun Ini'
        };
        return labels[p] || p;
    };

    const handleExportPDF = async (reportType) => {
        const toastId = toast.loading('Mengekspor laporan PDF...');
        
        try {
            if (reportType === 'assets') {
                const response = await assetAPI.getAll({ limit: 1000 });
                const assets = response.data?.data?.assets || response.data?.data || [];
                
                if (assets.length === 0) {
                    toast.error('Tidak ada data untuk diekspor', { id: toastId });
                    return;
                }
                
                exportToPDF({
                    title: 'Laporan Daftar Aset',
                    subtitle: `Total: ${assets.length} aset`,
                    columns: [
                        { header: 'No', key: 'No' },
                        { header: 'Kode', key: 'Kode Aset' },
                        { header: 'Nama', key: 'Nama Aset' },
                        { header: 'Kategori', key: 'Kategori' },
                        { header: 'Lokasi', key: 'Lokasi' },
                        { header: 'Status', key: 'Status' },
                        { header: 'Kondisi', key: 'Kondisi' }
                    ],
                    data: formatAssetDataForExport(assets),
                    filename: `laporan-aset-${new Date().toISOString().split('T')[0]}`,
                    orientation: 'landscape',
                    footer: 'IT Asset Management System'
                });
                
                toast.success(`${assets.length} data aset berhasil diekspor ke PDF`, { id: toastId });
            }
        } catch (error) {
            console.error('Export PDF error:', error);
            toast.error(`Gagal mengekspor PDF: ${error.message}`, { id: toastId });
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan & Analitik</h1>
                    <p className="text-gray-500">Ringkasan dan analisis data aset</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        options={[
                            { value: "week", label: "Minggu Ini" },
                            { value: "month", label: "Bulan Ini" },
                            { value: "quarter", label: "Kuartal Ini" },
                            { value: "year", label: "Tahun Ini" }
                        ]}
                    />
                    <Button 
                        variant="outline" 
                        icon={ArrowDownTrayIcon}
                        onClick={() => handleExport("PDF")}
                    >
                        Export PDF
                    </Button>
                    <Button 
                        variant="primary" 
                        icon={TableCellsIcon}
                        onClick={() => handleExport("Aset")}
                    >
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Aset"
                    value={formatNumber(stats?.totalAssets || 0)}
                    icon={ComputerDesktopIcon}
                    color="primary"
                />
                <StatCard
                    title="Total Nilai Aset"
                    value={formatCurrency(stats?.totalValue || 0)}
                    icon={DocumentChartBarIcon}
                    color="green"
                />
                <StatCard
                    title="Transaksi Bulan Ini"
                    value={formatNumber(stats?.monthlyTransactions || 45)}
                    icon={ArrowsRightLeftIcon}
                    color="blue"
                />
                <StatCard
                    title="Aset Aktif"
                    value={`${Math.round(((stats?.availableAssets || 0) + (stats?.assignedAssets || 0)) / (stats?.totalAssets || 1) * 100)}%`}
                    icon={TagIcon}
                    color="yellow"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Asset by Status - Pie Chart */}
                <Card title="Distribusi Status Aset" icon={ComputerDesktopIcon}>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.assetsByStatus || []}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {(stats?.assetsByStatus || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Asset by Category - Bar Chart */}
                <Card title="Aset per Kategori" icon={TagIcon}>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.assetsByCategory || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Transaction Trend - Line Chart */}
                <Card title="Tren Transaksi" icon={ArrowsRightLeftIcon}>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.transactionsByMonth || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="checkout" 
                                    stroke="#2563eb" 
                                    strokeWidth={2}
                                    name="Peminjaman"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="checkin" 
                                    stroke="#16a34a" 
                                    strokeWidth={2}
                                    name="Pengembalian"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Asset by Location - Bar Chart */}
                <Card title="Aset per Lokasi" icon={MapPinIcon}>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.assetsByLocation || []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#16a34a" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Quick Reports */}
            <Card title="Laporan Cepat">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button 
                        onClick={() => handleExport("Aset")}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                        <ComputerDesktopIcon className="h-8 w-8 text-primary-600 mb-2" />
                        <h3 className="font-medium text-gray-900">Laporan Aset</h3>
                        <p className="text-sm text-gray-500">Daftar lengkap semua aset</p>
                    </button>
                    <button 
                        onClick={() => handleExport("Transaksi")}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                        <ArrowsRightLeftIcon className="h-8 w-8 text-blue-600 mb-2" />
                        <h3 className="font-medium text-gray-900">Laporan Transaksi</h3>
                        <p className="text-sm text-gray-500">Riwayat semua transaksi</p>
                    </button>
                    <button 
                        onClick={() => handleExport("Inventaris")}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                        <TagIcon className="h-8 w-8 text-green-600 mb-2" />
                        <h3 className="font-medium text-gray-900">Laporan Inventaris</h3>
                        <p className="text-sm text-gray-500">Ringkasan per kategori</p>
                    </button>
                    <button 
                        onClick={() => handleExport("Maintenance")}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                        <DocumentChartBarIcon className="h-8 w-8 text-yellow-600 mb-2" />
                        <h3 className="font-medium text-gray-900">Laporan Maintenance</h3>
                        <p className="text-sm text-gray-500">Aset dalam perbaikan</p>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Reports;
