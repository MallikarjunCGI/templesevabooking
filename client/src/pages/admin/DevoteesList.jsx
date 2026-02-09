import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Loader2, Edit2, Trash2, X } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const DevoteesList = () => {
    const [devotees, setDevotees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDir, setSortDir] = useState('desc');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentDevotee, setCurrentDevotee] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const fetchDevotees = async () => {
        try {
            const { data } = await api.get('/devotees');
            setDevotees(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch devotees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevotees();
    }, []);

    const openEditModal = (devotee) => {
        setCurrentDevotee(devotee);
        setEditFormData({
            mobile: devotee.mobile || '',
            fullName: devotee.fullName || '',
            gothram: devotee.gothram || '',
            state: devotee.state || '',
            district: devotee.district || '',
            taluk: devotee.taluk || '',
            place: devotee.place || '',
            pincode: devotee.pincode || '',
            fullAddress: devotee.fullAddress || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/devotees/${currentDevotee._id}`, editFormData);
            setDevotees((prev) => prev.map((d) => (d._id === data._id ? data : d)));
            toast.success('Devotee updated');
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update devotee');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this devotee?')) return;
        try {
            await api.delete(`/devotees/${id}`);
            setDevotees((prev) => prev.filter((d) => d._id !== id));
            toast.success('Devotee deleted');
        } catch (error) {
            toast.error('Failed to delete devotee');
        }
    };

    const filteredDevotees = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return devotees;
        return devotees.filter((d) => {
            return (
                (d.mobile || '').toLowerCase().includes(q) ||
                (d.fullName || '').toLowerCase().includes(q) ||
                (d.gothram || '').toLowerCase().includes(q) ||
                (d.state || '').toLowerCase().includes(q) ||
                (d.district || '').toLowerCase().includes(q) ||
                (d.taluk || '').toLowerCase().includes(q) ||
                (d.place || '').toLowerCase().includes(q) ||
                (d.pincode || '').toLowerCase().includes(q) ||
                (d.fullAddress || '').toLowerCase().includes(q) ||
                String(d.totalAmountSpent || '').toLowerCase().includes(q) ||
                String(d.sevaCount || '').toLowerCase().includes(q)
            );
        });
    }, [devotees, searchTerm]);

    const sortedDevotees = useMemo(() => {
        const dir = sortDir === 'asc' ? 1 : -1;
        return [...filteredDevotees].sort((a, b) => {
            const va = Number(a.totalAmountSpent || 0);
            const vb = Number(b.totalAmountSpent || 0);
            if (va < vb) return -1 * dir;
            if (va > vb) return 1 * dir;
            return 0;
        });
    }, [filteredDevotees, sortDir]);

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
                    <h2 className="text-3xl font-bold text-gray-900 font-serif">Devotees List</h2>
                    <p className="text-gray-500 mt-1">All devotees from records</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all"
                    >
                        Sort by Total Amount ({sortDir === 'asc' ? 'ASC' : 'DESC'})
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative max-w-lg w-full md:w-1/2">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by any field..."
                            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-400 uppercase font-bold text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-5">Mobile</th>
                                <th className="px-6 py-5">Full Name</th>
                                <th className="px-6 py-5">State</th>
                                <th className="px-6 py-5">District</th>
                                <th className="px-6 py-5">Taluk</th>
                                <th className="px-6 py-5">Village</th>
                                <th className="px-6 py-5">Pincode</th>
                                <th className="px-6 py-5">Total Amount</th>
                                <th className="px-6 py-5">Seva Count</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedDevotees.map((d) => (
                                <tr key={d._id} className="hover:bg-orange-50/30 transition-colors">
                                    <td className="px-6 py-5 font-mono text-gray-600">{d.mobile}</td>
                                    <td className="px-6 py-5 font-bold text-gray-900">{d.fullName}</td>
                                    <td className="px-6 py-5">{d.state || ''}</td>
                                    <td className="px-6 py-5">{d.district || ''}</td>
                                    <td className="px-6 py-5">{d.taluk || ''}</td>
                                    <td className="px-6 py-5">{d.place || ''}</td>
                                    <td className="px-6 py-5">{d.pincode || ''}</td>
                                    <td className="px-6 py-5 font-bold text-orange-600">Rs. {d.totalAmountSpent || 0}</td>
                                    <td className="px-6 py-5">{d.sevaCount || 0}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => openEditModal(d)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(d._id)}
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
                    {sortedDevotees.length === 0 && (
                        <div className="p-16 text-center">
                            <Filter className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium">No devotees found</p>
                        </div>
                    )}
                </div>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Edit Devotee</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editFormData.fullName}
                                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                                <input
                                    type="text"
                                    value={editFormData.mobile}
                                    onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        value={editFormData.state}
                                        onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                    <input
                                        type="text"
                                        value={editFormData.district}
                                        onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Taluk</label>
                                    <input
                                        type="text"
                                        value={editFormData.taluk}
                                        onChange={(e) => setEditFormData({ ...editFormData, taluk: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                                    <input
                                        type="text"
                                        value={editFormData.place}
                                        onChange={(e) => setEditFormData({ ...editFormData, place: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        value={editFormData.pincode}
                                        onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gothram</label>
                                    <input
                                        type="text"
                                        value={editFormData.gothram}
                                        onChange={(e) => setEditFormData({ ...editFormData, gothram: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                                <textarea
                                    value={editFormData.fullAddress}
                                    onChange={(e) => setEditFormData({ ...editFormData, fullAddress: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    rows="3"
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
                                    Update Devotee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevoteesList;
