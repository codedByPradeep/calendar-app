import { useState, useCallback } from 'react';
import { type CalendarState, type CalendarViewType } from '../components/Calendar/CalendarView.types';

export const useCalendar = (initialDate: Date = new Date()) => {
    const [state, setState] = useState<CalendarState>({
        currentDate: initialDate,
        view: 'month',
        selectedDate: null,
    });

    const goToNextMonth = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentDate: new Date(prev.currentDate.getFullYear(), prev.currentDate.getMonth() + 1, 1),
        }));
    }, []);

    const goToPreviousMonth = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentDate: new Date(prev.currentDate.getFullYear(), prev.currentDate.getMonth() - 1, 1),
        }));
    }, []);

    const goToToday = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentDate: new Date(),
        }));
    }, []);

    const setView = useCallback((view: CalendarViewType) => {
        setState(prev => ({ ...prev, view }));
    }, []);

    const selectDate = useCallback((date: Date | null) => {
        setState(prev => ({ ...prev, selectedDate: date }));
    }, []);

    return {
        ...state,
        goToNextMonth,
        goToPreviousMonth,
        goToToday,
        setView,
        selectDate,
    };
};
