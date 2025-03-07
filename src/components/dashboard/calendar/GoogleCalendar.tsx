
import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DayView } from './views/DayView';
import { CardView } from './views/CardView';
import { CalendarEventPopover } from './CalendarEventPopover';
import { DatePickerButton } from './components/DatePickerButton';
import { Button } from '@/components/ui/button';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';
import { CalendarMonthView } from './views/CalendarMonthView';
import { CalendarWeekView } from './views/CalendarWeekView';

// Define the props for the GoogleCalendar component
interface GoogleCalendarProps {
  selectedPhotographers?: number[];
  onTimeSlotClick?: (time: string) => void;
  onDayClick?: (date: Date) => void;
  defaultView?: "month" | "week" | "day" | "card";
  isMobileView?: boolean;
}

export function GoogleCalendar({ 
  selectedPhotographers = [], 
  onTimeSlotClick,
  onDayClick,
  defaultView = "month",
  isMobileView = false
}: GoogleCalendarProps) {
  const {
    viewMode,
    setViewMode,
    filteredEvents,
    activeOrders,
    filteredOrders,
    handleSelectSlot,
    calendarState
  } = useGoogleCalendar(selectedPhotographers, defaultView);

  const { 
    selectedEvent, 
    popoverPosition, 
    isPopoverOpen, setIsPopoverOpen,
    date, 
    isDatePickerOpen, setIsDatePickerOpen,
    calendarRef,
    handleSelectEvent,
    handleEditEvent,
    handleDeleteEvent,
    handleDateChange
  } = calendarState;

  // Render different views based on viewMode
  const renderCalendarView = () => {
    switch (viewMode) {
      case 'day':
        return (
          <DayView 
            date={date} 
            orders={activeOrders}
            onTimeSlotClick={onTimeSlotClick} 
          />
        );
      case 'card':
        return (
          <CardView
            selectedDate={date}
            orders={activeOrders}
            onDayClick={onDayClick}
          />
        );
      case 'week':
        return (
          <CalendarWeekView
            date={date}
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={(slotInfo) => handleSelectSlot(slotInfo, onTimeSlotClick, onDayClick)}
          />
        );
      default:
        return (
          <CalendarMonthView
            date={date}
            events={filteredEvents}
            onDateChange={calendarState.setDate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={(slotInfo) => handleSelectSlot(slotInfo, onTimeSlotClick, onDayClick)}
            viewMode={viewMode}
            onViewModeChange={(view) => setViewMode(view as any)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <DatePickerButton
            date={date}
            isOpen={isDatePickerOpen}
            onOpenChange={setIsDatePickerOpen}
            onDateChange={handleDateChange}
          />
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            Day
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}
          >
            Card
          </Button>
        </div>
      </div>

      <div className="flex-1 relative" ref={calendarRef}>
        {renderCalendarView()}

        {isPopoverOpen && selectedEvent && (
          <div
            className="absolute z-50"
            style={{
              left: `${popoverPosition.left}px`,
              top: `${popoverPosition.top}px`,
            }}
          >
            <CalendarEventPopover
              event={selectedEvent}
              onClose={() => setIsPopoverOpen(false)}
              onEdit={() => handleEditEvent(selectedEvent)}
              onDelete={() => handleDeleteEvent(selectedEvent)}
              orders={filteredOrders}
            />
          </div>
        )}
      </div>
    </div>
  );
}
