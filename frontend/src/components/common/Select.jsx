import { forwardRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Select = forwardRef(({
    label,
    name,
    value,
    onChange,
    onBlur,
    options = [],
    placeholder = 'Pilih...',
    error,
    helperText,
    disabled = false,
    required = false,
    className = '',
    ...props
}, ref) => {
    const hasError = Boolean(error);

    const selectBaseClasses = 'block w-full rounded-lg border appearance-none bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed pr-10 pl-4 py-2.5';
    
    const selectStateClasses = hasError
        ? 'border-danger-300 text-danger-900 focus:ring-danger-500 focus:border-danger-500'
        : 'border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500';

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
                <select
                    ref={ref}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    required={required}
                    className={`${selectBaseClasses} ${selectStateClasses}`}
                    aria-invalid={hasError}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>
            {(error || helperText) && (
                <p className={`mt-1 text-sm ${hasError ? 'text-danger-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
