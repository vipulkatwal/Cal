import React, { useEffect, useState } from 'react';
import { Calendar } from './components/Calendar'; // Import Calendar component
import { SearchBar } from './components/SearchBar'; // Import SearchBar component
import { useEventStore } from './store/useEventStore'; // Import custom hook to fetch event data
import { requestNotificationPermission } from './utils/notifications'; // Import utility to request notification permissions
import { CalendarEvent } from './types/event'; // Import types for event

function App() {
  // State to store search results
  const [searchResults, setSearchResults] = useState<CalendarEvent[]>([]);

  // Get the searchEvents function from the event store
  const searchEvents = useEventStore((state) => state.searchEvents);

  // Effect hook to request notification permission on mount
  useEffect(() => {
    const setupNotifications = async () => {
      await requestNotificationPermission(); // Request permission for notifications
    };
    setupNotifications();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle search input and filter events based on the query
  const handleSearch = (query: string) => {
    if (query.trim()) {
      const results = searchEvents(query); // Fetch search results from the event store
      setSearchResults(results); // Update state with search results
    } else {
      setSearchResults([]); // Clear results if the query is empty
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          {/* Header section */}
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            Calendar.io
          </h1>
          <p className="mt-2 text-gray-300">Manage your events with style</p>
        </div>

        <div className="mb-6">
          {/* Search bar component */}
          <SearchBar onSearch={handleSearch} />

          {/* Display search results if any */}
          {searchResults.length > 0 && (
            <div className="mt-4 bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-gray-100 mb-3">Search Results</h3>
              <div className="space-y-2">
                {/* Loop through search results and display them */}
                {searchResults.map((event) => (
                  <div
                    key={event.id} // Ensure each event has a unique key
                    className="p-3 hover:bg-white/5 rounded-md border border-white/10 transition-all duration-200"
                  >
                    {/* Event title */}
                    <h4 className="font-medium text-gray-100">{event.title}</h4>

                    {/* Event date and time */}
                    <p className="text-sm text-gray-300">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>

                    {/* Display event description if available */}
                    {event.description && (
                      <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Calendar component */}
        <Calendar />
      </div>
    </div>
  );
}

export default App;
