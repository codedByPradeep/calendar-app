import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../primitives/Button';
import { Select } from '../primitives/Select';
import { type CalendarViewType } from './CalendarView.types';
import { formatDate } from '../../utils/date.utils';

interface HeaderProps {
    currentDate: Date;
    view: CalendarViewType;
    onNextMonth: () => void;
    onPrevMonth: () => void;
    onToday: () => void;
    onViewChange: (view: CalendarViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({
    currentDate,
    view,
    onNextMonth,
    onPrevMonth,
    onToday,
    onViewChange,
}) => {
    return (
        <header className="flex flex-col sm:flex-row items-center justify-between border-b border-neutral-200 px-6 py-4 bg-white gap-4 sm:gap-0">
            <div className="flex items-center space-x-4">
                <div className="flex items-center text-neutral-900">
                    <CalendarIcon className="w-6 h-6 mr-2 text-primary-600" />
                    <h1 className="text-xl font-bold">{formatDate(currentDate)}</h1>
                </div>
                <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={onPrevMonth} aria-label="Previous month">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onNextMonth} aria-label="Next month">
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={onToday}>
                        Today
                    </Button>
                </div>
            </div>

            <div className="flex items-center">
                <div className="w-32">
                    <Select
                        options={[
                            { value: 'month', label: 'Month View' },
                            { value: 'week', label: 'Week View' },
                        ]}
                        value={view}
                        onChange={(e) => onViewChange(e.target.value as CalendarViewType)}
                        aria-label="Calendar view"
                    />
                </div>
            </div>
        </header>
    );
};
