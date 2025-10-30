'use client';

import React from 'react';
import SearchIcon from '@/components/icons/SearchIcon';

interface InputProps {
    containerClassName?: string;
    className?: string;
    label?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ containerClassName, className, label, placeholder = "Search agents, docs, chats...", type = "text", value, onChange, onKeyDown, icon }) => {
    return (
        <div className={`${containerClassName} relative`}>
            {
                label && <label className="block text-[#1E1E1E] text-sm font-medium mb-2">{label}</label>
            }
            {
                icon && <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{icon}</div>
            }
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className={`${className} w-full ${icon ? 'pl-11 pr-4' : 'px-4'} py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-black`}
            />
        </div>
    );
};

export default Input;