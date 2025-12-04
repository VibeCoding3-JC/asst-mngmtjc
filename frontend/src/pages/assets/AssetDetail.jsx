import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
    ArrowLeftIcon, 
    PencilIcon, 
    TrashIcon,
    ComputerDesktopIcon,
    MapPinIcon,
    TagIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    ClockIcon,
    UserIcon
} from "@heroicons/react/24/outline";
import { assetAPI } from "../../api/axios";
import { formatCurrency, formatDate, formatDateTime } from "../../utils/helpers";
import { Button, Badge, Card, Loader, ConfirmDialog } from "../../components/common";
import { getStatusLabel } from "../../components/common/Badge";
import toast from "react-hot-toast";

const AssetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [asset, setAsset] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchAssetDetail();
    }, [id]);

    const fetchAssetDetail = async () => {
        try {
            setLoading(true);
            const assetRes = await assetAPI.getById(id);
            setAsset(assetRes.data.data);
            
            // Fetch transaction history
            try {
                const txRes = await assetAPI.getHistory(id);
                setTransactions(txRes.data.data || []);
            } catch (txError) {
                console.warn("Could not fetch transaction history:", txError);
                setTransactions([]);
            }
        } catch (error) {
            console.error("Error fetching asset detail:", error);
            toast.error("Gagal memuat detail aset");
            navigate("/assets");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await assetAPI.delete(id);
            toast.success("Aset berhasil dihapus");
            navigate("/assets");
        } catch (error) {
            console.error("Error deleting asset:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus aset");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!asset) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Aset tidak ditemukan</p>
                <Link to="/assets" className="text-primary-600 hover:text-primary-800 mt-2 inline-block">
                    Kembali ke daftar aset
                </Link>
            </div>
        );
    }

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
            <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium text-gray-900">{value || "-"}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate("/assets")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
                        <p className="text-gray-500">{asset.asset_code}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Link to={`/assets/edit/${id}`}>
                        <Button variant="outline" icon={PencilIcon}>
                            Edit
                        </Button>
                    </Link>
                    <Button 
                        variant="danger" 
                        icon={TrashIcon}
                        onClick={() => setDeleteModal(true)}
                    >
                        Hapus
                    </Button>
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center space-x-3">
                <Badge variant={`status-${asset.status}`} size="lg">
                    {getStatusLabel(asset.status)}
                </Badge>
                {asset.assigned_to && (
                    <span className="text-sm text-gray-500">
                        Dipinjam oleh: <span className="font-medium">{asset.assignedUser?.name}</span>
                    </span>
                )}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card title="Informasi Dasar" icon={ComputerDesktopIcon}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <InfoItem icon={TagIcon} label="Kode Aset" value={asset.asset_code} />
                            <InfoItem icon={ComputerDesktopIcon} label="Nama Aset" value={asset.name} />
                            <InfoItem icon={TagIcon} label="Kategori" value={asset.category?.name} />
                            <InfoItem icon={MapPinIcon} label="Lokasi" value={asset.location?.name} />
                            <InfoItem icon={TagIcon} label="Merek" value={asset.brand} />
                            <InfoItem icon={TagIcon} label="Model" value={asset.model} />
                            <InfoItem icon={DocumentTextIcon} label="Serial Number" value={asset.serial_number} />
                        </div>
                    </Card>

                    {/* Purchase Information */}
                    <Card title="Informasi Pembelian" icon={CurrencyDollarIcon}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <InfoItem 
                                icon={CurrencyDollarIcon} 
                                label="Harga Beli" 
                                value={formatCurrency(asset.purchase_price)} 
                            />
                            <InfoItem 
                                icon={CalendarIcon} 
                                label="Tanggal Pembelian" 
                                value={formatDate(asset.purchase_date)} 
                            />
                            <InfoItem 
                                icon={CalendarIcon} 
                                label="Garansi Berakhir" 
                                value={formatDate(asset.warranty_expiry)} 
                            />
                            <InfoItem 
                                icon={TagIcon} 
                                label="Supplier" 
                                value={asset.supplier} 
                            />
                        </div>
                    </Card>

                    {/* Description */}
                    {asset.description && (
                        <Card title="Deskripsi" icon={DocumentTextIcon}>
                            <p className="text-gray-700 whitespace-pre-wrap">{asset.description}</p>
                        </Card>
                    )}

                    {/* Transaction History */}
                    <Card title="Riwayat Transaksi" icon={ClockIcon}>
                        {transactions.length > 0 ? (
                            <div className="space-y-4">
                                {transactions.map((tx) => (
                                    <div 
                                        key={tx.id} 
                                        className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`p-2 rounded-lg ${
                                                tx.action_type === 'checkout' ? 'bg-blue-100' : 
                                                tx.action_type === 'checkin' ? 'bg-green-100' :
                                                tx.action_type === 'maintenance' ? 'bg-yellow-100' :
                                                'bg-gray-100'
                                            }`}>
                                                <UserIcon className={`h-4 w-4 ${
                                                    tx.action_type === 'checkout' ? 'text-blue-600' : 
                                                    tx.action_type === 'checkin' ? 'text-green-600' :
                                                    tx.action_type === 'maintenance' ? 'text-yellow-600' :
                                                    'text-gray-600'
                                                }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {tx.action_type === 'checkout' && 'Dipinjam'}
                                                    {tx.action_type === 'checkin' && 'Dikembalikan'}
                                                    {tx.action_type === 'maintenance' && 'Maintenance'}
                                                    {tx.action_type === 'transfer' && 'Dipindahkan'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {tx.user?.name} • {formatDateTime(tx.transaction_date)}
                                                </p>
                                                {tx.notes && (
                                                    <p className="text-sm text-gray-600 mt-1">{tx.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Belum ada riwayat transaksi</p>
                        )}
                    </Card>
                </div>

                {/* Right Column - Quick Info */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <Card>
                        <div className="text-center">
                            <div className={`inline-flex p-4 rounded-full mb-4 ${
                                asset.status === 'available' ? 'bg-green-100' :
                                asset.status === 'assigned' ? 'bg-blue-100' :
                                asset.status === 'maintenance' ? 'bg-yellow-100' :
                                'bg-gray-100'
                            }`}>
                                <ComputerDesktopIcon className={`h-8 w-8 ${
                                    asset.status === 'available' ? 'text-green-600' :
                                    asset.status === 'assigned' ? 'text-blue-600' :
                                    asset.status === 'maintenance' ? 'text-yellow-600' :
                                    'text-gray-600'
                                }`} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                            <p className="text-gray-500">{asset.brand} {asset.model}</p>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card title="Aksi Cepat">
                        <div className="space-y-3">
                            {asset.status === 'available' && (
                                <Link to={`/transactions/checkout?asset=${id}`} className="block">
                                    <Button variant="primary" fullWidth>
                                        Pinjamkan Aset
                                    </Button>
                                </Link>
                            )}
                            {asset.status === 'assigned' && (
                                <Link to={`/transactions/checkin?asset=${id}`} className="block">
                                    <Button variant="success" fullWidth>
                                        Kembalikan Aset
                                    </Button>
                                </Link>
                            )}
                            <Link to={`/assets/edit/${id}`} className="block">
                                <Button variant="outline" fullWidth icon={PencilIcon}>
                                    Edit Aset
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* Metadata */}
                    <Card title="Metadata">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Dibuat</span>
                                <span className="text-gray-900">{formatDateTime(asset.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Terakhir Diubah</span>
                                <span className="text-gray-900">{formatDateTime(asset.updatedAt)}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                title="Hapus Aset"
                message={`Apakah Anda yakin ingin menghapus aset "${asset.name}"? Semua riwayat transaksi terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
                type="danger"
                loading={deleting}
            />
        </div>
    );
};

export default AssetDetail;
