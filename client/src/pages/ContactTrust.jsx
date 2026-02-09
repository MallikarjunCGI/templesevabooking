import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactTrust = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-orange-100 p-8 sm:p-10 text-center">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Phone className="w-8 h-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 font-serif">
                    {t('contact_trust.title', 'Seva Booking')}
                </h1>
                <p className="text-gray-700 text-lg font-medium leading-relaxed mb-6">
                    {t('contact_trust.message', 'Please contact Temple Booking counter for any Seva Booking.')}
                </p>
                <p className="text-sm text-gray-500 mb-8">
                    {t('contact_trust.subtext', 'Visit the temple office or call the 9019664308 to book your seva.')}
                </p>
                <Link
                    to="/sevas"
                    className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('contact_trust.back_to_sevas', 'Back to View Seva')}
                </Link>
            </div>
        </div>
    );
};

export default ContactTrust;
