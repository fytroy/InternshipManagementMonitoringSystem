import React from 'react';

const styles = {
    default: 'bg-slate-100 text-slate-800',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',

    // Custom Status Mappings
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
};

const Badge = ({ children, type = 'default', className = '' }) => {
    const styleClass = styles[children?.toString().toLowerCase()] || styles[type] || styles.default;

    return (
        <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
      ${styleClass}
      ${className}
    `}>
            {children}
        </span>
    );
};

export default Badge;
