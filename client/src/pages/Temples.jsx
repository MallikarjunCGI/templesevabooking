import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, ArrowRight, Loader2, Building2, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

import { useTranslation } from 'react-i18next';

const Temples = () => {
    const { i18n, t } = useTranslation();
    const currentLang = i18n.language;
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const { data } = await api.get('/sevas');

                const uniqueTemplesMap = new Map();

                data.forEach(seva => {
                    const nameEn = seva.templeNameEn || seva.templeName;
                    const nameKn = seva.templeNameKn || seva.templeName;
                    const templeKey = nameEn;
                    if (!uniqueTemplesMap.has(templeKey)) {
                        uniqueTemplesMap.set(templeKey, {
                            id: seva._id,
                            nameEn,
                            nameKn,
                            locationEn: seva.locationEn || seva.location,
                            locationKn: seva.locationKn || seva.location,
                            image: seva.image,
                            sevaCount: 1
                        });
                    } else {
                        const temple = uniqueTemplesMap.get(templeKey);
                        temple.sevaCount += 1;
                    }
                });

                setTemples(Array.from(uniqueTemplesMap.values()));

            } catch (error) {
                console.error('Error fetching temples:', error);
                toast.error('Could not load temples');
            } finally {
                setLoading(false);
            }
        };

        fetchTemples();
    }, []);

    const handleTempleClick = (templeName) => {
        navigate('/sevas', { state: { search: templeName } });
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-10">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-bold mb-6 group transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    {t('common.back_home')}
                </Link>

                {/* Header */}
                <div className="mb-12 text-center">
                    <span className="inline-block p-3 rounded-full bg-orange-100 text-orange-600 mb-4">
                        <Building2 className="w-8 h-8" />
                    </span>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
                        {t('listing.title')}
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        {t('listing.subtitle')}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {temples.map((temple) => (
                            <div
                                key={temple.id}
                                onClick={() => handleTempleClick(currentLang === 'kn' ? temple.nameKn : temple.nameEn)}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={temple.image}
                                        alt={currentLang === 'kn' ? (temple.nameKn || temple.templeName || temple.title) : (temple.nameEn || temple.templeName || temple.title)}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />

                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-2xl font-bold mb-2 font-serif group-hover:text-orange-300 transition-colors">
                                            {currentLang === 'kn' ? (temple.nameKn || temple.templeName || temple.title) : (temple.nameEn || temple.templeName || temple.title)}
                                        </h3>
                                        <p className="flex items-center text-sm font-medium text-gray-200">
                                            <MapPin className="w-4 h-4 mr-1 text-orange-400" />
                                            {currentLang === 'kn' ? (temple.locationKn || temple.location) : (temple.locationEn || temple.location)}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 flex justify-between items-center bg-white hover:bg-orange-50 transition-colors">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-bold text-orange-600 text-lg">{temple.sevaCount}</span> Sevas Available
                                    </div>
                                    <button
                                        className="p-2 rounded-full bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Temples;
