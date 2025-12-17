import React, { useMemo } from 'react';
import { type CalendarEvent } from './CalendarView.types';
import { clsx } from 'clsx';
import { isSameDay } from '../../utils/date.utils';

interface WeekViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onTimeSlotClick: (date: Date) => void;
    onEventClick: (event: CalendarEvent) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeekView: React.FC<WeekViewProps> = ({
    currentDate,
    events,
    onTimeSlotClick,
    onEventClick,
}) => {
    // Get the 7 days of the current week
    const weekDays = useMemo(() => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const days: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            days.push(d);
        }
        return days;
    }, [currentDate]);

    const today = new Date();

    // Helper to calculate event position styles
    const getEventStyle = (event: CalendarEvent) => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);

        const startHour = start.getHours() + start.getMinutes() / 60;
        const endHour = end.getHours() + end.getMinutes() / 60;
        const duration = endHour - startHour; // in hours

        return {
            top: `${startHour * 60}px`, // 60px per hour
            height: `${Math.max(duration * 60, 24)}px`, // Minimum height 24px
        };
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            {/* Header Row */}
            <div className="flex border-b border-neutral-200 bg-neutral-50 ml-14">
                {weekDays.map((day, index) => {
                    const isTodayDay = isSameDay(day, today);
                    return (
                        <div key={index} className="flex-1 py-3 text-center border-l border-neutral-200 first:border-l-0">
                            <div className="text-xs font-semibold uppercase text-neutral-500">{WEEKDAYS[day.getDay()]}</div>
                            <div className={clsx(
                                "mt-1 text-lg font-medium w-8 h-8 rounded-full flex items-center justify-center mx-auto",
                                isTodayDay ? "bg-primary-600 text-white" : "text-neutral-900"
                            )}>
                                {day.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Time Grid */}
            <div className="flex-1 overflow-y-auto relative h-[600px]"> {/* Fixed height for scrollable area */}
                <div className="flex relative min-h-[1440px]"> {/* 24 hours * 60px */}
                    {/* Time Labels Column */}
                    <div className="w-14 flex-none border-r border-neutral-200 bg-neutral-50 sticky left-0 z-10">
                        {HOURS.map(hour => (
                            <div key={hour} className="h-[60px] text-xs text-neutral-500 text-right pr-2 relative -top-2">
                                {hour === 0 ? '' : `${hour}:00`}
                            </div>
                        ))}
                    </div>

                    {/* Grid Columns */}
                    <div className="flex-1 flex relative">
                        {/* Horizontal Grid Lines */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            {HOURS.map(hour => (
                                <div key={hour} className="h-[60px] border-b border-neutral-100" />
                            ))}
                        </div>

                        {/* Day Columns */}
                        {weekDays.map((day) => {
                            const dayEvents = events.filter(e => isSameDay(new Date(e.startDate), day));

                            return (
                                <div
                                    key={day.toISOString()}
                                    className="flex-1 border-l border-neutral-200 first:border-l-0 relative group"
                                >
                                    {/* Clickable Time Slots (Overlay) - simplified 1h slots */}
                                    {HOURS.map(hour => (
                                        <div
                                            key={hour}
                                            className="h-[60px] w-full absolute z-0 hover:bg-neutral-50 transition-colors"
                                            style={{ top: `${hour * 60}px` }}
                                            onClick={() => {
                                                const clickDate = new Date(day);
                                                clickDate.setHours(hour, 0, 0, 0);
                                                onTimeSlotClick(clickDate);
                                            }}
                                        />
                                    ))}

                                    {/* Events */}
                                    {dayEvents.map(event => {
                                        const style = getEventStyle(event);
                                        return (
                                            <div
                                                key={event.id}
                                                className="absolute left-1 right-1 rounded px-2 py-1 text-xs text-white overflow-hidden cursor-pointer hover:brightness-110 z-10 shadow-sm"
                                                style={{
                                                    ...style,
                                                    backgroundColor: event.color || '#3b82f6',
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick(event);
                                                }}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Event: ${event.title} from ${event.startDate.toLocaleTimeString()} to ${event.endDate.toLocaleTimeString()}`}
                                            >
                                                <div className="font-semibold">{event.title}</div>
                                                <div className="opacity-90 text-[10px]">
                                                    {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
