import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 shadow-lg',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20 shadow-lg',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    icon: Icon,
    ...props
}) => {
    return (
        <button
            className={`
        relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200
        disabled:opacity-70 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!loading && Icon && <Icon className="w-4 h-4 mr-2" />}
            {children}
        </button>
    );
};

export default Button;
