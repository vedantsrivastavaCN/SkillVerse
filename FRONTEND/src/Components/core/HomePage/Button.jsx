import React from 'react';
import { Link } from 'react-router-dom';
import { setProgress } from '../../../slices/loadingBarSlice';
import { useDispatch } from 'react-redux';

const Button = ({ children, active, linkto }) => {
    const dispatch = useDispatch();
    
    return (
        <Link onClick={() => dispatch(setProgress(100))} to={linkto}>
            <button className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${active 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105' 
                    : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                }
            `}>
                {children}
            </button>
        </Link>
    );
};

export default Button;