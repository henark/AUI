import React from 'react';
import { cn } from '../../lib/utils';
/**
 * Props for the Button component
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  accentColor?: 'purple' | 'green' | 'pink' | 'blue' | 'cyan' | 'orange';
  neonLine?: boolean;
  icon?: React.ReactNode;
}
/**
 * Button - A customizable button component
 *
 * This component provides a reusable button with various styles,
 * sizes, and color options.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  accentColor = 'purple',
  neonLine = false,
  icon,
  className = '',
  ...props
}) => {
  // Size variations
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded',
    md: 'text-sm px-4 py-2 rounded-md',
    lg: 'text-base px-6 py-2.5 rounded-md'
  };
  // Style variations based on variant
  const variantClasses = {
    primary: 'relative overflow-hidden backdrop-blur-md font-medium text-black dark:text-white border group',
    secondary: 'bg-black/90 border text-white',
    outline: 'bg-white dark:bg-transparent border text-gray-800 dark:text-white',
    ghost: 'bg-transparent text-gray-700 dark:text-white hover:bg-gray-100/50 dark:hover:bg-white/5'
  };

  const accentColorClasses: Record<string, Record<string, string>> = {
    primary: {
        purple: 'bg-purple-500/80 hover:shadow-xl hover:shadow-purple-500/50 border-purple-500/50 border-t-purple-300 shadow-lg shadow-purple-500/40',
        green: 'bg-emerald-500/80 hover:shadow-xl hover:shadow-emerald-500/50 border-emerald-500/50 border-t-emerald-300 shadow-lg shadow-emerald-500/40',
        pink: 'bg-pink-500/80 hover:shadow-xl hover:shadow-pink-500/50 border-pink-500/50 border-t-pink-300 shadow-lg shadow-pink-500/40',
        blue: 'bg-blue-500/80 hover:shadow-xl hover:shadow-blue-500/50 border-blue-500/50 border-t-blue-300 shadow-lg shadow-blue-500/40',
        cyan: 'bg-cyan-500/80 hover:shadow-xl hover:shadow-cyan-500/50 border-cyan-500/50 border-t-cyan-300 shadow-lg shadow-cyan-500/40',
        orange: 'bg-orange-500/80 hover:shadow-xl hover:shadow-orange-500/50 border-orange-500/50 border-t-orange-300 shadow-lg shadow-orange-500/40',
    },
    secondary: {
        purple: 'text-purple-400 border-purple-500',
        green: 'text-emerald-400 border-emerald-500',
        pink: 'text-pink-400 border-pink-500',
        blue: 'text-blue-400 border-blue-500',
        cyan: 'text-cyan-400 border-cyan-500',
        orange: 'text-orange-400 border-orange-500',
    },
    outline: {
        purple: 'border-purple-500 hover:bg-purple-500/10',
        green: 'border-emerald-500 hover:bg-emerald-500/10',
        pink: 'border-pink-500 hover:bg-pink-500/10',
        blue: 'border-blue-500 hover:bg-blue-500/10',
        cyan: 'border-cyan-500 hover:bg-cyan-500/10',
        orange: 'border-orange-500 hover:bg-orange-500/10',
    },
    ghost: {}
  }
  const neonLineClasses = {
    purple: 'bg-purple-500 shadow-neon-purple',
    green: 'bg-emerald-500 shadow-neon-green',
    pink: 'bg-pink-500 shadow-neon-pink',
    blue: 'bg-blue-500 shadow-neon-blue',
    cyan: 'bg-cyan-500 shadow-neon-cyan',
    orange: 'bg-orange-500 shadow-neon-orange',
  };
  const luminousGlowClasses = {
    purple: 'bg-radial-glow-purple drop-shadow-glow-purple',
    green: 'bg-radial-glow-green drop-shadow-glow-green',
    pink: 'bg-radial-glow-pink drop-shadow-glow-pink',
    blue: 'bg-radial-glow-blue drop-shadow-glow-blue',
    cyan: 'bg-radial-glow-cyan drop-shadow-glow-cyan',
    orange: 'bg-radial-glow-orange drop-shadow-glow-orange',
  };
  const outerGlowClasses = {
    purple: 'shadow-glow-purple',
    green: 'shadow-glow-green',
    pink: 'shadow-glow-pink',
    blue: 'shadow-glow-blue',
    cyan: 'shadow-glow-cyan',
    orange: 'shadow-glow-orange',
  };
  return <button className={cn(
        'inline-flex items-center justify-center transition-all duration-200',
        sizeClasses[size],
        variantClasses[variant],
        accentColor && accentColorClasses[variant]?.[accentColor],
        className
      )} {...props}>
      {/* Luminous inner light source for primary variant */}
      {variant === 'primary' && <>
          <div className={cn(
            "absolute left-0 right-0 w-[150%] h-[200%] -translate-x-[25%] -translate-y-[30%] opacity-80 group-hover:opacity-100 rounded-[100%] blur-2xl transition-all duration-500 group-hover:scale-110 luminous-button-glow",
            accentColor && luminousGlowClasses[accentColor]
          )} aria-hidden="true" />
          {/* Subtle shine effect on top */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/70 opacity-90" aria-hidden="true" />
          {/* Enhanced outer glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-md opacity-50 group-hover:opacity-70",
            accentColor && outerGlowClasses[accentColor]
          )} aria-hidden="true" />
        </>}
      {/* Content with icon support */}
      <span className="relative z-10 flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
      {/* Optional neon line below button */}
      {neonLine && <span className={cn(
        'absolute bottom-0 left-[15%] right-[15%] w-[70%] mx-auto h-[2px]',
        accentColor && neonLineClasses[accentColor]
      )}></span>}
    </button>;
};