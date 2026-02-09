import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const CounterBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(() => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/bookings/mybookings?date=${date}`);
            setBookings(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch counter bookings', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [date]);

    const totals = useMemo(() => {
        const totalAmount = bookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
        const upiAmount = bookings
            .filter((b) => b.paymentMode === 'upi')
            .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
        const cashAmount = bookings
            .filter((b) => b.paymentMode === 'cash')
            .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
        return { totalAmount, upiAmount, cashAmount };
    }, [bookings]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 font-serif">Total Seva Bookings</h2>
                    <p className="text-gray-500 mt-1">Daily summary for the selected date</p>
                </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Bookings</h3>
                    {loading && <span className="text-sm text-gray-400">Loading…</span>}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Seva</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Devotee</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Payment</th>
                                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((b) => (
                                <tr key={b._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        {b.seva?.titleEn || b.sevaName || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {b.devoteeName || b.guestName || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${b.paymentMode === 'cash' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                            {b.paymentMode || 'upi'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                                        ₹{Number(b.totalAmount || 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString() : '—'}
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400 font-medium">
                                        No bookings found for this date.
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

export default CounterBookings;
