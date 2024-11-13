import React from 'react';
import { useForm } from 'react-hook-form'; // Importing useForm from react-hook-form for form handling
import { X, Trash2, Bell } from 'lucide-react'; // Importing icons from lucide-react
import { requestNotificationPermission } from '../utils/notifications'; // Importing the function for requesting notification permission
import { EventFormData } from '../types/event'; // Importing the EventFormData type for form validation

// Defining color options for event selection
const colorOptions = [
  { value: '#FF5733', label: 'Coral' },
  { value: '#33FF57', label: 'Mint' },
  { value: '#3357FF', label: 'Royal Blue' },
  { value: '#FF33F6', label: 'Pink' },
  { value: '#33FFF6', label: 'Cyan' },
  { value: '#FFB833', label: 'Orange' },
  { value: '#8333FF', label: 'Purple' },
  { value: '#FF3333', label: 'Red' },
];

// Defining the props interface for the EventForm component
interface EventFormProps {
  onSubmit: (data: EventFormData) => void; // onSubmit function to handle form data
  onClose: () => void; // onClose function to close the form
  onDelete?: () => void; // onDelete function to delete the event (optional)
  defaultValues?: Partial<EventFormData>; // defaultValues to populate the form for editing
}

// EventForm component definition
export const EventForm = ({ onSubmit, onClose, onDelete, defaultValues }: EventFormProps) => {
  // useForm hook initialization with default values and form validation
  const { register, handleSubmit, watch, formState: { errors } } = useForm<EventFormData>({
    defaultValues: {
      ...defaultValues, // Spread the default values if provided
      color: defaultValues?.color || colorOptions[0].value, // Set default color if not provided
      type: defaultValues?.type || 'text' // Default event type is 'text'
    }
  });

  // Watch the selected color value
  const selectedColor = watch('color');

  // Function to handle notification permission request
  const handleNotificationPermission = async () => {
    const granted = await requestNotificationPermission(); // Requesting notification permission
    if (granted) {
      alert('Notifications enabled! You will be notified before events.'); // Alert if permission is granted
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form header with title and notification options */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-100">
          {defaultValues?.title ? 'Edit Event' : 'New Event'} {/* Conditional title */}
        </h2>
        <div className="flex gap-2">
          {/* Button for enabling notifications */}
          <button
            type="button"
            onClick={handleNotificationPermission}
            className="p-2 hover:bg-white/5 rounded-full text-gray-300"
            title="Enable Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          {/* Button for closing the form */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Title field */}
      <div>
        <label className="block text-sm font-medium text-gray-200">Title</label>
        <input
          {...register('title', { required: 'Title is required' })} // Registering the title field with validation
          className="mt-1 block w-full rounded-md bg-white/5 border-white/10 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-400">{errors.title.message}</p> // Displaying error message if validation fails
        )}
      </div>

      {/* Description field */}
      <div>
        <label className="block text-sm font-medium text-gray-200">Description</label>
        <textarea
          {...register('description')} // Registering the description field
          className="mt-1 block w-full rounded-md bg-white/5 border-white/10 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      {/* Date and Time fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">Date</label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })} // Registering the date field with validation
            className="mt-1 block w-full rounded-md bg-white/5 border-white/10 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-400">{errors.date.message}</p> // Displaying error message for date field
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Time</label>
          <input
            type="time"
            {...register('time', { required: 'Time is required' })} // Registering the time field with validation
            className="mt-1 block w-full rounded-md bg-white/5 border-white/10 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.time && (
            <p className="mt-1 text-sm text-red-400">{errors.time.message}</p> // Displaying error message for time field
          )}
        </div>
      </div>

      {/* Type of event field */}
      <div>
        <label className="block text-sm font-medium text-gray-200">Type</label>
        <select
          {...register('type')} // Registering the event type field
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700
                    text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="text" className="bg-gray-800 text-white">Text</option>
          <option value="image" className="bg-gray-800 text-white">Image</option>
          <option value="video" className="bg-gray-800 text-white">Video</option>
        </select>
      </div>

      {/* Media URL field for images or videos */}
      <div>
        <label className="block text-sm font-medium text-gray-200">Media URL</label>
        <input
          {...register('mediaUrl')} // Registering the media URL field
          placeholder="Enter URL for image or video"
          className="mt-1 block w-full rounded-md bg-white/5 border-white/10 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      {/* Event color selection */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Event Color</label>
        <div className="grid grid-cols-4 gap-2">
          {colorOptions.map((color) => (
            <label
              key={color.value}
              className={`
                relative flex items-center justify-center p-2 rounded-md cursor-pointer
                ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-purple-500 ring-offset-slate-900' : ''} // Adding active ring if selected
              `}
              style={{ backgroundColor: color.value + '20' }} // Light background color for selection
            >
              <input
                type="radio"
                {...register('color')} // Registering the color field
                value={color.value}
                className="sr-only"
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color.value }} // Setting color for the circle
              />
              <span className="ml-2 text-xs text-gray-200">{color.label}</span> {/* Displaying color label */}
            </label>
          ))}
        </div>
      </div>

      {/* Submit and delete buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
        >
          {defaultValues?.title ? 'Update Event' : 'Create Event'} {/* Conditional button text */}
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete} // Trigger the delete function
            className="px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-md border border-red-500/20 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
};
