import React, { useState } from 'react';
import { sidebarLinks } from '../../../data/dashboard-links';
import { logout } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from 'react-redux';
import SidebarLink from './SidebarLink';
import { useNavigate } from 'react-router-dom';
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from '../../common/ConfirmationModal';

const Sidebar = () => {
    const { user, loading: profileLoading } = useSelector((state) => state.profile);
    const { loading: authLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);

    if (profileLoading || authLoading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className="custom-loader"></div>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Sidebar - CompeteHub Style */}
            <div className='hidden lg:flex w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-4rem)] flex-col'>
                {/* User Info Section */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {user?.accountType}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {sidebarLinks.map((link) => {
                            if (link.type && user?.accountType !== link.type) return null;
                            return (
                                <li key={link.id}>
                                    <SidebarLink link={link} iconName={link.icon} />
                                </li>
                            );
                        })}
                    </ul>

                    {/* Divider */}
                    <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

                    {/* Settings & Logout */}
                    <ul className="space-y-2">
                        <li>
                            <SidebarLink
                                link={{ name: "Settings", path: "/dashboard/settings" }}
                                iconName="VscSettingsGear"
                            />
                        </li>
                        <li>
                            <button
                                onClick={() => setConfirmationModal({
                                    text1: "Are You Sure?",
                                    text2: "You will be logged out of your account",
                                    btn1Text: "Logout",
                                    btn2Text: "Cancel",
                                    btn1Handler: () => dispatch(logout(navigate)),
                                    btn2Handler: () => setConfirmationModal(null),
                                })}
                                className='w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                            >
                                <VscSignOut className='text-lg' />
                                <span className="font-medium">Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Bottom Section - Pro/Premium Card (Optional) */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                        <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
                        <p className="text-xs opacity-90">Unlock all features</p>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation - CompeteHub Style */}
            <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50'>
                <div className='flex justify-around items-center py-2'>
                    {sidebarLinks.slice(0, 4).map((link) => {
                        if (link.type && user?.accountType !== link.type) return null;
                        return (
                            <SidebarLink 
                                key={link.id} 
                                link={link} 
                                iconName={link.icon} 
                                mobile={true}
                            />
                        );
                    })}
                    <SidebarLink
                        link={{ name: "More", path: "/dashboard/settings" }}
                        iconName="VscMenu"
                        mobile={true}
                    />
                </div>
            </div>

            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </>
    );
};

export default Sidebar;