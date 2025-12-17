import React, { useState } from 'react';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { Header } from './Header';
import { EventModal } from './EventModal';
import { useCalendar } from '../../hooks/useCalendar';
import { useEventManager } from '../../hooks/useEventManager';
import { type CalendarEvent } from './CalendarView.types';

export const CalendarView: React.FC = () => {
    const {
        currentDate,
        view,
        goToNextMonth,
        goToPreviousMonth,
        goToToday,
        setView
    } = useCalendar();

    const { events, addEvent, updateEvent, deleteEvent } = useEventManager();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Partial<CalendarEvent> | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setSelectedEvent(undefined);
        setIsModalOpen(true);
    };

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setSelectedDate(undefined);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (event: CalendarEvent) => {
        if (selectedEvent?.id) {
            updateEvent(event.id, event);
        } else {
            addEvent(event);
        }
    };

    const handleDeleteEvent = (id: string) => {
        deleteEvent(id);
    };

    const handleEventDrop = (event: CalendarEvent, newDate: Date) => {
        const duration = new Date(event.endDate).getTime() - new Date(event.startDate).getTime();
        const start = new Date(event.startDate);

        // Create new start date with the new date's year/month/day but original time
        const newStartDate = new Date(newDate);
        newStartDate.setHours(start.getHours(), start.getMinutes(), start.getSeconds());

        const newEndDate = new Date(newStartDate.getTime() + duration);

        updateEvent(event.id, {
            ...event,
            startDate: newStartDate,
            endDate: newEndDate,
        });
    };

    return (
        <div className="h-screen flex flex-col bg-neutral-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col bg-white rounded-xl shadow-card overflow-hidden">
                <Header
                    currentDate={currentDate}
                    view={view}
                    onNextMonth={goToNextMonth}
                    onPrevMonth={goToPreviousMonth}
                    onToday={goToToday}
                    onViewChange={setView}
                />

                <main className="flex-1 overflow-auto p-4">
                    {view === 'month' ? (
                        <MonthView
                            currentDate={currentDate}
                            events={events}
                            onDateClick={handleDateClick}
                            onEventClick={handleEventClick}
                            onEventDrop={handleEventDrop}
                        />
                    ) : (
                        <WeekView
                            currentDate={currentDate}
                            events={events}
                            onTimeSlotClick={handleDateClick}
                            onEventClick={handleEventClick}
                        />
                    )}
                </main>
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                initialEvent={selectedEvent}
                selectedDate={selectedDate}
            />
        </div>
    );
};
