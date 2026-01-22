import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gaming-gray placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-accent">{error}</p>
      )}
    </div>
  );
};
