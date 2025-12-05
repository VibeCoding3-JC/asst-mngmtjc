import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import {
    Bars3Icon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { getInitials, getAvatarColor } from "../../utils/helpers";
import { USER_ROLE_LABELS } from "../../utils/constants";
import { NotificationDropdown } from "../notifications";

const Navbar = ({ setSidebarOpen }) => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Mobile menu button */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>

                {/* Search - Optional */}
                <div className="flex-1 lg:ml-0">
                    {/* Can add global search here */}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <NotificationDropdown />

                    {/* User menu */}
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(user?.name)}`}>
                                {getInitials(user?.name)}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{USER_ROLE_LABELS[user?.role] || user?.role}</p>
                            </div>
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
                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>

                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/profile"
                                                className={`${
                                                    active ? "bg-gray-100" : ""
                                                } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                            >
                                                <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                                                Profil Saya
                                            </Link>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/profile"
                                                className={`${
                                                    active ? "bg-gray-100" : ""
                                                } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                            >
                                                <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
                                                Pengaturan
                                            </Link>
                                        )}
                                    </Menu.Item>

                                    <div className="border-t border-gray-100">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`${
                                                        active ? "bg-gray-100" : ""
                                                    } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                                                >
                                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                                                    Keluar
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
