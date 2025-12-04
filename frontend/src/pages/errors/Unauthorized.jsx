import { Link } from "react-router-dom";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <ShieldExclamationIcon className="h-24 w-24 text-red-500 mx-auto" />
                <h2 className="text-2xl font-semibold text-gray-900 mt-4">Akses Ditolak</h2>
                <p className="text-gray-500 mt-2">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
                <Link
                    to="/dashboard"
                    className="inline-block mt-6 btn-primary"
                >
                    Kembali ke Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
