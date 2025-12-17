# Calendar View Component

A production-grade, accessible, and interactive Calendar View component built with React, TypeScript, and Tailwind CSS.

## Features

- **Views**: Toggle between Month and Week views.
- **Event Management**: Create, Read, Update, and Delete events.
- **Persistence**: Events are saved to `localStorage`.
- **Drag & Drop**: Move events between days in Month View.
- **Accessibility**: Full keyboard navigation and ARIA support.
- **Responsive**: Adapts to different screen sizes.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   # or
   npm install --legacy-peer-deps # if you encounter peer dependency issues with Storybook
   ```

### Running the App

```bash
npm run dev
```

### Running Storybook

```bash
npm run storybook
```

## Project Structure

- `src/components/Calendar`: Core calendar components (MonthView, WeekView, EventModal, etc.)
- `src/components/primitives`: Reusable UI components (Button, Modal, Input, etc.)
- `src/hooks`: Custom hooks (`useCalendar`, `useEventManager`)
- `src/utils`: Date manipulation utilities
- `src/styles`: Tailwind configuration and global styles

## Technologies

- React 18
- TypeScript
- Tailwind CSS v3
- Zustand (State Management)
- Date-fns
- Lucide React (Icons)
- Storybook 8

## License

MIT
