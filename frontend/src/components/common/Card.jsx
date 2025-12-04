const Card = ({
    children,
    title,
    subtitle,
    icon: Icon,
    action,
    className = '',
    padding = true,
}) => {
    return (
        <div className={`bg-white rounded-lg shadow ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                        {Icon && (
                            <div className="flex-shrink-0 mr-3">
                                <Icon className="h-6 w-6 text-gray-400" />
                            </div>
                        )}
                        <div>
                            {title && (
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-500">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={padding ? 'p-6' : ''}>{children}</div>
        </div>
    );
};

// Stat Card for Dashboard
export const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    color = 'primary',
    className = '',
}) => {
    const colors = {
        primary: 'bg-primary-100 text-primary-600',
        success: 'bg-success-100 text-success-600',
        warning: 'bg-warning-100 text-warning-600',
        danger: 'bg-danger-100 text-danger-600',
        info: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <div className={`flex items-center mt-2 text-sm ${
                            trend === 'up' ? 'text-success-600' : 'text-danger-600'
                        }`}>
                            {trend === 'up' ? (
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-full ${colors[color]}`}>
                        <Icon className="h-8 w-8" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
