
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import React, { useState } from 'react';

const SevaCard = ({ seva }) => {

    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const currentLang = i18n.language;
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('upi');

    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full active:scale-[0.98]">
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={seva.image || '/images/MainPhoto.jpeg'}
                    alt={currentLang === 'kn' ? (seva.titleKn || seva.titleEn || seva.title) : (seva.titleEn || seva.titleKn || seva.title)}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                    <span className="text-orange-600 text-xs font-black uppercase tracking-widest">{seva.category}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2 font-serif">
                        {currentLang === 'kn' ? (seva.titleKn || seva.titleEn || seva.title) : (seva.titleEn || seva.titleKn || seva.title)}
                    </h3>

                    <div className="flex items-center space-x-2 text-slate-500 mb-4">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {currentLang === 'kn' ? (seva.templeNameKn || seva.templeNameEn || seva.templeName || seva.temple) : (seva.templeNameEn || seva.templeNameKn || seva.templeName || seva.temple)} • {currentLang === 'kn' ? (seva.locationKn || seva.locationEn || seva.location || seva.place) : (seva.locationEn || seva.locationKn || seva.location || seva.place)}
                        </span>
                    </div>

                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 bg-gray-50 p-2 rounded-lg italic">
                    {currentLang === 'kn' ? (seva.descriptionKn || seva.descriptionEn || seva.description) : (seva.descriptionEn || seva.descriptionKn || seva.description)}
                </p>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                    <div className="flex items-center text-sm text-gray-900 font-black">
                        ₹{seva.price}
                    </div>

                    <button
                        onClick={() => {
                            if (!isAuthenticated) {
                                // Pass prefill if available from sessionStorage
                                let prefill = {};
                                try {
                                    const raw = sessionStorage.getItem('prefill_booking');
                                    if (raw) prefill = JSON.parse(raw);
                                } catch {}
                                navigate('/select-payment', { state: { selectedSevaId: seva._id, prefill } });
                            } else {
                                navigate(`/sevas/${seva._id}`, { state: { selectedSevaId: seva._id } });
                            }
                        }}
                        className="flex items-center text-orange-600 hover:text-orange-700 font-bold text-sm group/btn cursor-pointer bg-transparent border-none outline-none"
                    >
                        {t('seva_card.book_now')}
                        <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SevaCard;
