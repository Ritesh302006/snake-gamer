import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm border flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]",
    secondary: "bg-gray-800/40 text-gray-200 border-gray-700/50 hover:bg-gray-700/50",
    ghost: "bg-transparent text-gray-400 border-transparent hover:text-white hover:bg-white/10 shadow-none",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
