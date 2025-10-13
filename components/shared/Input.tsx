'use client';

import React from 'react';
import SearchIcon from '@/components/icons/SearchIcon';

interface InputProps {
    containerClassName?: string;
    className?: string;
}

const Input: React.FC<InputProps> = ({ containerClassName, className }) => {
    return (
        <div className={`${containerClassName} relative`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon />
            </div>
            <input
                type="text"
                placeholder="Search agents, docs, chats..."
                className={`${className} w-80 pl-11 pr-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm`}
            />
        </div>
    );
};

export default Input;