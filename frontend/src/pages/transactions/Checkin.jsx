import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { transactionAPI, assetAPI, locationAPI } from "../../api/axios";
import { ASSET_STATUS } from "../../utils/constants";
import { Button, Select, Card, Loader } from "../../components/common";
import toast from "react-hot-toast";

const Checkin = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedAssetId = searchParams.get("asset");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [assets, setAssets] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        asset_uuid: preselectedAssetId || "",
        location_uuid: "",
        notes: "",
        condition: "good"
    });

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const [assetRes, locationRes] = await Promise.all([
                assetAPI.getAll({ status: ASSET_STATUS.ASSIGNED, limit: 100 }),
                locationAPI.getAll()
            ]);
            setAssets(assetRes.data.data || []);
            setLocations(locationRes.data.data || []);
            
            // If preselected, find the asset
            if (preselectedAssetId) {
                const asset = assetRes.data.data?.find(a => a.uuid === preselectedAssetId);
                setSelectedAsset(asset);
            }
        } catch (error) {
            console.error("Error fetching assets:", error);
            toast.error("Gagal memuat data aset");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === "asset_uuid") {
            const asset = assets.find(a => a.uuid === value);
            setSelectedAsset(asset);
        }
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.asset_uuid) {
            newErrors.asset_uuid = "Aset wajib dipilih";
        }
        if (!formData.location_uuid) {
            newErrors.location_uuid = "Lokasi pengembalian wajib dipilih";
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

            await transactionAPI.checkin({
                asset_uuid: formData.asset_uuid,
                location_uuid: formData.location_uuid,
                notes: formData.notes || null,
                condition_notes: formData.condition
            });

            toast.success("Aset berhasil dikembalikan");
            navigate("/transactions");
        } catch (error) {
            console.error("Error checkin asset:", error);
            const message = error.response?.data?.message || "Gagal mengembalikan aset";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const conditionOptions = [
        { value: "good", label: "Baik - Tidak ada kerusakan" },
        { value: "fair", label: "Cukup - Ada kerusakan minor" },
        { value: "poor", label: "Buruk - Perlu perbaikan" },
        { value: "damaged", label: "Rusak - Tidak dapat digunakan" }
    ];

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
                    <h1 className="text-2xl font-bold text-gray-900">Kembalikan Aset</h1>
                    <p className="text-gray-500">Catat pengembalian aset dari pengguna</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <Card title="Detail Pengembalian" icon={ArrowDownTrayIcon}>
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
                                Tidak ada aset yang sedang dipinjam.
                            </p>
                        )}

                        {selectedAsset && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Informasi Aset</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Kode:</span>
                                        <span className="ml-2 text-gray-900">{selectedAsset.asset_code}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Nama:</span>
                                        <span className="ml-2 text-gray-900">{selectedAsset.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Dipinjam oleh:</span>
                                        <span className="ml-2 text-gray-900">{selectedAsset.holder?.name || "-"}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Kategori:</span>
                                        <span className="ml-2 text-gray-900">{selectedAsset.category?.name || "-"}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Select
                            label="Lokasi Pengembalian"
                            name="location_uuid"
                            value={formData.location_uuid}
                            onChange={handleChange}
                            error={errors.location_uuid}
                            options={[
                                { value: "", label: "-- Pilih Lokasi --" },
                                ...locations.map(loc => ({ 
                                    value: loc.uuid, 
                                    label: loc.name 
                                }))
                            ]}
                            required
                        />

                        <Select
                            label="Kondisi Aset"
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            options={conditionOptions}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catatan Pengembalian
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                                placeholder="Tambahkan catatan kondisi aset atau keterangan lainnya..."
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
                        variant="success"
                        loading={submitting}
                        disabled={assets.length === 0}
                    >
                        Kembalikan Aset
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Checkin;
