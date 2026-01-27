import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const PhotoOrders = () => {
    const { t } = useTranslation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [completionFilter, setCompletionFilter] = useState('all'); // all | completed | pending

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (e) {
            console.error(e);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const isPhotoOrder = (item) => {
        const text = (item.sevaName || item.seva?.titleEn || item.seva?.title || '').toLowerCase();
        return text.includes('photo') || text.includes('temple god');
    };

    const filtered = bookings.filter(isPhotoOrder).filter(item => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
            (item.guestPhone || '').toLowerCase().includes(q) ||
            (item.devoteeName || '').toLowerCase().includes(q) ||
            (item.state || '').toLowerCase().includes(q) ||
            (item.district || '').toLowerCase().includes(q) ||
            (item.taluk || '').toLowerCase().includes(q) ||
            (item.place || '').toLowerCase().includes(q) ||
            (item.pincode || '').toLowerCase().includes(q) ||
            (item.address || '').toLowerCase().includes(q)
        );
    });

    // apply completion filter
    const filteredWithCompletion = filtered.filter(b => {
        if (completionFilter === 'all') return true;
        if (completionFilter === 'completed') return !!b.photoOrderCompleted;
        return !b.photoOrderCompleted;
    });

    const toggleCompleted = async (b) => {
        try {
            const res = await api.put(`/bookings/${b._id}`, { photoOrderCompleted: !b.photoOrderCompleted });
            setBookings(prev => prev.map(p => p._id === b._id ? res.data : p));
            toast.success('Updated');
        } catch (e) {
            toast.error('Failed to update');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
            <div className="p-4 border-b">
                <h2 className="text-2xl font-bold">Photo Orders</h2>
                <p className="text-sm text-gray-500">Temple God Photo Orders</p>
            </div>
                <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <div className="max-w-md w-full md:flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="w-4 h-4 text-gray-400" /></div>
                            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search phone, name, district, taluk, place, pincode, address" className="pl-10 w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                    <div className="mt-3 md:mt-0">
                        <label className="text-sm text-gray-600 mr-2">Filter:</label>
                        <select value={completionFilter} onChange={(e) => setCompletionFilter(e.target.value)} className="p-2 border rounded-lg">
                            <option value="all">All</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto p-4">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-400 uppercase font-bold text-[10px] tracking-widest">
                        <tr>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Devotee</th>
                            <th className="px-4 py-3">State</th>
                            <th className="px-4 py-3">District</th>
                            <th className="px-4 py-3">Taluk</th>
                            <th className="px-4 py-3">Village</th>
                            <th className="px-4 py-3">Pincode</th>
                            <th className="px-4 py-3">Address</th>
                            <th className="px-4 py-3">Order Completed</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredWithCompletion.map(b => (
                            <tr key={b._id} className="hover:bg-orange-50/30">
                                <td className="px-4 py-3">{b.guestPhone || b.user?.phone || ''}</td>
                                <td className="px-4 py-3">{b.devoteeName}</td>
                                <td className="px-4 py-3">{b.state || ''}</td>
                                <td className="px-4 py-3">{b.district || ''}</td>
                                <td className="px-4 py-3">{b.taluk || ''}</td>
                                <td className="px-4 py-3">{b.place || ''}</td>
                                <td className="px-4 py-3">{b.pincode || ''}</td>
                                <td className="px-4 py-3">{b.address || ''}</td>
                                <td className="px-4 py-3"><input type="checkbox" checked={!!b.photoOrderCompleted} onChange={() => toggleCompleted(b)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-16 text-center">
                        <Filter className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">No photo orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoOrders;
