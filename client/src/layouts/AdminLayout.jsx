import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { LayoutDashboard, Users, FileText, Settings, Bell, LogOut, Home, BookOpen, Image, Menu, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

import { useTranslation } from 'react-i18next';

const AdminLayout = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
        return undefined;
    }, [user?.role]);

    const handleLogout = () => {
        dispatch(logout());
        toast.success(t('nav.logout_success', 'Logged out successfully'));
        navigate('/login');
    };

    const navItems = user?.role === 'counter'
        ? [{ name: 'Total Seva Bookings', path: '/admin/counter-bookings', icon: BookOpen }]
        : [
            { name: t('admin.layout.sankalpa_list'), path: '/admin/sankalpa', icon: Users },
            { name: 'Photo Orders', path: '/admin/photo-orders', icon: Image },
            { name: 'Devotees List', path: '/admin/devotees', icon: Users },
            { name: t('admin.layout.seva_management'), path: '/admin/sevas', icon: FileText },
            { name: t('admin.layout.hero_management'), path: '/admin/hero', icon: Image },
            { name: t('admin.layout.settings'), path: '/admin/settings', icon: Settings },
        ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`bg-slate-900 text-white shadow-xl flex flex-col w-64 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
                        {t('admin.layout.title')}
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">{t('admin.layout.subtitle')}</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
                {/* Topbar */}
                <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-8">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-gray-100"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {navItems.find(i => i.path === location.pathname)?.name || t('admin.layout.dashboard')}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link
                            to="/"
                            className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                            title={t('nav.home', 'Home')}
                        >
                            <Home className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/sevas"
                            className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                            title={t('nav.book_seva', 'Book Seva')}
                        >
                            <BookOpen className="w-5 h-5" />
                        </Link>
                        {user?.role === 'admin' && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2 text-gray-400 hover:text-orange-600 transition-colors relative"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <h3 className="font-bold text-gray-800">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(notification => (
                                                    <div
                                                        key={notification._id}
                                                        className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors cursor-pointer ${!notification.isRead ? 'bg-orange-50/50' : ''}`}
                                                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                                                    >
                                                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                                            {notification.message}
                                                        </p>
                                                        <span className="text-xs text-gray-400 mt-1 block">
                                                            {new Date(notification.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                                    {t('admin.notifications.empty', 'No new notifications')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {user?.role === 'counter' && (
                            <span className="text-sm font-bold text-gray-600">
                                Logged in as {user?.name}
                            </span>
                        )}
                        <div className="h-8 w-px bg-gray-200 mx-2"></div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-sm font-bold text-gray-500 hover:text-red-600 transition-colors group"
                        >
                            <LogOut className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                            {t('nav.logout')}
                        </button>
                    </div>
                </header>

                {/* content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
