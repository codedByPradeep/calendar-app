import React, { type TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    className,
    id,
    ...props
}) => {
    const textareaId = id || props.name;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={textareaId} className="block text-sm font-medium text-neutral-700 mb-1">
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
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
