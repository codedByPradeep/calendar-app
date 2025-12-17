import React, { useState, useEffect } from 'react';
import { Modal } from '../primitives/Modal';
import { Input } from '../primitives/Input';
import { Textarea } from '../primitives/Textarea';
import { Select } from '../primitives/Select';
import { Button } from '../primitives/Button';
import { type CalendarEvent } from './CalendarView.types';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: CalendarEvent) => void;
    onDelete: (id: string) => void;
    initialEvent?: Partial<CalendarEvent>;
    selectedDate?: Date;
}

const COLORS = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#ef4444', label: 'Red' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Yellow' },
    { value: '#8b5cf6', label: 'Purple' },
];

const CATEGORIES = [
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Work', label: 'Work' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Other', label: 'Other' },
];

export const EventModal: React.FC<EventModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    initialEvent,
    selectedDate,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [color, setColor] = useState(COLORS[0].value);
    const [category, setCategory] = useState(CATEGORIES[0].value);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (initialEvent) {
                setTitle(initialEvent.title || '');
                setDescription(initialEvent.description || '');
                setStartDate(formatDateTimeLocal(initialEvent.startDate || selectedDate || new Date()));
                setEndDate(formatDateTimeLocal(initialEvent.endDate || new Date(new Date().setHours(new Date().getHours() + 1))));
                setColor(initialEvent.color || COLORS[0].value);
                setCategory(initialEvent.category || CATEGORIES[0].value);
            } else {
                // Reset or set default for new event
                const start = selectedDate || new Date();
                // If selectedDate comes from a month click, it might be 00:00. 
                // If from week click, it has time. 
                // It's good to default to next hour if it's "now".
                const end = new Date(start.getTime() + 60 * 60 * 1000);

                setTitle('');
                setDescription('');
                setStartDate(formatDateTimeLocal(start));
                setEndDate(formatDateTimeLocal(end));
                setColor(COLORS[0].value);
                setCategory(CATEGORIES[0].value);
            }
            setErrors({});
        }
    }, [isOpen, initialEvent, selectedDate]);

    const formatDateTimeLocal = (date: Date) => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!startDate) newErrors.startDate = 'Start date is required';
        if (!endDate) newErrors.endDate = 'End date is required';
        if (new Date(startDate) >= new Date(endDate)) {
            newErrors.endDate = 'End date must be after start date';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        onSave({
            id: initialEvent?.id || crypto.randomUUID(),
            title,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            color,
            category,
        });
        onClose();
    };

    const handleDelete = () => {
        if (initialEvent?.id) {
            onDelete(initialEvent.id);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialEvent?.id ? 'Edit Event' : 'Add Event'}
        >
            <div className="space-y-4">
                <Input
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={errors.title}
                    placeholder="Event title"
                    autoFocus
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Start"
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        error={errors.startDate}
                    />
                    <Input
                        label="End"
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        error={errors.endDate}
                    />
                </div>

                <Textarea
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add description..."
                    rows={3}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Color"
                        options={COLORS}
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                    <Select
                        label="Category"
                        options={CATEGORIES}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-100 mt-6">
                    {initialEvent?.id && (
                        <Button variant="danger" onClick={handleDelete} type="button" className="mr-auto">
                            Delete
                        </Button>
                    )}
                    <Button variant="secondary" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} type="button">
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
