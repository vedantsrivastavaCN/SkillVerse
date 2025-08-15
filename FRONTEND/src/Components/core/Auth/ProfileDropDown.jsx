import { useRef, useState } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard, VscSignOut, VscAccount, VscSettingsGear } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { logout } from "../../../services/operations/authAPI";

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  if (!user) {
    console.log("no user");
    return localStorage.setItem("token", null);
  }

  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-2">
          {user?.image ? (
            <img
              src={user.image}
              alt={`profile-${user?.firstName}`}
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
          )}
          <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.firstName}
          </span>
          <AiOutlineCaretDown className={`text-gray-500 dark:text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
          ref={ref}
        >
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={`profile-${user?.firstName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link 
              to="/dashboard/my-profile" 
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <VscAccount className="text-lg" />
                <span className="text-sm font-medium">My Profile</span>
              </div>
            </Link>
            
            <Link 
              to="/dashboard" 
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <VscDashboard className="text-lg" />
                <span className="text-sm font-medium">Dashboard</span>
              </div>
            </Link>
            
            <Link 
              to="/dashboard/settings" 
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <VscSettingsGear className="text-lg" />
                <span className="text-sm font-medium">Settings</span>
              </div>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <button
              onClick={() => {
                dispatch(logout(navigate));
                setOpen(false);
              }}
              className="flex items-center space-x-3 px-4 py-2 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <VscSignOut className="text-lg" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}