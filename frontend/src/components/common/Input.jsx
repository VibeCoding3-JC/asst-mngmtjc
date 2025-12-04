import { forwardRef } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const Input = forwardRef(({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    helperText,
    disabled = false,
    required = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    inputClassName = '',
    ...props
}, ref) => {
    const hasError = Boolean(error);
    
    const inputBaseClasses = 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed';
    
    const inputStateClasses = hasError
        ? 'border-danger-300 text-danger-900 placeholder-danger-300 focus:ring-danger-500 focus:border-danger-500'
        : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500';
    
    const inputPaddingClasses = Icon
        ? iconPosition === 'left'
            ? 'pl-10 pr-4 py-2.5'
            : 'pl-4 pr-10 py-2.5'
        : 'px-4 py-2.5';

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && iconPosition === 'left' && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className={`h-5 w-5 ${hasError ? 'text-danger-400' : 'text-gray-400'}`} />
                    </div>
                )}
                <input
                    ref={ref}
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    required={required}
                    className={`${inputBaseClasses} ${inputStateClasses} ${inputPaddingClasses} ${inputClassName}`}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                    {...props}
                />
                {Icon && iconPosition === 'right' && !hasError && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                {hasError && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-danger-500" />
                    </div>
                )}
            </div>
            {(error || helperText) && (
                <p
                    id={`${name}-error`}
                    className={`mt-1 text-sm ${hasError ? 'text-danger-600' : 'text-gray-500'}`}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
