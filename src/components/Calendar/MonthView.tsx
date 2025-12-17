import React from 'react';
import { CalendarCell } from './CalendarCell';
import { type CalendarEvent } from './CalendarView.types';
import { getCalendarGrid, isSameDay } from '../../utils/date.utils';

import { DndContext, type DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';

interface MonthViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onDateClick: (date: Date) => void;
    onEventClick: (event: CalendarEvent) => void;
    onEventDrop?: (event: CalendarEvent, newDate: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MonthView: React.FC<MonthViewProps> = ({
    currentDate,
    events,
    onDateClick,
    onEventClick,
    onEventDrop,
}) => {
    const gridDates = getCalendarGrid(currentDate);
    const today = new Date();

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id && onEventDrop) {
            const eventId = active.id as string;
            const newDateString = over.id as string;
            const newDate = new Date(newDateString);

            const droppedEvent = events.find(e => e.id === eventId);
            if (droppedEvent) {
                onEventDrop(droppedEvent, newDate);
            }
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50">
                    {WEEKDAYS.map(day => (
                        <div
                            key={day}
                            className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 auto-rows-fr bg-neutral-200 gap-px flex-1 border-b border-neutral-200">
                    {/* gap-px with bg-neutral-200 creates the grid lines if cells are white */}
                    {gridDates.map((date) => {
                        // Filter events for this day
                        const dayEvents = events.filter(e => isSameDay(new Date(e.startDate), date));
                        const isCurrentMonth = date.getMonth() === currentDate.getMonth();

                        return (
                            <div key={date.toISOString()} className="bg-white min-h-[100px]">
                                <CalendarCell
                                    date={date}
                                    isToday={isSameDay(date, today)}
                                    isCurrentMonth={isCurrentMonth}
                                    events={dayEvents}
                                    onClick={onDateClick}
                                    onEventClick={onEventClick}
                                    isDroppable={!!onEventDrop}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </DndContext>
    );
};
