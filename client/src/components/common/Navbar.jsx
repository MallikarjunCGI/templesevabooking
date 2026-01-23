import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Languages } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const toggleLanguage = () => {
        if (i18n && i18n.changeLanguage) {
            const newLang = i18n.language === 'en' ? 'kn' : 'en';
            i18n.changeLanguage(newLang);
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-[1000] border-b border-orange-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform duration-300">
                                <span className="text-white font-black text-xl">ॐ</span>
                            </div>
                            <span className="ml-2 sm:ml-3 text-sm min-[380px]:text-base sm:text-lg md:text-2xl font-black text-gray-900 tracking-tighter font-serif whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] min-[380px]:max-w-[200px] sm:max-w-none">
                                {t('nav.temple_name_prefix')} <span className="text-orange-600">{t('nav.temple_name_suffix')}</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
                        <div className="flex items-center space-x-1 border-r border-orange-100 pr-2 xl:pr-4 mr-1 xl:mr-2">
                            <Link
                                to="/"
                                className={`px-3 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-bold transition-all ${location.pathname === '/'
                                    ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                    }`}
                            >
                                {t('nav.home')}
                            </Link>

                            <Link
                                to="/sevas"
                                className={`px-3 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-bold transition-all ${location.pathname === '/sevas'
                                    ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                    }`}
                            >
                                {t('nav.book_seva')}
                            </Link>


                            {isAuthenticated && user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className={`px-3 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-bold transition-all ${location.pathname.startsWith('/admin')
                                        ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>

                        {/* Language Switcher */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center space-x-1 px-3 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all font-bold text-xs"
                        >
                            <Languages className="w-4 h-4" />
                            <span className="hidden xl:inline">{i18n?.language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
                            <span className="xl:hidden">{i18n?.language === 'en' ? 'KN' : 'EN'}</span>
                        </button>

                        {isAuthenticated && user && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-3 xl:px-4 py-2 rounded-full hover:bg-orange-100 transition-all group border border-orange-100"
                                >
                                    <div className="w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-xs xl:text-sm font-bold max-w-[100px] truncate">{user.name}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="block px-6 py-3 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                        {user.role !== 'admin' && (
                                            <Link
                                                to="/bookings"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="block px-6 py-3 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                            >
                                                {t('nav.my_bookings')}
                                            </Link>
                                        )}
                                        <div className="h-px bg-gray-100 my-1 mx-4"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            {t('nav.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center space-x-2">
                        <button
                            onClick={toggleLanguage}
                            className="p-2 rounded-full bg-gray-50 text-gray-600"
                        >
                            <Languages className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-gray-50 p-2 rounded-xl text-gray-600 hover:text-orange-600 transition-colors"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                isOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-bold ${location.pathname === '/' ? 'text-orange-600 bg-orange-50' : 'text-gray-700'
                                    }`}
                            >
                                {t('nav.home')}
                            </Link>
                            <Link
                                to="/sevas"
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-bold ${location.pathname === '/sevas' ? 'text-orange-600 bg-orange-50' : 'text-gray-700'
                                    }`}
                            >
                                {t('nav.book_seva')}
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-red-600 font-bold flex items-center"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                {t('nav.logout')}
                            </button>
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
