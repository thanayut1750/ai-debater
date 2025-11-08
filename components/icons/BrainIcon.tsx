
import React from 'react';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h-3A2.5 2.5 0 0 1 4 4.5v0A2.5 2.5 0 0 1 6.5 2h3Z"></path>
    <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7h-3a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 11.5 2h3Z"></path>
    <path d="M12 14.5a2.5 2.5 0 0 0 2.5-2.5v-1a2.5 2.5 0 0 0-5 0v1a2.5 2.5 0 0 0 2.5 2.5Z"></path>
    <path d="M4.5 15.5A2.5 2.5 0 0 1 7 13h0a2.5 2.5 0 0 1 2.5 2.5v3A2.5 2.5 0 0 1 7 21h0a2.5 2.5 0 0 1-2.5-2.5v-3Z"></path>
    <path d="M19.5 15.5A2.5 2.5 0 0 0 17 13h0a2.5 2.5 0 0 0-2.5 2.5v3A2.5 2.5 0 0 0 17 21h0a2.5 2.5 0 0 0 2.5-2.5v-3Z"></path>
  </svg>
);

export default BrainIcon;
