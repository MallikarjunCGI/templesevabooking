import React from 'react';
import { Clock } from 'lucide-react';

const RASHIS = [
    "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
    "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
];

const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
    "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

import { useTranslation } from 'react-i18next';

const SankalpaForm = ({ formData, handleChange, isAuthenticated, selectedDate, setSelectedDate, errors = {} }) => {
    const { t } = useTranslation();
    const today = new Date().toISOString().split('T')[0];
    return (
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
            <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-orange-600 mr-2 rounded-full"></span>
                {t('sankalpa.title')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Selection */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t('seva_details.select_date', 'Select Date')}</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            min={today}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-10 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium bg-white shadow-sm"

                        />
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t('auth.name')} *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('auth.name')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium shadow-sm transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                        required
                    />
                </div>

                {/* Gothram */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('sankalpa.gothram')}</label>
                    <input
                        type="text"
                        name="gothram"
                        value={formData.gothram}
                        onChange={handleChange}
                        placeholder="e.g., Kashyapa"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"

                    />
                </div>

                {/* Rashi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('sankalpa.rashi')}</label>
                    <select
                        name="rashi"
                        value={formData.rashi}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-white"

                    >
                        <option value="">Select Rashi</option>
                        {RASHIS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                {/* Nakshatra */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('sankalpa.nakshatra')}</label>
                    <select
                        name="nakshatra"
                        value={formData.nakshatra}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-white"

                    >
                        <option value="">Select Nakshatra</option>
                        {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
                {/* Guest Info - Only if not authenticated */}
                {!isAuthenticated && (
                    <>
                        <div className="md:col-span-2 border-t border-orange-200 mt-4 pt-4">
                            <h4 className="text-sm font-bold text-orange-800 mb-3">Contact Information (for receipt)</h4>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                            <input
                                type="text"
                                name="guestName"
                                value={formData.guestName}
                                onChange={handleChange}
                                placeholder="Your Full Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"

                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="guestEmail"
                                value={formData.guestEmail}
                                onChange={handleChange}
                                placeholder="email@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"

                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                            <input
                                type="tel"
                                name="guestPhone"
                                value={formData.guestPhone}
                                onChange={handleChange}
                                placeholder="10-digit mobile number"
                                className={`w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500 ${errors.guestPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                required
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SankalpaForm;
