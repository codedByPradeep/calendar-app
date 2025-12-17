import React, { type SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    error?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    error,
    className,
    id,
    ...props
}) => {
    const selectId = id || props.name;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-neutral-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={selectId}
                    className={clsx(
                        "block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border appearance-none pr-10",
                        error && "border-error-500 focus:border-error-500 focus:ring-error-500",
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
            {error && (
                <p className="mt-1 text-xs text-error-500">{error}</p>
            )}
        </div>
    );
};
