const variants = {
    // Status badges
    available: 'bg-success-100 text-success-800',
    in_use: 'bg-primary-100 text-primary-800',
    under_repair: 'bg-warning-100 text-warning-800',
    disposed: 'bg-gray-100 text-gray-800',
    
    // Role badges
    admin: 'bg-purple-100 text-purple-800',
    staff: 'bg-blue-100 text-blue-800',
    employee: 'bg-gray-100 text-gray-800',
    
    // Transaction type badges
    checkout: 'bg-blue-100 text-blue-800',
    checkin: 'bg-green-100 text-green-800',
    transfer: 'bg-yellow-100 text-yellow-800',
    repair: 'bg-orange-100 text-orange-800',
    repair_complete: 'bg-teal-100 text-teal-800',
    disposal: 'bg-red-100 text-red-800',
    
    // Generic
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-danger-100 text-danger-800',
    info: 'bg-primary-100 text-primary-800',
    default: 'bg-gray-100 text-gray-800',
};

const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm',
};

const Badge = ({
    children,
    variant = 'default',
    size = 'sm',
    className = '',
    dot = false,
}) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';
    
    const classes = [
        baseClasses,
        variants[variant] || variants.default,
        sizes[size],
        className,
    ].filter(Boolean).join(' ');

    return (
        <span className={classes}>
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    variant === 'success' || variant === 'available' ? 'bg-success-500' :
                    variant === 'warning' || variant === 'under_repair' ? 'bg-warning-500' :
                    variant === 'danger' || variant === 'disposed' ? 'bg-danger-500' :
                    variant === 'info' || variant === 'in_use' ? 'bg-primary-500' :
                    'bg-gray-500'
                }`} />
            )}
            {children}
        </span>
    );
};

// Helper function to get status label in Indonesian
export const getStatusLabel = (status) => {
    const labels = {
        available: 'Tersedia',
        in_use: 'Digunakan',
        under_repair: 'Perbaikan',
        disposed: 'Dibuang',
    };
    return labels[status] || status;
};

// Helper function to get role label
export const getRoleLabel = (role) => {
    const labels = {
        admin: 'Admin',
        staff: 'Staff',
        employee: 'Karyawan',
    };
    return labels[role] || role;
};

// Helper function to get transaction type label
export const getTransactionLabel = (type) => {
    const labels = {
        checkout: 'Peminjaman',
        checkin: 'Pengembalian',
        transfer: 'Transfer',
        repair: 'Perbaikan',
        repair_complete: 'Selesai Perbaikan',
        disposal: 'Disposal',
    };
    return labels[type] || type;
};

export default Badge;
