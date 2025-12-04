import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    HomeIcon,
    ComputerDesktopIcon,
    UsersIcon,
    ArrowsRightLeftIcon,
    FolderIcon,
    MapPinIcon,
    ChartBarIcon,
    Bars3Icon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Aset", href: "/assets", icon: ComputerDesktopIcon },
    { name: "Transaksi", href: "/transactions", icon: ArrowsRightLeftIcon },
    { name: "Pengguna", href: "/users", icon: UsersIcon, roles: ["admin", "staff"] },
    { name: "Kategori", href: "/categories", icon: FolderIcon, roles: ["admin"] },
    { name: "Lokasi", href: "/locations", icon: MapPinIcon, roles: ["admin"] },
    { name: "Laporan", href: "/reports", icon: ChartBarIcon }
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { user } = useAuth();

    const filteredNavigation = navigation.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(user?.role);
    });

    return (
        <>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <span className="text-xl font-bold text-primary-600">ITAM</span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <nav className="mt-4 px-2">
                    {filteredNavigation.map((item) => {
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center px-4 py-3 mb-1 text-sm font-medium rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-primary-50 text-primary-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-primary-600" : "text-gray-400"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-6 border-b border-gray-200">
                        <ComputerDesktopIcon className="h-8 w-8 text-primary-600" />
                        <span className="ml-2 text-xl font-bold text-gray-900">IT Asset</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 mt-4 px-3 space-y-1">
                        {filteredNavigation.map((item) => {
                            const isActive = location.pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                        isActive
                                            ? "bg-primary-50 text-primary-600"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-primary-600" : "text-gray-400"}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            IT Asset Management v1.0
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
