'use client';

import React from 'react';
import SearchIcon from '@/components/icons/SearchIcon';

interface InputProps {
    containerClassName?: string;
    className?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ containerClassName, className, placeholder = "Search agents, docs, chats...", value, onChange }) => {
    return (
        <div className={`${containerClassName} relative`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`${className} w-80 pl-11 pr-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm`}
            />
        </div>
    );
};

export default Input;