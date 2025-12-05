import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { UserCircleIcon, KeyIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const ProfileSettings = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        department: ""
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                department: user.department || ""
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.put("/auth/profile", profileData);
            toast.success(response.data.message || "Profil berhasil diperbarui");
            if (refreshUser) {
                await refreshUser();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal memperbarui profil");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Password baru dan konfirmasi tidak cocok");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password minimal 6 karakter");
            return;
        }

        setLoading(true);
        try {
            const response = await api.put("/auth/change-password", passwordData);
            toast.success(response.data.message || "Password berhasil diubah");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal mengubah password");
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: "bg-red-100 text-red-800",
            staff: "bg-blue-100 text-blue-800",
            viewer: "bg-gray-100 text-gray-800"
        };
        return badges[role] || badges.viewer;
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Kelola informasi profil dan keamanan akun Anda
                </p>
            </div>

            {/* User Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getRoleBadge(user?.role)}`}>
                            {user?.role?.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <Tab.Group>
                    <Tab.List className="flex border-b border-gray-200">
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "flex-1 py-4 px-6 text-sm font-medium focus:outline-none",
                                    selected
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-500 hover:text-gray-700"
                                )
                            }
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <UserCircleIcon className="h-5 w-5" />
                                <span>Informasi Profil</span>
                            </div>
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "flex-1 py-4 px-6 text-sm font-medium focus:outline-none",
                                    selected
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-500 hover:text-gray-700"
                                )
                            }
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <KeyIcon className="h-5 w-5" />
                                <span>Ganti Password</span>
                            </div>
                        </Tab>
                    </Tab.List>
                    <Tab.Panels className="p-6">
                        {/* Profile Tab */}
                        <Tab.Panel>
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Masukkan email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            No. Telepon
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Masukkan nomor telepon"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Departemen
                                        </label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={profileData.department}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Masukkan departemen"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircleIcon className="h-5 w-5 mr-2" />
                                                Simpan Perubahan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </Tab.Panel>

                        {/* Password Tab */}
                        <Tab.Panel>
                            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password Saat Ini
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        placeholder="Masukkan password saat ini"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password Baru
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        placeholder="Masukkan password baru (min. 6 karakter)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Konfirmasi Password Baru
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        placeholder="Konfirmasi password baru"
                                    />
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <KeyIcon className="h-5 w-5 mr-2" />
                                                Ubah Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
};

export default ProfileSettings;
