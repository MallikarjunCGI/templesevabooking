import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Save, Image, Plus, Trash2, Edit2, X, Loader2, Link as LinkIcon, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const HeroManagement = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const [heroSlides, setHeroSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(null); // null = add, object = edit

    const [formData, setFormData] = useState({
        image: '',
        titleEn: '',
        titleKn: '',
        subtitleEn: '',
        subtitleKn: '',
        locationEn: '',
        locationKn: '',
        order: 0
    });

    useEffect(() => {
        fetchHeroSlides();
    }, []);

    const fetchHeroSlides = async () => {
        try {
            const { data } = await api.get('/hero');
            setHeroSlides(data);
        } catch (error) {
            console.error('Failed to fetch hero slides', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (slide = null) => {
        if (slide) {
            setCurrentSlide(slide);
            setFormData({
                image: slide.image,
                titleEn: slide.titleEn || slide.title || '',
                titleKn: slide.titleKn || '',
                subtitleEn: slide.subtitleEn || slide.subtitle || '',
                subtitleKn: slide.subtitleKn || '',
                locationEn: slide.locationEn || slide.location || '',
                locationKn: slide.locationKn || '',
                order: slide.order || 0
            });
        } else {
            setCurrentSlide(null);
            setFormData({
                image: '',
                titleEn: '',
                titleKn: '',
                subtitleEn: '',
                subtitleKn: '',
                locationEn: '',
                locationKn: '',
                order: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleAutoTranslate = async (fieldName, text) => {
        if (!text) return;
        try {
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

    // File upload state & handlers
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const uploadSelectedFile = async () => {
        if (!selectedFile) {
            toast.error('No file selected');
            return;
        }
        const fd = new FormData();
        fd.append('image', selectedFile);
        try {
            const { data } = await api.post('/uploads/hero', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (data && data.url) {
                setFormData(prev => ({ ...prev, image: data.url }));
                toast.success('Image uploaded');
                setSelectedFile(null);
            }
        } catch (e) {
            console.error('Upload failed', e);
            toast.error('Upload failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this slide?')) {
            try {
                await api.delete(`/hero/${id}`);
                setHeroSlides(heroSlides.filter(slide => slide._id !== id));
                toast.success('Slide removed successfully');
            } catch (error) {
                toast.error('Failed to delete slide');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (currentSlide) {
                // Update
                const { data } = await api.put(`/hero/${currentSlide._id}`, formData);
                setHeroSlides(heroSlides.map(s => s._id === data._id ? data : s));
                toast.success('Slide updated');
            } else {
                // Create
                const { data } = await api.post('/hero', formData);
                setHeroSlides([...heroSlides, data]);
                toast.success('New slide added');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Save failed', error);
            toast.error('Failed to save changes');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 font-serif">{t('admin.hero.title')}</h2>
                    <p className="text-gray-500 mt-1">{t('admin.hero.subtitle')}</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Slide
                </button>
            </div>

            {heroSlides.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-20 text-center">
                    <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Image className="w-10 h-10 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Slides Found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        The homepage carousel is currently empty. Add slides to showcase your temple and its sacred rituals.
                    </p>
                    <button
                        onClick={() => openModal()}
                        className="px-6 py-3 border-2 border-orange-600 text-orange-600 font-bold rounded-xl hover:bg-orange-600 hover:text-white transition-all"
                    >
                        Create First Slide
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {heroSlides.map((slide) => (
                        <div key={slide._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                            {/* Preview Area */}
                            <div className="relative aspect-[21/9] bg-gray-100 overflow-hidden">
                                <img
                                    src={slide.image}
                                    alt={currentLang === 'kn' ? (slide.titleKn || slide.title) : (slide.titleEn || slide.title)}
                                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x600?text=Invalid+Image+URL' }}
                                />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center">
                                    <MapPin className="w-3 h-3 mr-1 text-orange-400" />
                                    {currentLang === 'kn' ? (slide.locationKn || slide.location) : (slide.locationEn || slide.location)}
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                    {currentLang === 'kn' ? (slide.titleKn || slide.title) : (slide.titleEn || slide.title)}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 flex-1">
                                    {currentLang === 'kn' ? (slide.subtitleKn || slide.subtitle) : (slide.subtitleEn || slide.subtitle)}
                                </p>

                                {/* Actions */}
                                <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-gray-50">
                                    <button
                                        onClick={() => openModal(slide)}
                                        className="flex-1 py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center transition-all"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(slide._id)}
                                        className="p-3 text-red-500 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                        title="Delete Slide"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Slide Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        {/* Modal Header - Fixed at Top */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-orange-50/30 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 font-serif">
                                    {currentSlide ? 'Edit Slide' : 'Add Slide'}
                                </h3>
                                <p className="text-gray-500 text-xs">Configure homepage banner details</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Title (EN)</label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate('titleKn', formData.titleEn)}
                                                className="text-[10px] font-bold text-orange-600 hover:text-orange-700 underline"
                                            >
                                                Auto-Translate
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="e.g. Sacred Rituals"
                                            value={formData.titleEn}
                                            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Title (KN)</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-kannada"
                                            value={formData.titleKn}
                                            onChange={(e) => setFormData({ ...formData, titleKn: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Location (EN)</label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate('locationKn', formData.locationEn)}
                                                className="text-[10px] font-bold text-orange-600 hover:text-orange-700 underline"
                                            >
                                                Auto-Translate
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="e.g. Main Sanctum"
                                            value={formData.locationEn}
                                            onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Location (KN)</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-kannada"
                                            value={formData.locationKn}
                                            onChange={(e) => setFormData({ ...formData, locationKn: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Subtitle (EN)</label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate('subtitleKn', formData.subtitleEn)}
                                                className="text-[10px] font-bold text-orange-600 hover:text-orange-700 underline"
                                            >
                                                Auto-Translate
                                            </button>
                                        </div>
                                        <textarea
                                            required
                                            rows="1"
                                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="Enter subtext in English"
                                            value={formData.subtitleEn}
                                            onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Subtitle (KN)</label>
                                        <textarea
                                            required
                                            rows="1"
                                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-kannada"
                                            placeholder="ಕನ್ನಡದಲ್ಲಿ ಉಪಶೀರ್ಷಿಕೆ"
                                            value={formData.subtitleKn}
                                            onChange={(e) => setFormData({ ...formData, subtitleKn: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Image URL</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="Paste image URL here..."
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        />
                                    </div>
                                    <div className="mt-2 flex items-center gap-3">
                                        <input type="file" accept="image/*" id="heroFile" onChange={(e) => handleFileSelect(e)} className="hidden" />
                                        <label htmlFor="heroFile" className="px-3 py-2 bg-white border rounded-lg cursor-pointer">Choose file</label>
                                        <button type="button" onClick={() => uploadSelectedFile()} className="px-3 py-2 bg-orange-600 text-white rounded-lg">Upload</button>
                                        <span className="text-sm text-gray-500">Or paste an external URL above</span>
                                    </div>
                                </div>

                                {/* Preview Section */}
                                {formData.image && (
                                    <div className="pt-2 border-t border-gray-50">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-4 block text-center">Live Preview (Mobile/Compact View)</label>
                                        <div className="max-w-md mx-auto">
                                            <div className="relative rounded-2xl overflow-hidden aspect-[21/9] border border-gray-200 shadow-lg group-hover:scale-[1.01] transition-transform">
                                                <img
                                                    src={formData.image}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover object-top"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL+Provided' }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                                                    <div className="text-white">
                                                        <p className="text-[8px] font-bold uppercase tracking-widest text-orange-400 mb-0.5">
                                                            {currentLang === 'kn' ? (formData.locationKn || 'ಸ್ಥಳ') : (formData.locationEn || 'Location')}
                                                        </p>
                                                        <h4 className="text-sm font-bold leading-tight">
                                                            {currentLang === 'kn' ? (formData.titleKn || 'ಶೀರ್ಷಿಕೆ') : (formData.titleEn || 'Slide Title')}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer - Fixed at Bottom */}
                            <div className="flex justify-end space-x-3 p-5 border-t border-gray-100 flex-shrink-0 bg-gray-50/50">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 text-gray-600 border border-gray-200 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {currentSlide ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroManagement;
