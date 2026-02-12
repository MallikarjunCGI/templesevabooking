import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Loader2, Edit2, Trash2, X } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { useTranslation } from 'react-i18next';

const SankalpaList = () => {
    const { t } = useTranslation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [sevas, setSevas] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('all');
    

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (error) {
            console.error(error);
            toast.error(t('admin.sankalpa.op_failed', 'Failed to fetch sankalpa list'));
        } finally {
            setLoading(false);
        }
    };

    const fetchSevas = async () => {
        try {
            const { data } = await api.get('/sevas');
            setSevas(data);
        } catch (e) {
            console.warn('Failed to fetch sevas', e);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/auth/users');
            setUsers(Array.isArray(data) ? data : []);
        } catch (e) {
            console.warn('Failed to fetch users', e);
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchSevas();
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await api.delete(`/bookings/${id}`);
                setBookings(bookings.filter(b => b._id !== id));
                toast.success('Booking deleted successfully');
            } catch (error) {
                toast.error('Failed to delete booking');
            }
        }
    };

    const openEditModal = (booking) => {
        setCurrentBooking(booking);
        setEditFormData({
            devoteeName: booking.devoteeName || '',
            gothram: booking.gothram || '',
            rashi: booking.rashi || '',
            nakshatra: booking.nakshatra || '',
            bookingDate: booking.bookingDate ? booking.bookingDate.split('T')[0] : '',
            status: booking.status || '',
            guestPhone: booking.guestPhone || '',
            place: booking.place || '',
            pincode: booking.pincode || '',
            totalAmount: booking.totalAmount || 0,
            seva: booking.seva?._id || booking.seva
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/bookings/${currentBooking._id}`, editFormData);
            toast.success('Booking updated successfully');
            setIsEditModalOpen(false);
            fetchBookings();
        } catch (error) {
            toast.error('Failed to update booking');
        }
    };

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text(t('admin.sankalpa.pdf_title'), 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`${t('admin.sankalpa.pdf_generated')}: ${new Date().toLocaleString()}`, 14, 30);

            const tableColumn = ['Phone','Devotee Name','Seva Name','Amount','Booking Date','Village','Pincode'];
            const tableRows = filteredBookings.map(item => [
                item.guestPhone || item.user?.phone || '',
                item.devoteeName || '',
                item.sevaName || item.seva?.titleEn || item.seva?.title || '',
                item.totalAmount || 0,
                item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : '',
                item.place || '',
                item.pincode || ''
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'grid',
                headStyles: { fillColor: [234, 88, 12] }, // Match Navbar/Theme orange
                styles: { fontSize: 10 }
            });
            doc.save(`Sankalpa_List_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success(t('admin.sankalpa.pdf_exported'));
        } catch (error) {
            toast.error(t('admin.management.op_failed'));
        }
    };

    const handleExportCSV = () => {
        try {
            const header = ['Phone Number','Full Name','Seva Name','Booking Date','State','District','Taluk','Village','Full Address','Pin Code','Payment Mode','Amount'];
            const rows = filteredBookings.map(item => [
                item.guestPhone || item.user?.phone || '',
                item.devoteeName || '',
                item.sevaName || item.seva?.titleEn || item.seva?.title || '',
                item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : '',
                item.state || '',
                item.district || '',
                item.taluk || '',
                item.place || '',
                item.address || '',
                item.pincode || '',
                item.paymentMode || '',
                item.totalAmount || 0
            ]);

            const csvContent = [header, ...rows].map(e => e.map(v => '"' + String(v).replace(/"/g,'""') + '"').join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Seva_List_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('CSV exported');
        } catch (e) {
            toast.error('Failed to export CSV');
        }
    };

    const [sortBy, setSortBy] = useState('bookingDate');
    const [sortDir, setSortDir] = useState('desc');

    const filteredBookings = bookings.filter(item => {
        // Date range filter
        const bd = item.bookingDate ? new Date(item.bookingDate) : null;
        if (startDate) {
            const s = new Date(startDate);
            if (!bd || bd < s) return false;
        }
        if (endDate) {
            const e = new Date(endDate);
            e.setHours(23,59,59,999);
            if (!bd || bd > e) return false;
        }

        if (selectedUser === 'guest' && item.user) return false;
        if (selectedUser !== 'all' && selectedUser !== 'guest') {
            const userId = item.user?._id || item.user;
            if (!userId || String(userId) !== String(selectedUser)) return false;
        }

        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
            (item.devoteeName || '').toLowerCase().includes(q) ||
            (item.guestPhone || '').toLowerCase().includes(q) ||
            (item.guestName || '').toLowerCase().includes(q) ||
            (item.seva?.title || '').toLowerCase().includes(q) ||
            String(item.totalAmount || '').toLowerCase().includes(q) ||
            (item.place || '').toLowerCase().includes(q) ||
            (item.pincode || '').toLowerCase().includes(q)
        );
    });


    // sorting
    const sortedBookings = [...filteredBookings].sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1;
        const getVal = (it, key) => {
            if (key === 'phone') return (it.guestPhone || it.user?.phone || '').toString();
            if (key === 'devotee') return (it.devoteeName || '').toString();
            if (key === 'seva') return (it.sevaName || it.seva?.title || '').toString();
            if (key === 'amount') return Number(it.totalAmount || 0);
            if (key === 'receipt') return it.receiptNo != null ? Number(it.receiptNo) : 0;
            if (key === 'bookingDate') return it.bookingDate ? new Date(it.bookingDate) : new Date(0);
            if (key === 'place') return (it.place || '').toString();
            if (key === 'pincode') return (it.pincode || '').toString();
            return (it[ key ] || '').toString();
        };
        const va = getVal(a, sortBy);
        const vb = getVal(b, sortBy);
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
    });

    const totalDonation = sortedBookings.reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
    const totalUpi = sortedBookings
        .filter((b) => b.paymentMode === 'upi')
        .reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
    const totalCash = sortedBookings
        .filter((b) => b.paymentMode === 'cash')
        .reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
    const totalBooked = sortedBookings.length;

    

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 font-serif">Seva List</h2>
                    <p className="text-gray-500 mt-1">Seva Register</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                            <p className="text-2xl font-black text-gray-900 mt-2">Rs. {totalDonation}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount in UPI</p>
                            <p className="text-2xl font-black text-green-600 mt-2">Rs. {totalUpi}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount in Cash</p>
                            <p className="text-2xl font-black text-orange-600 mt-2">Rs. {totalCash}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 md:ml-auto">
                        <div className="text-left">
                            <div className="text-sm text-gray-500">Total Booked Seva</div>
                            <div className="text-xl font-bold text-gray-900">{totalBooked}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                PDF
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center px-4 py-2 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-md shadow-orange-200 transition-all active:scale-95"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search + Date Range */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative max-w-lg w-full md:w-1/3">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={t('admin.sankalpa.search_placeholder')}
                            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-500">User</label>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="p-2 border border-gray-200 rounded-lg bg-white"
                        >
                            <option value="all">All</option>
                            <option value="guest">Guest (No User)</option>
                            {users.map((u) => (
                                <option key={u._id} value={u._id}>
                                    {u.name} ({u.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-500">From</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border border-gray-200 rounded-lg" />
                        <label className="text-sm text-gray-500">To</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border border-gray-200 rounded-lg" />
                        <button onClick={() => { setStartDate(''); setEndDate(''); setSearchTerm(''); setSelectedUser('all'); }} className="p-2 border border-gray-200 rounded-lg bg-white">Clear</button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-400 uppercase font-bold text-[10px] tracking-widest">
                            <tr>
                                <th onClick={() => { setSortBy('receipt'); setSortDir(sortBy === 'receipt' && sortDir === 'asc' ? 'desc' : 'asc'); }} className="px-6 py-5 cursor-pointer">Receipt No</th>
                                <th onClick={() => { setSortBy('phone'); setSortDir(sortBy === 'phone' && sortDir === 'asc' ? 'desc' : 'asc'); }} className="px-6 py-5 cursor-pointer">Phone Number</th>
                                <th onClick={() => { setSortBy('devotee'); setSortDir(sortBy === 'devotee' && sortDir === 'asc' ? 'desc' : 'asc'); }} className="px-6 py-5 cursor-pointer">Devotee Name</th>
                                <th onClick={() => { setSortBy('seva'); setSortDir(sortBy === 'seva' && sortDir === 'asc' ? 'desc' : 'asc'); }} className="px-6 py-5 cursor-pointer">Seva Name</th>
                                <th className="px-6 py-5">Payment Mode</th>
                                <th onClick={() => { setSortBy('amount'); setSortDir(sortBy === 'amount' && sortDir === 'asc' ? 'desc' : 'asc'); }} className="px-6 py-5 cursor-pointer">Amount</th>
                                <th onClick={() => { setSortBy('bookingDate'); setSortDir(sortBy === 'bookingDate' && sortDir === 'asc' ? 'desc' : 'asc'); }} className="px-6 py-5 cursor-pointer">Booking Date</th>
                                <th onClick={() => { setSortBy('place'); setSortDir(sortBy === 'place' && sortDir === 'asc' ? 'desc' : 'asc'); }} className="px-6 py-5 cursor-pointer">Village</th>
                                <th onClick={() => { setSortBy('pincode'); setSortDir(sortBy === 'pincode' && sortDir === 'asc' ? 'desc' : 'asc'); }} className="px-6 py-5 cursor-pointer">Pincode</th>
                                <th className="px-6 py-5 text-right">{t('admin.management.actions', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.map((item) => (
                                <tr key={item._id} className="hover:bg-orange-50/30 transition-colors">
                                    <td className="px-6 py-5 font-mono text-gray-600">{item.receiptNo != null ? item.receiptNo : (item._id ? item._id.slice(-6).toUpperCase() : '')}</td>
                                    <td className="px-6 py-5 font-mono text-gray-600">{item.guestPhone || item.user?.phone || ''}</td>
                                    <td className="px-6 py-5 font-bold text-gray-900">{item.devoteeName}</td>
                                    <td className="px-6 py-5 font-medium text-gray-700">{item.sevaName || item.seva?.titleEn || item.seva?.title}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${item.paymentMode === 'cash' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                            {item.paymentMode || 'upi'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-orange-600">Rs. {item.totalAmount || 0}</td>
                                    <td className="px-6 py-5 font-mono text-gray-500">{item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : ''}</td>
                                    <td className="px-6 py-5">{item.place || ''}</td>
                                    <td className="px-6 py-5">{item.pincode || ''}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredBookings.length === 0 && (
                        <div className="p-16 text-center">
                            <Filter className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium">{t('admin.sankalpa.no_records')}</p>
                        </div>
                    )}

                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Edit Booking Details</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Devotee Name</label>
                                <input
                                    type="text"
                                    value={editFormData.devoteeName}
                                    onChange={(e) => setEditFormData({ ...editFormData, devoteeName: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={editFormData.guestPhone}
                                    onChange={(e) => setEditFormData({ ...editFormData, guestPhone: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seva</label>
                                <select
                                    value={editFormData.seva}
                                    onChange={(e) => setEditFormData({ ...editFormData, seva: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                >
                                    <option value="">Select Seva</option>
                                    {sevas.map(s => (
                                        <option key={s._id} value={s._id}>{s.titleEn} (₹{s.price})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input
                                        type="number"
                                        value={editFormData.totalAmount}
                                        onChange={(e) => setEditFormData({ ...editFormData, totalAmount: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        value={editFormData.pincode}
                                        onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Village / Place</label>
                                <input
                                    type="text"
                                    value={editFormData.place}
                                    onChange={(e) => setEditFormData({ ...editFormData, place: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gothram</label>
                                    <input
                                        type="text"
                                        value={editFormData.gothram}
                                        onChange={(e) => setEditFormData({ ...editFormData, gothram: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rashi</label>
                                    <input
                                        type="text"
                                        value={editFormData.rashi}
                                        onChange={(e) => setEditFormData({ ...editFormData, rashi: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nakshatra</label>
                                    <input
                                        type="text"
                                        value={editFormData.nakshatra}
                                        onChange={(e) => setEditFormData({ ...editFormData, nakshatra: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={editFormData.status}
                                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
                                <input
                                    type="date"
                                    value={editFormData.bookingDate}
                                    onChange={(e) => setEditFormData({ ...editFormData, bookingDate: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
                                >
                                    Update Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SankalpaList;








