import React from 'react';
import { FiEdit } from "react-icons/fi";

const IconBtn = ({
    text,
    onclick,
    children,
    disabled,
    outline = false,
    customClasses,
    type,
}) => {
    return (
        <button 
            className={`
                flex items-center gap-x-2 rounded-lg py-2 px-4 font-medium text-sm md:text-base
                transition-all duration-200
                ${outline 
                    ? 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${customClasses || ''}
            `}
            disabled={disabled}
            onClick={onclick}
            type={type}
        >
            {children ? (
                <>
                    <span>{text}</span>
                    {children}
                </>
            ) : (
                text
            )}
            <FiEdit />
        </button>
    );
};

export default IconBtn;