'use client';

import React from 'react';

interface CardProps {
    className?: string;
    children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
    return (
        <div className={`bg-white border border-[#EBEBEB] rounded-[10px] shadow-card ${className}`}>
            {children}
        </div>
    );
};

export default Card;
