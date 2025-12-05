import { Fragment, useState, useEffect, useCallback } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import {
    BellIcon,
    CheckCircleIcon,
    ArrowRightOnRectangleIcon,
    ArrowLeftOnRectangleIcon,
    WrenchScrewdriverIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    CheckIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import { BellIcon as BellIconSolid } from "@heroicons/react/24/solid";
import api from "../../api/axios";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await api.get("/notifications?limit=5");
            setNotifications(response.data.data.notifications || []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await api.get("/notifications/unread-count");
            setUnreadCount(response.data.data.unread_count || 0);
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
        
        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            fetchNotifications();
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchNotifications, fetchUnreadCount]);

    const markAsRead = async (uuid) => {
        try {
            await api.patch(`/notifications/${uuid}/read`);
            setNotifications(prev => 
                prev.map(n => n.uuid === uuid ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            setLoading(true);
            await api.patch("/notifications/read-all");
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        } finally {
            setLoading(false);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "checkout":
                return <ArrowRightOnRectangleIcon className="h-5 w-5 text-blue-500" />;
            case "checkin":
                return <ArrowLeftOnRectangleIcon className="h-5 w-5 text-green-500" />;
            case "maintenance":
                return <WrenchScrewdriverIcon className="h-5 w-5 text-orange-500" />;
            case "overdue":
                return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
            case "asset_update":
                return <InformationCircleIcon className="h-5 w-5 text-purple-500" />;
            default:
                return <BellIcon className="h-5 w-5 text-gray-500" />;
        }
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

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">
                {unreadCount > 0 ? (
                    <BellIconSolid className="h-6 w-6 text-indigo-600" />
                ) : (
                    <BellIcon className="h-6 w-6" />
                )}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">Notifikasi</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                disabled={loading}
                                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                <CheckIcon className="h-3.5 w-3.5" />
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Tidak ada notifikasi</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <Menu.Item key={notification.uuid}>
                                    {({ active }) => (
                                        <div
                                            onClick={() => !notification.is_read && markAsRead(notification.uuid)}
                                            className={`px-4 py-3 cursor-pointer border-b border-gray-50 last:border-0 ${
                                                active ? "bg-gray-50" : ""
                                            } ${!notification.is_read ? "bg-indigo-50/50" : ""}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${!notification.is_read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatTime(notification.created_at)}
                                                    </p>
                                                </div>
                                                {!notification.is_read && (
                                                    <div className="flex-shrink-0">
                                                        <span className="h-2 w-2 bg-indigo-600 rounded-full block"></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Menu.Item>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                            <Link
                                to="/notifications"
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center"
                            >
                                Lihat semua notifikasi
                            </Link>
                        </div>
                    )}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default NotificationDropdown;
