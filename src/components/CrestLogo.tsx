import { media } from '../lib/media';
import React from 'react';

interface CrestLogoProps {
  className?: string;
  light?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CrestLogo: React.FC<CrestLogoProps> = ({ className = '', light = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-24 h-auto',
    md: 'w-36 h-auto',
    lg: 'w-48 h-auto',
    xl: 'w-64 h-auto',
  }[size];

  const logoSrc = light ? '/img/logo-white.svg' : media('/img/logo-black.svg');

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Park & Madison | The Morgan | 355 East 86th Street"
        className={`${sizeClasses} object-contain transition-transform duration-500 hover:scale-105`}
      />
    </div>
  );
};
