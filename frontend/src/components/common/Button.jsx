import { forwardRef } from 'react';

const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white focus:ring-danger-500',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
};

const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg',
};

const Button = forwardRef(({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    onClick,
    ...props
}, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const classes = [
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            ref={ref}
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Loading...
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && (
                        <Icon className="w-4 h-4 mr-2" />
                    )}
                    {children}
                    {Icon && iconPosition === 'right' && (
                        <Icon className="w-4 h-4 ml-2" />
                    )}
                </>
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
