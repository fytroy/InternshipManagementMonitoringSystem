import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
    return (
        <div
            className={`
        bg-surface border border-slate-200/60 rounded-xl shadow-sm p-6
        ${hover ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;
