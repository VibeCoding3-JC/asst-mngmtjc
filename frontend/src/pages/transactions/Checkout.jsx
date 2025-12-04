import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { transactionAPI, assetAPI, userAPI } from "../../api/axios";
import { ASSET_STATUS } from "../../utils/constants";
import { Button, Select, Card, Loader } from "../../components/common";
import toast from "react-hot-toast";

const Checkout = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedAssetId = searchParams.get("asset");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [assets, setAssets] = useState([]);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        asset_uuid: preselectedAssetId || "",
        user_uuid: "",
        notes: "",
        expected_return_date: ""
    });

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            setLoading(true);
            const [assetRes, userRes] = await Promise.all([
                assetAPI.getAll({ status: ASSET_STATUS.AVAILABLE, limit: 100 }),
                userAPI.getAll({ limit: 100 })
            ]);
            
            setAssets(assetRes.data.data || []);
            setUsers(userRes.data.data || []);
        } catch (error) {
            console.error("Error fetching options:", error);
            toast.error("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.asset_uuid) {
            newErrors.asset_uuid = "Aset wajib dipilih";
        }
        if (!formData.user_uuid) {
            newErrors.user_uuid = "Pengguna wajib dipilih";
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

            await transactionAPI.checkout({
                asset_uuid: formData.asset_uuid,
                user_uuid: formData.user_uuid,
                notes: formData.notes || null,
                expected_return_date: formData.expected_return_date || null
            });

            toast.success("Aset berhasil dipinjamkan");
            navigate("/transactions");
        } catch (error) {
            console.error("Error checkout asset:", error);
            const message = error.response?.data?.message || "Gagal meminjamkan aset";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate("/transactions")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pinjam Aset</h1>
                    <p className="text-gray-500">Catat peminjaman aset kepada pengguna</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <Card title="Detail Peminjaman" icon={ArrowUpTrayIcon}>
                    <div className="space-y-6">
                        <Select
                            label="Pilih Aset"
                            name="asset_uuid"
                            value={formData.asset_uuid}
                            onChange={handleChange}
                            error={errors.asset_uuid}
                            options={[
                                { value: "", label: "-- Pilih Aset --" },
                                ...assets.map(asset => ({ 
                                    value: asset.uuid, 
                                    label: `${asset.asset_code} - ${asset.name}` 
                                }))
                            ]}
                            required
                        />

                        {assets.length === 0 && (
                            <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                                Tidak ada aset yang tersedia untuk dipinjam.
                            </p>
                        )}

                        <Select
                            label="Pinjamkan Kepada"
                            name="user_uuid"
                            value={formData.user_uuid}
                            onChange={handleChange}
                            error={errors.user_uuid}
                            options={[
                                { value: "", label: "-- Pilih Pengguna --" },
                                ...users.map(user => ({ 
                                    value: user.uuid, 
                                    label: `${user.name} (${user.email})` 
                                }))
                            ]}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Perkiraan Tanggal Pengembalian
                            </label>
                            <input
                                type="date"
                                name="expected_return_date"
                                value={formData.expected_return_date}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catatan
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                                placeholder="Tambahkan catatan (opsional)..."
                            />
                        </div>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/transactions")}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        loading={submitting}
                        disabled={assets.length === 0}
                    >
                        Pinjamkan Aset
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
