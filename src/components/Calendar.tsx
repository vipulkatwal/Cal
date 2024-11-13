import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { useEventStore } from '../store/useEventStore';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../utils/cn';
import { Modal } from './Modal';
import { EventForm } from './EventForm';
import { EventFormData, CalendarEvent } from '../types/event';
import { scheduleNotification } from '../utils/notifications';

export const Calendar = () => {
  // State to manage selected date, modal visibility, and selected event for editing
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);

  // Fetching events and event manipulation functions from the store
  const events = useEventStore((state) => state.events);
  const addEvent = useEventStore((state) => state.addEvent);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const deleteEvent = useEventStore((state) => state.deleteEvent);

  // Calculating the start and end of the current month and generating the days for display
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Helper function to get events for a specific day
  const getDayEvents = (date: Date) => {
    return events.filter(event =>
      format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Handle form submission for both adding and updating events
  const handleEventSubmit = (data: EventFormData) => {
    const eventDate = new Date(data.date);
    const [hours, minutes] = data.time.split(':').map(Number);
    eventDate.setHours(hours, minutes);

    if (selectedEvent) {
      updateEvent(selectedEvent.id, { ...data });
      scheduleNotification(data.title, eventDate); // Set notification for updated event
    } else {
      const newEvent = {
        ...data,
        id: crypto.randomUUID(),
        date: eventDate,
      };
      addEvent(newEvent);
      scheduleNotification(data.title, eventDate); // Set notification for new event
    }
    handleCloseModal();
  };

  // Handle event click for editing
  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Handle deleting an event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      handleCloseModal();
    }
  };

  // Close modal and reset selected event
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {/* Calendar icon and month/year heading */}
            <CalendarIcon className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
              {format(selectedDate, 'MMMM yyyy')}
            </h2>
          </div>
          <div className="flex space-x-2">
            {/* Navigation buttons for previous month, today, and next month */}
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
              className="p-2 text-gray-200 hover:bg-purple-500/20 rounded-full transition-colors duration-300"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 text-sm text-gray-200 hover:bg-purple-500/20 rounded-full transition-colors duration-300 border border-purple-500/30"
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
              className="p-2 text-gray-200 hover:bg-purple-500/20 rounded-full transition-colors duration-300"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Days of the week labels */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-purple-200/80 py-2">
              {day}
            </div>
          ))}

          {/* Display each day of the month with events */}
          {days.map((day) => {
            const dayEvents = getDayEvents(day); // Fetch events for the day
            const isCurrentWeekday = format(day, 'EEEE') === format(new Date(), 'EEEE');

            return (
              <button
                key={day.toString()}
                onClick={() => {
                  setSelectedDate(day);
                  setSelectedEvent(null);
                  setIsModalOpen(true); // Open modal to create event on this date
                }}
                className={cn(
                  "min-h-24 p-2 border transition-all duration-300 relative group rounded-lg",
                  // Styles for hover, today's date, and current weekday
                  "hover:bg-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20",
                  "hover:transform hover:scale-[1.02]",
                  !isSameMonth(day, selectedDate) && "text-gray-500 bg-black/20 border-transparent",
                  isSameMonth(day, selectedDate) && "border-purple-500/10",
                  isToday(day) && "bg-purple-500/30 border-purple-400/50 ring-2 ring-purple-500/50 font-semibold",
                  isCurrentWeekday && !isToday(day) && "bg-purple-900/30 border-purple-400/20"
                )}
              >
                {/* Display day number */}
                <div className={cn(
                  "text-right mb-1",
                  isToday(day) ? "text-white font-bold" : "text-gray-300 font-medium"
                )}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {/* Show up to 3 events for the day */}
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(e, event)}
                      className="text-xs p-1.5 rounded-md truncate cursor-pointer transition-all duration-300
                              transform hover:scale-105 hover:shadow-md hover:ring-1 hover:ring-purple-500/50"
                      style={{
                        backgroundColor: `${event.color}20`,
                        color: event.color,
                        borderLeft: `3px solid ${event.color}`
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{event.time}</span>
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Indicate if there are more than 3 events */}
                {dayEvents.length > 3 && (
                  <div className="absolute bottom-1 right-1 text-xs text-purple-200 font-medium
                                bg-purple-500/30 px-1.5 py-0.5 rounded-full border border-purple-500/30">
                    +{dayEvents.length - 3}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal for creating or editing events */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <EventForm
          onSubmit={handleEventSubmit}
          onClose={handleCloseModal}
          onDelete={selectedEvent ? handleDeleteEvent : undefined}
          defaultValues={selectedEvent || {
            date: selectedDate,
            time: format(new Date(), 'HH:mm'),
            type: 'text',
            color: '#3357FF'
          }}
        />
      </Modal>
    </>
  );
};
