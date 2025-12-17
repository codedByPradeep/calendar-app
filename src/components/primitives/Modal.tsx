import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    description?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    description
}) => {


    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby={description ? "modal-description" : undefined}
        >
            <div
                className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className="relative w-full max-w-lg transform rounded-xl bg-white p-6 text-left shadow-modal transition-all animate-fade-in"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
                            {title}
                        </h2>
                        {description && (
                            <p id="modal-description" className="mt-1 text-sm text-neutral-500">
                                {description}
                            </p>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal" className="!p-1">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {children}
            </div>
        </div>,
        document.body
    );
};
