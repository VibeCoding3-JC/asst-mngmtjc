import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback } from 'react';

const SearchBar = ({
    value = '',
    onChange,
    placeholder = 'Cari...',
    debounce = 300,
    className = '',
    onClear,
}) => {
    const [localValue, setLocalValue] = useState(value);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, debounce);

        return () => clearTimeout(timer);
    }, [localValue, debounce, onChange, value]);

    // Sync with external value changes
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleClear = useCallback(() => {
        setLocalValue('');
        onChange('');
        if (onClear) onClear();
    }, [onChange, onClear]);

    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {localValue && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
