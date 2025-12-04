import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-200">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 mt-4">Halaman Tidak Ditemukan</h2>
                <p className="text-gray-500 mt-2">Maaf, halaman yang Anda cari tidak ada.</p>
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

export default NotFound;
