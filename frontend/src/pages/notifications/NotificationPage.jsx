import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    BellIcon,
    CheckIcon,
    TrashIcon,
    ArrowRightOnRectangleIcon,
    ArrowLeftOnRectangleIcon,
    WrenchScrewdriverIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    FunnelIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import { formatDistanceToNow, format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
    const [filter, setFilter] = useState("all"); // all, unread

    const fetchNotifications = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                limit: 15,
                unread_only: filter === "unread"
            });
            const response = await api.get(`/notifications?${params}`);
            setNotifications(response.data.data.notifications || []);
            setPagination(response.data.data.pagination || { page: 1, total_pages: 1 });
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast.error("Gagal memuat notifikasi");
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchNotifications(1);
    }, [fetchNotifications]);

    const markAsRead = async (uuid) => {
        try {
            await api.patch(`/notifications/${uuid}/read`);
            setNotifications(prev => 
                prev.map(n => n.uuid === uuid ? { ...n, is_read: true } : n)
            );
            toast.success("Notifikasi ditandai sudah dibaca");
        } catch (error) {
            toast.error("Gagal menandai notifikasi");
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch("/notifications/read-all");
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            toast.success("Semua notifikasi ditandai sudah dibaca");
        } catch (error) {
            toast.error("Gagal menandai semua notifikasi");
        }
    };

    const deleteNotification = async (uuid) => {
        try {
            await api.delete(`/notifications/${uuid}`);
            setNotifications(prev => prev.filter(n => n.uuid !== uuid));
            toast.success("Notifikasi dihapus");
        } catch (error) {
            toast.error("Gagal menghapus notifikasi");
        }
    };

    const deleteAllRead = async () => {
        if (!window.confirm("Hapus semua notifikasi yang sudah dibaca?")) return;
        try {
            const response = await api.delete("/notifications/clear-read");
            setNotifications(prev => prev.filter(n => !n.is_read));
            toast.success(response.data.message);
        } catch (error) {
            toast.error("Gagal menghapus notifikasi");
        }
    };

    const getNotificationIcon = (type) => {
        const iconClass = "h-6 w-6";
        switch (type) {
            case "checkout":
                return <ArrowRightOnRectangleIcon className={`${iconClass} text-blue-500`} />;
            case "checkin":
                return <ArrowLeftOnRectangleIcon className={`${iconClass} text-green-500`} />;
            case "maintenance":
                return <WrenchScrewdriverIcon className={`${iconClass} text-orange-500`} />;
            case "overdue":
                return <ExclamationTriangleIcon className={`${iconClass} text-red-500`} />;
            case "asset_update":
                return <InformationCircleIcon className={`${iconClass} text-purple-500`} />;
            default:
                return <BellIcon className={`${iconClass} text-gray-500`} />;
        }
    };

    const getTypeLabel = (type) => {
        const labels = {
            checkout: "Peminjaman",
            checkin: "Pengembalian",
            maintenance: "Maintenance",
            overdue: "Terlambat",
            asset_update: "Update Aset",
            system: "Sistem"
        };
        return labels[type] || "Notifikasi";
    };

    const getTypeBadgeColor = (type) => {
        const colors = {
            checkout: "bg-blue-100 text-blue-700",
            checkin: "bg-green-100 text-green-700",
            maintenance: "bg-orange-100 text-orange-700",
            overdue: "bg-red-100 text-red-700",
            asset_update: "bg-purple-100 text-purple-700",
            system: "bg-gray-100 text-gray-700"
        };
        return colors[type] || "bg-gray-100 text-gray-700";
    };

    const formatTime = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { 
                addSuffix: true,
                locale: localeId 
            });
        } catch {
            return "";
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: localeId });
        } catch {
            return "";
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {unreadCount > 0 
                                ? `${unreadCount} notifikasi belum dibaca` 
                                : "Semua notifikasi sudah dibaca"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <CheckIcon className="h-4 w-4 mr-1.5" />
                                Tandai Semua Dibaca
                            </button>
                        )}
                        <button
                            onClick={deleteAllRead}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <TrashIcon className="h-4 w-4 mr-1.5" />
                            Hapus yang Dibaca
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
                <div className="px-4 py-3 flex items-center gap-2">
                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === "all" 
                                    ? "bg-indigo-100 text-indigo-700" 
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setFilter("unread")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === "unread" 
                                    ? "bg-indigo-100 text-indigo-700" 
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Belum Dibaca
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-gray-500">Memuat notifikasi...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada notifikasi</h3>
                        <p className="text-gray-500">
                            {filter === "unread" 
                                ? "Semua notifikasi sudah dibaca" 
                                : "Anda belum memiliki notifikasi"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.uuid}
                                className={`p-4 hover:bg-gray-50 transition-colors ${
                                    !notification.is_read ? "bg-indigo-50/50" : ""
                                }`}
                            >
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                            !notification.is_read ? "bg-indigo-100" : "bg-gray-100"
                                        }`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeBadgeColor(notification.type)}`}>
                                                        {getTypeLabel(notification.type)}
                                                    </span>
                                                    {!notification.is_read && (
                                                        <span className="h-2 w-2 bg-indigo-600 rounded-full"></span>
                                                    )}
                                                </div>
                                                <h4 className={`text-sm ${!notification.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                                                    {notification.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-0.5">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-xs text-gray-400" title={formatDate(notification.created_at)}>
                                                        {formatTime(notification.created_at)}
                                                    </span>
                                                    {notification.reference_uuid && notification.reference_type === "transaction" && (
                                                        <Link 
                                                            to="/transactions"
                                                            className="text-xs text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            Lihat transaksi →
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.uuid)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                                                        title="Tandai sudah dibaca"
                                                    >
                                                        <CheckIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.uuid)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                    title="Hapus"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Halaman {pagination.page} dari {pagination.total_pages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchNotifications(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sebelumnya
                            </button>
                            <button
                                onClick={() => fetchNotifications(pagination.page + 1)}
                                disabled={pagination.page >= pagination.total_pages}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;
