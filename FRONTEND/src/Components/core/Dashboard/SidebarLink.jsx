import React from 'react';
import * as Icons from "react-icons/vsc";
import { useDispatch } from 'react-redux';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { setEditCourse } from '../../../slices/courseSlice';

const SidebarLink = ({ link, iconName, mobile = false }) => {
    const Icon = Icons[iconName];
    const location = useLocation();
    const dispatch = useDispatch();

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    };

    const isActive = matchRoute(link.path);

    // Mobile layout for bottom navigation
    if (mobile) {
        return (
            <NavLink
                to={link.path}
                onClick={() => dispatch(setEditCourse(false))}
                className={`flex flex-col items-center justify-center py-2 px-3 transition-all duration-200 ${
                    isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
                <Icon className="text-xl mb-1" />
                <span className="text-xs">{link.name}</span>
            </NavLink>
        );
    }

    // Desktop layout for sidebar
    return (
        <NavLink
            to={link.path}
            onClick={() => dispatch(setEditCourse(false))}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-4 border-blue-500'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
            }`}
        >
            <Icon className="text-lg flex-shrink-0" />
            <span className="font-medium">{link.name}</span>
        </NavLink>
    );
};

export default SidebarLink;