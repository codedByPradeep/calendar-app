import React from 'react';
import { clsx } from 'clsx';

import { type CalendarEvent } from './CalendarView.types';

interface CalendarCellProps {
    date: Date;
    events: CalendarEvent[];
    isToday: boolean;
    isCurrentMonth: boolean;
    isSelected?: boolean;
    onClick: (date: Date) => void;
    onEventClick: (event: CalendarEvent) => void;
}

import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableEventProps {
    event: CalendarEvent;
    onEventClick: (event: CalendarEvent) => void;
    isDraggable: boolean;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({ event, onEventClick, isDraggable }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: event.id,
        disabled: !isDraggable,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        backgroundColor: event.color || '#3b82f6',
        color: '#fff',
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="text-xs px-2 py-1 rounded truncate transition-opacity hover:opacity-80 cursor-grab active:cursor-grabbing mb-1"
            onClick={(e) => {
                e.stopPropagation();
                onEventClick(event);
            }}
            role="button"
            tabIndex={0}
            aria-label={`Event: ${event.title}`}
        >
            {event.title}
        </div>
    );
};

export const CalendarCell: React.FC<CalendarCellProps & { isDroppable?: boolean }> = ({
    date,
    events,
    isToday,
    isCurrentMonth,
    isSelected,
    onClick,
    onEventClick,
    isDroppable = false,
}) => {
    const dayNumber = date.getDate();
    const { setNodeRef, isOver } = useDroppable({
        id: date.toISOString(),
        disabled: !isDroppable,
    });

    // Sort events by time just in case
    const sortedEvents = [...events].sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const visibleEvents = sortedEvents.slice(0, 3);
    const remainingCount = Math.max(0, sortedEvents.length - 3);

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "min-h-[120px] sm:min-h-[140px] border-b border-r border-neutral-200 p-2 transition-colors hover:bg-neutral-50 cursor-pointer flex flex-col group h-full",
                !isCurrentMonth && "bg-neutral-50 text-neutral-400 bg-opacity-30",
                isSelected && "bg-primary-50",
                isOver && "bg-primary-100 ring-2 ring-primary-500 ring-inset", // Visual feedback for drop target
                "focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
            )}
            onClick={() => onClick(date)}
            role="gridcell"
            aria-label={`${date.toDateString()}, ${events.length} events`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(date);
                }
            }}
        >
            <div className="flex justify-between items-start mb-1">
                <span className={clsx(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    isToday
                        ? "bg-primary-600 text-white"
                        : "text-neutral-700 group-hover:bg-neutral-100",
                    !isCurrentMonth && "text-neutral-400"
                )}>
                    {dayNumber}
                </span>
            </div>

            <div className="space-y-1 flex-1 overflow-hidden">
                {visibleEvents.map(event => (
                    <DraggableEvent
                        key={event.id}
                        event={event}
                        onEventClick={onEventClick}
                        isDraggable={isDroppable}
                    />
                ))}

                {remainingCount > 0 && (
                    <div className="text-xs text-neutral-500 font-medium pl-1">
                        +{remainingCount} more
                    </div>
                )}
            </div>
        </div>
    );
};
