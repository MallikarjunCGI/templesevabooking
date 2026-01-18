import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Loader2, Edit2, Trash2, X } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { useTranslation } from 'react-i18next';

const SankalpaList = () => {
    const { t } = useTranslation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [editFormData, setEditFormData] = useState({});

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

    useEffect(() => {
        fetchBookings();
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
            devoteeName: booking.devoteeName,
            gothram: booking.gothram,
            rashi: booking.rashi,
            nakshatra: booking.nakshatra,
            bookingDate: booking.bookingDate ? booking.bookingDate.split('T')[0] : '',
            status: booking.status
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

            const tableColumn = [
                t('admin.sankalpa.col_info'),
                t('admin.sankalpa.col_gothram'),
                t('sankalpa.rashi'),
                t('sankalpa.nakshatra'),
                t('admin.sankalpa.col_seva'),
                "Contact Info",
                t('admin.sankalpa.col_date')
            ];
            const tableRows = bookings.map(item => [
                item.devoteeName,
                item.gothram,
                item.rashi,
                item.nakshatra,
                item.seva?.title,
                `${item.guestName || ''} (${item.guestEmail || item.guestPhone || ''})`,
                new Date(item.bookingDate).toLocaleDateString()
            ]);

            doc.autoTable({
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

    const filteredBookings = bookings.filter(item =>
        item.devoteeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.seva?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h2 className="text-3xl font-bold text-gray-900 font-serif">{t('admin.sankalpa.title')}</h2>
                    <p className="text-gray-500 mt-1">{t('admin.sankalpa.subtitle')}</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-md shadow-orange-200 transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {t('admin.sankalpa.export_pdf')}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search Bar */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                    <div className="relative max-w-lg">
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
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-400 uppercase font-bold text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-5">{t('admin.sankalpa.col_info')}</th>
                                <th className="px-6 py-5">{t('admin.sankalpa.col_gothram')}</th>
                                <th className="px-6 py-5">{t('admin.sankalpa.col_astrology')}</th>
                                <th className="px-6 py-5">{t('admin.sankalpa.col_seva')}</th>
                                <th className="px-6 py-5">Contact Info</th>
                                <th className="px-6 py-5">{t('admin.sankalpa.col_date')}</th>
                                <th className="px-6 py-5">{t('admin.sankalpa.col_status')}</th>
                                <th className="px-6 py-5 text-right">{t('admin.management.actions', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.map((item) => (
                                <tr key={item._id} className="hover:bg-orange-50/30 transition-colors">
                                    <td className="px-6 py-5 font-bold text-gray-900">{item.devoteeName}</td>
                                    <td className="px-6 py-5 font-medium text-gray-600">{item.gothram}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800">{item.rashi}</span>
                                            <span className="text-xs text-orange-600 font-medium">{item.nakshatra}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-medium text-gray-700">{item.seva?.title}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col text-xs">
                                            <span className="font-bold text-gray-800">{item.guestName || item.user?.name}</span>
                                            <span className="text-gray-500">{item.guestEmail || item.user?.email}</span>
                                            <span className="text-gray-500">{item.guestPhone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-mono text-gray-500">{new Date(item.bookingDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'Completed' || item.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {item.status}
                                        </span>
                                    </td>
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
