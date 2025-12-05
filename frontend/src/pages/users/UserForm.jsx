import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/outline";
import { userAPI } from "../../api/axios";
import { USER_ROLES } from "../../utils/constants";
import { Button, Input, Select, Card, Loader } from "../../components/common";
import toast from "react-hot-toast";

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: USER_ROLES.STAFF,
        department: "",
        phone: ""
    });

    useEffect(() => {
        if (isEdit) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getById(id);
            const user = response.data.data;
            
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: "",
                confirmPassword: "",
                role: user.role || USER_ROLES.STAFF,
                department: user.department || "",
                phone: user.phone || ""
            });
        } catch (error) {
            console.error("Error fetching user:", error);
            toast.error("Gagal memuat data pengguna");
            navigate("/users");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when field is modified
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Nama wajib diisi";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email wajib diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format email tidak valid";
        }
        if (!isEdit && !formData.password) {
            newErrors.password = "Password wajib diisi";
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = "Password minimal 6 karakter";
        }
        if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Konfirmasi password tidak cocok";
        }
        if (!formData.role) {
            newErrors.role = "Role wajib dipilih";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Mohon lengkapi data yang diperlukan");
            return;
        }

        try {
            setSubmitting(true);

            const submitData = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                department: formData.department || null,
                phone: formData.phone || null
            };

            // Only include password if provided
            if (formData.password) {
                submitData.password = formData.password;
            }

            if (isEdit) {
                await userAPI.update(id, submitData);
                toast.success("Pengguna berhasil diperbarui");
            } else {
                await userAPI.create(submitData);
                toast.success("Pengguna berhasil ditambahkan");
            }

            navigate("/users");
        } catch (error) {
            console.error("Error saving user:", error);
            const message = error.response?.data?.message || "Gagal menyimpan pengguna";
            toast.error(message);
            
            // Handle validation errors from backend
            if (error.response?.data?.errors) {
                const backendErrors = {};
                error.response.data.errors.forEach(err => {
                    backendErrors[err.field] = err.message;
                });
                setErrors(backendErrors);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const roleOptions = [
        { value: USER_ROLES.ADMIN, label: "Admin" },
        { value: USER_ROLES.STAFF, label: "Staff" }
    ];

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate("/users")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
                    </h1>
                    <p className="text-gray-500">
                        {isEdit ? "Perbarui informasi pengguna" : "Lengkapi data untuk menambahkan pengguna baru"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {/* Account Information */}
                <Card title="Informasi Akun" icon={UserIcon}>
                    <div className="space-y-6">
                        <Input
                            label="Nama Lengkap"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="Contoh: John Doe"
                            required
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="Contoh: john@company.com"
                            required
                        />
                        <Select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            error={errors.role}
                            options={roleOptions}
                            required
                        />
                    </div>
                </Card>

                {/* Password */}
                <Card title={isEdit ? "Ubah Password (Opsional)" : "Password"}>
                    <div className="space-y-6">
                        <Input
                            label={isEdit ? "Password Baru" : "Password"}
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder={isEdit ? "Kosongkan jika tidak ingin mengubah" : "Minimal 6 karakter"}
                            required={!isEdit}
                            helperText={isEdit ? "Kosongkan jika tidak ingin mengubah password" : ""}
                        />
                        <Input
                            label="Konfirmasi Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            placeholder="Ulangi password"
                            required={!isEdit && formData.password}
                        />
                    </div>
                </Card>

                {/* Additional Information */}
                <Card title="Informasi Tambahan">
                    <div className="space-y-6">
                        <Input
                            label="Departemen"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="Contoh: IT Department"
                        />
                        <Input
                            label="Nomor Telepon"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Contoh: 08123456789"
                        />
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/users")}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        loading={submitting}
                    >
                        {isEdit ? "Simpan Perubahan" : "Tambah Pengguna"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
