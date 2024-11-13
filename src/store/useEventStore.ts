// Importing necessary modules from zustand and other dependencies
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalendarEvent } from '../types/event';

// Defining the shape of the Event Store using TypeScript interface
interface EventStore {
  events: CalendarEvent[];  // Array of events in the calendar
  addEvent: (event: CalendarEvent) => void;  // Method to add a new event
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;  // Method to update an existing event
  deleteEvent: (id: string) => void;  // Method to delete an event
  getEventsByDate: (date: Date) => CalendarEvent[];  // Method to get events by a specific date
  searchEvents: (query: string) => CalendarEvent[];  // Method to search events by a query string
}

// Creating the event store with persistence middleware
export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      events: [], // Initialize with an empty array of events

      // Method to add a new event to the store
      addEvent: (event) => {
        set((state) => ({
          events: [
            ...state.events,
            {
              ...event,  // Spread existing event data
              date: new Date(event.date),  // Ensure the event date is a Date object
            },
          ],
        }));
      },

      // Method to update an existing event by its ID
      updateEvent: (id, updatedEvent) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id
              ? {
                  ...event,  // Spread the existing event data
                  ...updatedEvent,  // Spread the updated event data
                  date: updatedEvent.date ? new Date(updatedEvent.date) : event.date,  // Ensure the date is updated correctly
                }
              : event // Return the event unchanged if it doesn't match the ID
          ),
        }));
      },

      // Method to delete an event by its ID
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),  // Filter out the event with the matching ID
        }));
      },

      // Method to get events for a specific date
      getEventsByDate: (date) => {
        return get().events.filter(
          (event) => event.date.toDateString() === date.toDateString()  // Compare the event date with the given date
        );
      },

      // Method to search for events by a query string (case-insensitive)
      searchEvents: (query) => {
        const lowercaseQuery = query.toLowerCase();  // Convert query to lowercase for case-insensitive search
        return get().events.filter(
          (event) =>
            event.title.toLowerCase().includes(lowercaseQuery) ||  // Check if the event title contains the query string
            event.description.toLowerCase().includes(lowercaseQuery)  // Check if the event description contains the query string
        );
      },
    }),
    {
      // Configuring the persistence layer to store events in localStorage
      name: 'calendar-events',  // Name of the key to store in localStorage
      storage: {
        // Custom getter for retrieving data from localStorage
        getItem: (name) => {
          const str = localStorage.getItem(name);  // Get the string from localStorage by key
          if (!str) return null;  // If there's no data, return null
          const data = JSON.parse(str);  // Parse the stored string to an object
          return {
            ...data,  // Spread the parsed data
            state: {
              ...data.state,  // Spread the state object
              events: data.state.events.map((event: CalendarEvent) => ({
                ...event,  // Spread the event object
                date: new Date(event.date),  // Ensure the date is converted back to a Date object
              })),
            },
          };
        },

        // Custom setter for saving data to localStorage
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),  // Store the state in localStorage as a JSON string

        // Custom remove method to delete data from localStorage
        removeItem: (name) => localStorage.removeItem(name),  // Remove the item from localStorage by key
      },
    }
  )
);
