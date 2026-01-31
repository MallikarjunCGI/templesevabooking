import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, MapPin } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

import { useTranslation } from 'react-i18next';

const SevaManagement = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const [sevas, setSevas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSeva, setCurrentSeva] = useState(null); // null = add mode, object = edit mode

    const [formData, setFormData] = useState({
        titleEn: '',
        titleKn: '',
        templeNameEn: '',
        templeNameKn: '',
        locationEn: '',
        locationKn: '',
        descriptionEn: '',
        descriptionKn: '',
        price: '',
        image: '',
        category: 'Pooja'
    });

    useEffect(() => {
        fetchSevas();
    }, []);

    const fetchSevas = async () => {
        try {
            const { data } = await api.get('/sevas');
            setSevas(data);
        } catch (error) {
            console.error(error);
            toast.error(t('admin.management.op_failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin.management.confirm_delete'))) {
            try {
                await api.delete(`/sevas/${id}`);
                setSevas(sevas.filter(seva => seva._id !== id));
                toast.success(t('admin.management.deleted_success'));
            } catch (error) {
                toast.error(t('admin.management.op_failed'));
            }
        }
    }

    const openModal = (seva = null) => {
        if (seva) {
            setCurrentSeva(seva);
            setFormData({
                titleEn: seva.titleEn || seva.title || '',
                titleKn: seva.titleKn || '',
                templeNameEn: seva.templeNameEn || seva.templeName || 'Shree Kshetra Ramteertha',
                templeNameKn: seva.templeNameKn || 'ಶ್ರೀ ಕ್ಷೇತ್ರ ರಾಮತೀರ್ಥ',
                locationEn: seva.locationEn || seva.location || 'Karnataka',
                locationKn: seva.locationKn || 'ಕರ್ನಾಟಕ',
                descriptionEn: seva.descriptionEn || seva.description || '',
                descriptionKn: seva.descriptionKn || '',
                price: seva.price,
                image: seva.image,
                category: seva.category
            });
        } else {
            setCurrentSeva(null);
            setFormData({
                titleEn: '',
                titleKn: '',
                templeNameEn: 'Sri Mahalakshmi Temple',
                templeNameKn: 'ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮಿ ದೇವಸ್ಥಾನ',
                locationEn: 'Karnataka',
                locationKn: 'ಕರ್ನಾಟಕ',
                descriptionEn: '',
                descriptionKn: '',
                price: '',
                image: '',
                category: 'Pooja'
            });
        }
        setIsModalOpen(true);
    };

    const handleAutoTranslate = async (fieldName, text) => {
        if (!text) return;
        try {
            // Using our api utility to correctly hit the backend
            const { data } = await api.get(`/translate?text=${encodeURIComponent(text)}`);
            if (data.translation) {
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: data.translation
                }));
                toast.success(t('admin.management.translated_success', 'Translated successfully'));
            }
        } catch (error) {
            console.error('Translation error:', error);
            toast.error(t('admin.management.translation_failed', 'Translation failed'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentSeva) {
                // Edit Mode
                await api.put(`/sevas/${currentSeva._id}`, formData);
                toast.success(t('admin.management.updated_success'));
            } else {
                // Add Mode
                await api.post('/sevas', formData);
                toast.success(t('admin.management.created_success'));
            }
            setIsModalOpen(false);
            fetchSevas();
        } catch (error) {
            console.error(error);
            toast.error(t('admin.management.op_failed'));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            </div>
        );
    }


    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 font-serif">{t('admin.management.title')}</h2>
                    <p className="text-gray-500 mt-1">{t('admin.management.subtitle')}</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    {t('admin.management.new_offering')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sevas.map((seva) => (
                    <div key={seva._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={seva.image || '/images/seva-aarti.jpg'}
                                alt={currentLang === 'kn' ? (seva.titleKn || seva.title) : (seva.titleEn || seva.title)}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                {seva.category}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight group-hover:text-orange-600 transition-colors">
                                    {currentLang === 'kn' ? (seva.titleKn || seva.titleEn || seva.title) : (seva.titleEn || seva.titleKn || seva.title)}
                                </h3>
                                <div className="flex items-center space-x-1 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                                    <MapPin className="w-3 h-3 text-orange-400" />
                                    <span>{currentLang === 'kn' ? (seva.templeNameKn || seva.templeNameEn || seva.templeName || seva.temple) : (seva.templeNameEn || seva.templeNameKn || seva.templeName || seva.temple)} • {currentLang === 'kn' ? (seva.locationKn || seva.locationEn || seva.location || seva.place) : (seva.locationEn || seva.locationKn || seva.location || seva.place)}</span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                    {currentLang === 'kn' ? (seva.descriptionKn || seva.descriptionEn || seva.description) : (seva.descriptionEn || seva.descriptionKn || seva.description)}
                                </p>
                                <div className="text-3xl font-black text-gray-900 mb-4">
                                    <span className="text-lg font-medium text-gray-400 mr-1">₹</span>
                                    {seva.price}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 pt-6 border-t border-gray-50">
                                <button
                                    onClick={() => openModal(seva)}
                                    className="flex-1 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl flex items-center justify-center transition-all"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" /> {t('admin.management.edit')}
                                </button>
                                <button
                                    onClick={() => handleDelete(seva._id)}
                                    className="p-2.5 text-red-500 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {currentSeva ? t('admin.management.edit_title') : t('admin.management.add_title')}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            {/* Title Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-sm font-bold text-gray-700">{t('admin.management.field_title')}</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate('titleKn', formData.titleEn)}
                                            className="text-[10px] font-bold text-orange-600 hover:text-orange-700 underline"
                                        >
                                            {t('admin.management.auto_translate')}
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        value={formData.titleEn}
                                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('admin.management.field_title_kn')}</label>
                                    <input
                                        type="text"
                                        required
                                        dir="ltr"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-kannada"
                                        value={formData.titleKn}
                                        onChange={(e) => setFormData({ ...formData, titleKn: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Temple & Location Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-sm font-bold text-gray-700">{t('admin.management.field_temple')}</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate('templeNameKn', formData.templeNameEn)}
                                            className="text-[10px] font-bold text-orange-600 hover:text-orange-700 underline"
                                        >
                                            {t('admin.management.auto_translate')}
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        value={formData.templeNameEn}
                                        onChange={(e) => setFormData({ ...formData, templeNameEn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('admin.management.field_temple_kn')}</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-kannada"
                                        value={formData.templeNameKn}
                                        onChange={(e) => setFormData({ ...formData, templeNameKn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-sm font-bold text-gray-700">{t('admin.management.field_location')}</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate('locationKn', formData.locationEn)}
                                            className="text-[10px] font-bold text-orange-600 hover:text-orange-700 underline"
                                        >
                                            {t('admin.management.auto_translate')}
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        value={formData.locationEn}
                                        onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('admin.management.field_location_kn')}</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-kannada"
                                        value={formData.locationKn}
                                        onChange={(e) => setFormData({ ...formData, locationKn: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Price & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('admin.management.field_price')} (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('admin.management.field_category')}</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Pooja">{t('common.pooja', 'Pooja')}</option>
                                        <option value="Seva">{t('common.seva', 'Seva')}</option>
                                        <option value="Donations">{t('common.donations', 'Donations')}</option>
                                        <option value="Abhisheka">{t('common.abhisheka', 'Abhisheka')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{t('admin.management.field_image')}</label>
                                <input
                                    type="text"
                                    placeholder="/images/main2.png"
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>

                            {/* Description Section */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-sm font-bold text-gray-700">{t('admin.management.field_desc')}</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate('descriptionKn', formData.descriptionEn)}
                                            className="text-[10px] font-bold text-orange-600 hover:text-orange-700 underline"
                                        >
                                            {t('admin.management.auto_translate')}
                                        </button>
                                    </div>
                                    <textarea
                                        rows="3"
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        value={formData.descriptionEn}
                                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('admin.management.field_desc_kn')}</label>
                                    <textarea
                                        rows="3"
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-kannada"
                                        value={formData.descriptionKn}
                                        onChange={(e) => setFormData({ ...formData, descriptionKn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 sticky bottom-0 bg-white">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 text-gray-600 font-bold bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    {t('admin.management.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all active:scale-95"
                                >
                                    {currentSeva ? t('admin.management.update') : t('admin.management.create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SevaManagement;
