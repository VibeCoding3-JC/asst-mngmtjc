import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { assetAPI, categoryAPI, locationAPI } from "../../api/axios";
import { Button, Input, Select, Card, Loader } from "../../components/common";
import toast from "react-hot-toast";

const AssetForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        category_uuid: "",
        location_uuid: "",
        brand: "",
        model: "",
        serial_number: "",
        purchase_date: "",
        purchase_price: "",
        warranty_expiry: "",
        vendor: "",
        notes: ""
    });

    useEffect(() => {
        fetchOptions();
        if (isEdit) {
            fetchAsset();
        }
    }, [id]);

    const fetchOptions = async () => {
        try {
            const [catRes, locRes] = await Promise.all([
                categoryAPI.getAll(),
                locationAPI.getAll()
            ]);
            setCategories(catRes.data.data || []);
            setLocations(locRes.data.data || []);
        } catch (error) {
            console.error("Error fetching options:", error);
            toast.error("Gagal memuat data kategori dan lokasi");
        }
    };

    const fetchAsset = async () => {
        try {
            setLoading(true);
            const response = await assetAPI.getById(id);
            const asset = response.data.data;
            
            setFormData({
                name: asset.name || "",
                category_uuid: asset.category?.uuid || "",
                location_uuid: asset.location?.uuid || "",
                brand: asset.brand || "",
                model: asset.model || "",
                serial_number: asset.serial_number || "",
                purchase_date: asset.purchase_date ? asset.purchase_date.split("T")[0] : "",
                purchase_price: asset.purchase_price || "",
                warranty_expiry: asset.warranty_expiry ? asset.warranty_expiry.split("T")[0] : "",
                vendor: asset.vendor || "",
                notes: asset.notes || ""
            });
        } catch (error) {
            console.error("Error fetching asset:", error);
            toast.error("Gagal memuat data aset");
            navigate("/assets");
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

        if (!formData.name.trim()) {
            newErrors.name = "Nama aset wajib diisi";
        }
        if (!formData.category_uuid) {
            newErrors.category_uuid = "Kategori wajib dipilih";
        }
        if (!formData.location_uuid) {
            newErrors.location_uuid = "Lokasi wajib dipilih";
        }
        if (!formData.serial_number.trim()) {
            newErrors.serial_number = "Serial number wajib diisi";
        }
        if (!formData.purchase_date) {
            newErrors.purchase_date = "Tanggal pembelian wajib diisi";
        }
        if (formData.purchase_price && isNaN(Number(formData.purchase_price))) {
            newErrors.purchase_price = "Harga harus berupa angka";
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
                category_uuid: formData.category_uuid,
                location_uuid: formData.location_uuid,
                serial_number: formData.serial_number,
                brand: formData.brand || null,
                model: formData.model || null,
                purchase_date: formData.purchase_date,
                purchase_price: formData.purchase_price ? Number(formData.purchase_price) : 0,
                warranty_end: formData.warranty_expiry || null,
                vendor: formData.vendor || null,
                notes: formData.notes || null
            };

            if (isEdit) {
                await assetAPI.update(id, submitData);
                toast.success("Aset berhasil diperbarui");
            } else {
                await assetAPI.create(submitData);
                toast.success("Aset berhasil ditambahkan");
            }

            navigate("/assets");
        } catch (error) {
            console.error("Error saving asset:", error);
            const message = error.response?.data?.message || "Gagal menyimpan aset";
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
                    onClick={() => navigate("/assets")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? "Edit Aset" : "Tambah Aset Baru"}
                    </h1>
                    <p className="text-gray-500">
                        {isEdit ? "Perbarui informasi aset" : "Lengkapi data untuk menambahkan aset baru"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card title="Informasi Dasar" icon={ComputerDesktopIcon}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Nama Aset"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="Contoh: Laptop Dell Latitude"
                            required
                        />
                        <Input
                            label="Serial Number"
                            name="serial_number"
                            value={formData.serial_number}
                            onChange={handleChange}
                            error={errors.serial_number}
                            placeholder="Contoh: SN123456789"
                            required
                        />
                        <Select
                            label="Kategori"
                            name="category_uuid"
                            value={formData.category_uuid}
                            onChange={handleChange}
                            error={errors.category_uuid}
                            options={[
                                { value: "", label: "Pilih Kategori" },
                                ...categories.map(cat => ({ value: cat.uuid, label: cat.name }))
                            ]}
                            required
                        />
                        <Select
                            label="Lokasi"
                            name="location_uuid"
                            value={formData.location_uuid}
                            onChange={handleChange}
                            error={errors.location_uuid}
                            options={[
                                { value: "", label: "Pilih Lokasi" },
                                ...locations.map(loc => ({ value: loc.uuid, label: loc.name }))
                            ]}
                            required
                        />
                        <Input
                            label="Merek"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="Contoh: Dell"
                        />
                        <Input
                            label="Model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            placeholder="Contoh: Latitude 5520"
                        />
                    </div>
                </Card>

                {/* Purchase Information */}
                <Card title="Informasi Pembelian">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Tanggal Pembelian"
                            name="purchase_date"
                            type="date"
                            value={formData.purchase_date}
                            onChange={handleChange}
                            error={errors.purchase_date}
                            required
                        />
                        <Input
                            label="Harga Beli (Rp)"
                            name="purchase_price"
                            type="number"
                            value={formData.purchase_price}
                            onChange={handleChange}
                            error={errors.purchase_price}
                            placeholder="Contoh: 15000000"
                        />
                        <Input
                            label="Garansi Berakhir"
                            name="warranty_expiry"
                            type="date"
                            value={formData.warranty_expiry}
                            onChange={handleChange}
                        />
                        <Input
                            label="Vendor"
                            name="vendor"
                            value={formData.vendor}
                            onChange={handleChange}
                            placeholder="Contoh: PT. Supplier Indonesia"
                        />
                    </div>
                </Card>

                {/* Notes */}
                <Card title="Catatan">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catatan Aset
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                            placeholder="Tambahkan catatan tentang aset ini..."
                        />
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/assets")}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        loading={submitting}
                    >
                        {isEdit ? "Simpan Perubahan" : "Tambah Aset"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AssetForm;
