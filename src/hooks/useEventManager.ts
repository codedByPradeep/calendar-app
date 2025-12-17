import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type CalendarEvent } from '../components/Calendar/CalendarView.types';

interface EventState {
    events: CalendarEvent[];
    addEvent: (event: CalendarEvent) => void;
    updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
    deleteEvent: (id: string) => void;
    getEventsByDate: (date: Date) => CalendarEvent[];
}

export const useEventManager = create<EventState>()(
    persist(
        (set, get) => ({
            events: [],
            addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
            updateEvent: (id, updates) =>
                set((state) => ({
                    events: state.events.map((event) =>
                        event.id === id ? { ...event, ...updates } : event
                    ),
                })),
            deleteEvent: (id) =>
                set((state) => ({ events: state.events.filter((event) => event.id !== id) })),
            getEventsByDate: (date) => {
                const { events } = get();
                return events.filter((event) => {
                    // Simple check for same day start. 
                    // For multi-day events, this logic needs to be more robust in the View component 
                    // or here if we want to get all events visible on a day.
                    // For now, let's just match start date or if the date falls within the range.
                    const start = new Date(event.startDate);
                    const end = new Date(event.endDate);
                    const target = new Date(date);

                    // Normalize to start of day for comparison
                    start.setHours(0, 0, 0, 0);
                    end.setHours(0, 0, 0, 0);
                    target.setHours(0, 0, 0, 0);

                    return target >= start && target <= end;
                });
            },
        }),
        {
            name: 'calendar-events-storage',
            // We need to handle Date serialization since localStorage stores JSON strings
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;
                    return JSON.parse(str, (key, value) => {
                        if (key === 'startDate' || key === 'endDate') return new Date(value);
                        return value;
                    });
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
);
