import React from 'react';  // Import React
import { X } from 'lucide-react';  // Import the X icon from Lucide for closing the modal

// Define the props interface for Modal
interface ModalProps {
  isOpen: boolean;  // Whether the modal is open or not
  onClose: () => void;  // Function to close the modal
  children: React.ReactNode;  // Modal content (any valid JSX to display inside the modal)
}

// Modal component definition
export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  // If the modal is not open, render nothing (null)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay background */}
      {/* A semi-transparent black background with a blurred effect */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"  // bg-black/50 creates a semi-transparent black background
        onClick={onClose}  // Close the modal when the background is clicked
      />

      {/* Modal container */}
      <div className="relative z-50 w-full max-w-lg bg-slate-900/95 backdrop-blur-sm rounded-xl shadow-xl p-6 transform transition-all duration-200 scale-100 border border-white/10">

        {/* Close button */}
        {/* Positioned at the top-right corner of the modal */}
        <div className="absolute top-4 right-4">
          <X className="text-white cursor-pointer" onClick={onClose} />  {/* X icon to close the modal */}
        </div>

        {/* Render the modal content passed as children */}
        {children}
      </div>
    </div>
  );
};