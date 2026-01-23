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
        <div className="bg-orange-50 p-4 sm:p-6 rounded-2xl border border-orange-100">
            <h3 className="text-lg font-black text-orange-800 mb-5 flex items-center">
                <span className="w-1.5 h-6 bg-orange-600 mr-3 rounded-full shadow-sm shadow-orange-200"></span>
                {t('sankalpa.title')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* Date Selection */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('seva_details.select_date', 'Select Date')}</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            min={today}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none text-sm font-bold bg-white shadow-sm transition-all"
                        />
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('auth.name')} *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('auth.name')}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none text-sm font-bold shadow-sm transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}
                        required
                    />
                </div>

                {/* Gothram */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.gothram')}</label>
                    <input
                        type="text"
                        name="gothram"
                        value={formData.gothram}
                        onChange={handleChange}
                        placeholder="e.g., Kashyapa"
                        className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none text-sm font-bold shadow-sm transition-all"
                    />
                </div>

                {/* Rashi */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.rashi')}</label>
                    <select
                        name="rashi"
                        value={formData.rashi}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none text-sm font-bold bg-white shadow-sm transition-all cursor-pointer"
                    >
                        <option value="">Select Rashi</option>
                        {RASHIS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                {/* Nakshatra */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.nakshatra')}</label>
                    <select
                        name="nakshatra"
                        value={formData.nakshatra}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none text-sm font-bold bg-white shadow-sm transition-all cursor-pointer"
                    >
                        <option value="">Select Nakshatra</option>
                        {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>

                {/* Guest Info - Only if not authenticated */}
                {!isAuthenticated && (
                    <>
                        <div className="md:col-span-2 border-t border-orange-200 mt-6 pt-6">
                            <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-4">Contact Information (for receipt)</h4>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Your Name</label>
                            <input
                                type="text"
                                name="guestName"
                                value={formData.guestName}
                                onChange={handleChange}
                                placeholder="Your Full Name"
                                className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none text-sm font-bold shadow-sm transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Email Address</label>
                            <input
                                type="email"
                                name="guestEmail"
                                value={formData.guestEmail}
                                onChange={handleChange}
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none text-sm font-bold shadow-sm transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Mobile Number *</label>
                            <input
                                type="tel"
                                name="guestPhone"
                                value={formData.guestPhone}
                                onChange={handleChange}
                                placeholder="10-digit mobile number"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none text-sm font-bold shadow-sm transition-all ${errors.guestPhone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}
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
