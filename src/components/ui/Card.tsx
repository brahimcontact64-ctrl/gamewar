import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-gaming-gray rounded-lg border border-gaming-gray-light p-4 ${
        hover ? 'transition-all duration-200 hover:border-gaming-green hover:shadow-lg hover:shadow-gaming-green/20' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
