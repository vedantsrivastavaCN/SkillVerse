import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from "react-router-dom";
import Sidebar from '../Components/core/Dashboard/Sidebar';

const Dashboard = () => {
    const { loading: authLoading } = useSelector((state) => state.auth);
    const { loading: profileLoading } = useSelector((state) => state.profile);

    if (profileLoading || authLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900'>
                <div className="custom-loader"></div>
            </div>
        );
    }

    return (
        <div className='flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900'>
            <Sidebar />
            <div className='flex-1 overflow-y-auto'>
                <div className='w-full'>
                    <main className='p-6'>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;