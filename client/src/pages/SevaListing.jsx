import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Filter, ArrowLeft, Loader2, IndianRupee } from 'lucide-react';
import api from '../utils/api';
import SevaCard from '../components/booking/SevaCard';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const SevaListing = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [sevas, setSevas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(location.state?.search || "");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetchSevas();
    }, []);

    const fetchSevas = async () => {
        try {
            const { data } = await api.get('/sevas');
            setSevas(data);
        } catch (error) {
            console.error(error);
            toast.error('Could not fetch offerings');
        } finally {
            setLoading(false);
        }
    };

    const categories = ["All", "Pooja", "Abhisheka", "Donations", "Special"];

    const filteredSevas = sevas.filter(seva => {
        const title = (i18n.language === 'kn') ? (seva.titleKn || seva.titleEn || seva.title) : (seva.titleEn || seva.titleKn || seva.title);
        const temple = (i18n.language === 'kn') ? (seva.templeNameKn || seva.templeNameEn || seva.templeName || seva.temple) : (seva.templeNameEn || seva.templeNameKn || seva.templeName || seva.temple);
        const locationStr = (i18n.language === 'kn') ? (seva.locationKn || seva.locationEn || seva.location || seva.place) : (seva.locationEn || seva.locationKn || seva.location || seva.place);
        const category = seva.category || "";

        const matchesSearch = (title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (temple?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (locationStr?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (category.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === "All" || seva.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">{t('common.loading')}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-orange-100 pt-6 md:pt-10 pb-12 md:pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <Link to="/" className="inline-flex items-center text-orange-600 font-bold mb-6 md:mb-8 hover:translate-x-1 transition-transform text-sm sm:text-base">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back_home')}
                    </Link>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight drop-shadow-sm">
                        {t('listing.title')}
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg max-w-2xl font-medium opacity-80 leading-relaxed">
                        {t('listing.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-10">
                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-50 mb-12 flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                        <input
                            type="text"
                            placeholder={t('home.search_placeholder1')}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex overflow-x-auto pb-2 lg:pb-0 gap-2 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                                    : 'bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Listing Grid */}
                {filteredSevas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSevas.map(seva => (
                            <SevaCard key={seva._id} seva={seva} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Filter className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('listing.no_sevas')}</h3>
                        <p className="text-gray-400">Try adjusting your filters or search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SevaListing;
