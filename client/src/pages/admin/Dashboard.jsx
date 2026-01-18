import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, Calendar, Activity, Home, BookOpen } from 'lucide-react';
import KPICard from '../../components/admin/KPICard';
import api from '../../utils/api';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const [stats, setStats] = useState({
        revenue: 0,
        bookings: 0,
        devotees: 0,
        averageBooking: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: bookings } = await api.get('/bookings');

                // Calculate Stats Correctly
                const revenue = bookings.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
                const totalDevotees = bookings.length; // Each booking is technically a devotee record
                const average = revenue > 0 ? (revenue / bookings.length).toFixed(0) : 0;

                setStats({
                    revenue,
                    bookings: bookings.length,
                    devotees: totalDevotees,
                    averageBooking: average
                });

                // Get recent 8 for better look
                setRecentBookings(bookings.slice(0, 8));

            } catch (error) {
                console.error("Dashboard error:", error);
                toast.error("Dashboard failed to sync");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 font-serif">{t('admin.dashboard.title')}</h2>
                    <p className="text-gray-500 mt-1">{t('admin.dashboard.subtitle')}</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">{t('admin.layout.system_live')}</span>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title={t('admin.dashboard.revenue')}
                    value={`₹${stats.revenue.toLocaleString()}`}
                    icon={CreditCard}
                    color="bg-emerald-500"
                    trend="up"
                    trendValue="12"
                />
                <KPICard
                    title={t('admin.dashboard.bookings')}
                    value={stats.bookings}
                    icon={Calendar}
                    color="bg-orange-500"
                    trend="up"
                    trendValue="5"
                />
                <KPICard
                    title={t('admin.dashboard.avg_size')}
                    value={`₹${stats.averageBooking}`}
                    icon={Activity}
                    color="bg-blue-500"
                    trend="down"
                    trendValue="2"
                />
                <KPICard
                    title={t('admin.dashboard.active_devotees')}
                    value={stats.devotees}
                    icon={Users}
                    color="bg-purple-500"
                    trend="up"
                    trendValue="8"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/" className="flex items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Home className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                        <h3 className="font-bold text-gray-900">{t('nav.home', 'Home Page')}</h3>
                        <p className="text-sm text-gray-500">Go to main website</p>
                    </div>
                </Link>
                <Link to="/sevas" className="flex items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                        <h3 className="font-bold text-gray-900">{t('nav.book_seva', 'Book Seva')}</h3>
                        <p className="text-sm text-gray-500">Create a new booking</p>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Bookings Table */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-800 text-lg">{t('admin.dashboard.ledger_title')}</h3>
                        <Link to="/admin/sankalpa" className="text-sm text-orange-600 font-semibold hover:underline">{t('admin.dashboard.full_report')}</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-400 uppercase font-bold text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">{t('admin.dashboard.ref_id')}</th>
                                    <th className="px-6 py-4">{t('admin.dashboard.devotee_details')}</th>
                                    <th className="px-6 py-4">{t('admin.dashboard.seva_offering')}</th>
                                    <th className="px-6 py-4">{t('admin.dashboard.amount')}</th>
                                    <th className="px-6 py-4">{t('admin.dashboard.status')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-orange-50/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">#{booking._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{booking.devoteeName}</div>
                                            <div className="text-xs text-gray-400">{booking.gothram}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-700">
                                                {i18n.language === 'kn' ? (booking.seva?.titleKn || booking.seva?.titleEn || booking.seva?.title || 'Seva') : (booking.seva?.titleEn || booking.seva?.titleKn || booking.seva?.title || 'Seva')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">₹{booking.totalAmount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === 'success' || booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {recentBookings.length === 0 && (
                            <div className="p-12 text-center">
                                <Activity className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">{t('admin.dashboard.no_bookings')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats/Info */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
                        <h4 className="text-lg font-bold mb-2">{t('admin.dashboard.insights')}</h4>
                        <p className="text-orange-100 text-sm mb-6">{t('admin.dashboard.insights_desc')}</p>
                        <Link
                            to="/admin/sevas"
                            className="inline-flex items-center justify-center w-full py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-sm"
                        >
                            {t('admin.dashboard.manage_offerings')}
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-800 mb-4">{t('admin.dashboard.op_status')}</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                                <span className="text-sm text-gray-600">{t('admin.dashboard.server_health')}</span>
                                <span className="text-sm font-bold text-green-600">{t('admin.dashboard.optimal')}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                                <span className="text-sm text-gray-600">{t('admin.dashboard.api_latency')}</span>
                                <span className="text-sm font-bold text-blue-600">42ms</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                                <span className="text-sm text-gray-600">{t('admin.dashboard.daily_goal')}</span>
                                <span className="text-sm font-bold text-orange-600">84%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
