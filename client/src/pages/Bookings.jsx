import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';

const Bookings = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [date, setDate] = useState(() => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                const endpoint = user?.role === 'admin' ? '/bookings' : '/bookings/mybookings';
                const response = await api.get(endpoint);
                const bookingsData = Array.isArray(response.data) ? response.data : [];
                setBookings(bookingsData);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [isAuthenticated, user?.role, navigate]);

    const toLocalDateInput = (value) => {
        const d = new Date(value);
        if (isNaN(d.getTime())) return '';
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter((b) => {
            if (!date) return true;
            return toLocalDateInput(b.bookingDate) === date;
        });
    }, [bookings, date]);

    const totals = useMemo(() => {
        const totalAmount = filteredBookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
        const upiAmount = filteredBookings
            .filter((b) => b.paymentMode === 'upi')
            .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
        const cashAmount = filteredBookings
            .filter((b) => b.paymentMode === 'cash')
            .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
        return { totalAmount, upiAmount, cashAmount };
    }, [filteredBookings]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">{t('common.loading')}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[60vh]">
            <Link
                to="/"
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-bold mb-6 group transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                {t('common.back_home')}
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{t('bookings.title')}</h1>
                <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                    <p className="text-2xl font-black text-gray-900 mt-2">₹{totals.totalAmount.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount in UPI</p>
                    <p className="text-2xl font-black text-green-600 mt-2">₹{totals.upiAmount.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount in Cash</p>
                    <p className="text-2xl font-black text-orange-600 mt-2">₹{totals.cashAmount.toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">Bookings</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Receipt No</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Mobile Number</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Seva Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Payment</th>
                                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                        {booking.receiptNo != null ? booking.receiptNo : (booking._id ? booking._id.slice(-6).toUpperCase() : '')}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                        {booking.guestPhone || booking.user?.phone || ''}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        {booking.devoteeName || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {i18n.language === 'kn'
                                            ? (booking.seva?.titleKn || booking.seva?.titleEn || booking.seva?.title || booking.sevaName)
                                            : (booking.seva?.titleEn || booking.seva?.titleKn || booking.seva?.title || booking.sevaName)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${booking.paymentMode === 'cash' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                            {booking.paymentMode || 'upi'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                                        ₹{Number(booking.totalAmount || 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            {filteredBookings.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-medium">
                                        {t('bookings.no_bookings')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Bookings;
