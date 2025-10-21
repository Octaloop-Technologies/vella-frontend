'use client';

import React from 'react';

interface CardProps {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ className = "bg-white border border-[#EBEBEB]", children, onClick  }) => {
    return (
        <div className={`${className} rounded-[10px] shadow-card` } onClick={onClick}>
            {children}
        </div>
    );
};

export default Card;
