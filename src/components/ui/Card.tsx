import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void | Promise<void>;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm ${
        hover ? 'transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
