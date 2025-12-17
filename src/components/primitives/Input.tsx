import React, { type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className,
    id,
    ...props
}) => {
    const inputId = id || props.name;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-1">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={clsx(
                    "block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border",
                    error && "border-error-500 focus:border-error-500 focus:ring-error-500",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-error-500">{error}</p>
            )}
        </div>
    );
};
