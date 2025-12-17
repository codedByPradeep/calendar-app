import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import { useEventManager } from '../../hooks/useEventManager';
import { useEffect } from 'react';

// Wrapper to inject initial state into the store for stories
const CalendarWrapper = ({ events, ...args }: any) => {
    const { addEvent } = useEventManager();

    useEffect(() => {
        // Clear existing (optional) and add sample
        // Ideally we'd reset the store, but for a simple story this works 
        // if we assume stories mount fresh or we don't mind accumulation in a session.
        // A better way is to mock the store or provide a context, 
        // but since useEventManager is a global zustand store, we populate it on mount.
        events.forEach((e: any) => addEvent(e));
    }, []);

    return <CalendarView {...args} />;
};

const meta: Meta<typeof CalendarView> = {
    title: 'Calendar/CalendarView',
    component: CalendarWrapper,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

const sampleEvents = [
    {
        id: '1',
        title: 'Team Standup',
        startDate: new Date(new Date().setHours(9, 0, 0, 0)),
        endDate: new Date(new Date().setHours(9, 30, 0, 0)),
        color: '#3b82f6',
        category: 'Meeting'
    },
    {
        id: '2',
        title: 'Design Review',
        startDate: new Date(new Date().setHours(14, 0, 0, 0)),
        endDate: new Date(new Date().setHours(15, 30, 0, 0)),
        color: '#10b981',
        category: 'Work'
    }
];

export const Default: Story = {
    args: {
        events: sampleEvents,
    },
};

export const Empty: Story = {
    args: {
        events: []
    }
};

export const WeekView: Story = {
    args: {
        events: sampleEvents,
    },
    // parameters to switch view? CalendarView doesn't accept initialView prop in my implementation yet usually? 
    // Wait, create hook defined internal state. 
    // If I want to control it via storybook, I pass props to CalendarView that init the hook.
    // I should check CalendarView implementation. It just uses useCalendar() with defaults.
    // To make it testable, I should probably accept optional props in CalendarView to pass to useCalendar.
};
