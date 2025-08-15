import React, { useState, useEffect, useRef } from 'react';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TiShoppingCart } from 'react-icons/ti';
import { HiSearch, HiMenu, HiX } from 'react-icons/hi';
import { FaSun, FaMoon } from 'react-icons/fa';
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { categories } from '../../services/apis';
import { apiConnector } from '../../services/apiConnector';
import { setProgress } from '../../slices/loadingBarSlice';

const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { token } = useSelector(state => state.auth);
    const { user } = useSelector(state => state.profile);
    const { totalItems } = useSelector(state => state.cart);
    
    const [sublinks, setSublinks] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    
    const mobileMenuRef = useRef();
    const overlayRef = useRef();

    // Fetch course categories
    useEffect(() => {
    const fetchSublinks = async () => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            if (result?.data?.data?.length > 0) {
                    setSublinks(result?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
        };
        fetchSublinks();
    }, []);

    // Initialize dark mode
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || !theme) {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue?.length > 0) {
            navigate(`/search/${searchValue}`);
            setSearchValue("");
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const matchRoutes = (routes) => {
        return matchPath({ path: routes }, location.pathname);
    };

    return (
        <>
            {/* Main Navbar - CompeteHub Style */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo Section */}
                        <Link to='/' onClick={() => dispatch(setProgress(100))} className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">SV</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">SkillVerse</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className={`${location.pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium`}>
                                Home
                            </Link>
                            
                            {/* Courses Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                                    <span>Courses</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {sublinks.length > 0 && (
                                    <div className="invisible absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                                        <div className="py-2">
                                            {sublinks.map((category, index) => (
                                                <Link
                                                    key={index}
                                                    to={`/catalog/${category?.name}`}
                                                    onClick={() => dispatch(setProgress(30))}
                                                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    {category?.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <Link to="/about" className={`${matchRoutes('/about') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium`}>
                                About
                            </Link>
                            
                            <Link to="/contact" className={`${matchRoutes('/contact') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium`}>
                                Contact
                </Link>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-4">
                            {/* Search Bar - Desktop */}
                            <form onSubmit={handleSearch} className="hidden md:block">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        placeholder="Search courses..."
                                        className="w-48 lg:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                    <HiSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-5 h-5" />
                                </div>
                            </form>

                            {/* Theme Toggle */}
                            <button 
                                onClick={toggleTheme}
                                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                            </button>

                            {/* Cart Icon */}
                            {user && user?.accountType !== "Instructor" && (
                                <Link to='/dashboard/cart' className='relative' onClick={() => dispatch(setProgress(100))}>
                                    <TiShoppingCart className='text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 w-7 h-7 transition-colors' />
                                    {totalItems > 0 && (
                                        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium'>
                                            {totalItems}
                                        </span>
                                    )}
                            </Link>
                            )}

                            {/* Auth Buttons / Profile */}
                            {!token ? (
                                <div className="hidden md:flex items-center space-x-3">
                                    <Link to='/login' onClick={() => dispatch(setProgress(100))}>
                                        <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                            Sign In
                                        </button>
                                    </Link>
                                    <Link to='/signup' onClick={() => dispatch(setProgress(100))}>
                                        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105">
                                            Sign Up
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="hidden md:block">
                                        <ProfileDropDown />
                                    </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                            </button>
                            </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div 
                        ref={overlayRef}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={toggleMobileMenu}
                    />
                    
                    {/* Menu Panel */}
                    <div 
                        ref={mobileMenuRef}
                        className="fixed right-0 top-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl z-50 md:hidden transform transition-transform duration-300"
                    >
                        <div className="p-6">
                            {/* Close Button */}
                            <button
                                onClick={toggleMobileMenu}
                                className="absolute top-4 right-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            >
                                <HiX className="w-6 h-6" />
                            </button>

                            {/* Mobile Menu Content */}
                            <div className="mt-8 space-y-4">
                                {/* Search Bar - Mobile */}
                                <form onSubmit={(e) => { handleSearch(e); toggleMobileMenu(); }}>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            placeholder="Search courses..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        />
                                        <HiSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-5 h-5" />
                                    </div>
                                </form>

                                {/* Navigation Links */}
                                <nav className="space-y-2">
                                    <Link 
                                        to="/" 
                                        onClick={() => { dispatch(setProgress(100)); toggleMobileMenu(); }}
                                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Home
                                                            </Link>
                                    
                                    {/* Courses Section */}
                                    <div className="px-4 py-2">
                                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Courses
                                        </p>
                                        {sublinks.map((category, index) => (
                                            <Link
                                                key={index}
                                                to={`/catalog/${category?.name}`}
                                                onClick={() => { dispatch(setProgress(30)); toggleMobileMenu(); }}
                                                className="block py-2 pl-4 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                {category?.name}
                                            </Link>
                                        ))}
                                    </div>
                                    
                                    <Link 
                                        to="/about" 
                                        onClick={() => { dispatch(setProgress(100)); toggleMobileMenu(); }}
                                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        About
                                    </Link>
                                    
                                    <Link 
                                        to="/contact" 
                                        onClick={() => { dispatch(setProgress(100)); toggleMobileMenu(); }}
                                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Contact
                            </Link>
                                </nav>

                                {/* Auth Section */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    {!token ? (
                                        <div className="space-y-3">
                                            <Link to='/login' onClick={() => { dispatch(setProgress(100)); toggleMobileMenu(); }}>
                                                <button className="w-full text-center py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                    Sign In
                                </button>
                            </Link>
                                            <Link to='/signup' onClick={() => { dispatch(setProgress(100)); toggleMobileMenu(); }}>
                                                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                                                    Sign Up
                                </button>
                            </Link>
                                        </div>
                                    ) : (
                                        <div className="pt-2">
                                <ProfileDropDown />
                            </div>
                                    )}
                </div>
            </div>
        </div>
                    </div>
                </>
            )}
            
            {/* Spacer for fixed navbar */}
            <div className="h-16" />
        </>
    );
};

export default NavBar;