import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Save, User, Building2, Shield, Globe, Clock, CreditCard, Image, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useTranslation } from 'react-i18next';

const Settings = () => {
    const { t } = useTranslation();
    const [templeInfo, setTempleInfo] = useState({
        name: 'Sri Mahalakshmi Temple',
        email: 'contact@temple.com',
        phone: '+91 80 1234 5678',
        address: 'Karnataka',
        website: 'https://srimahalakshmitemple.org',
    });

    const [systemSettings, setSystemSettings] = useState({
        currency: 'INR',
        timezone: 'IST (UTC+5:30)',
        ritualHours: '06:00 AM - 08:00 PM',
        allowSameDayBooking: true,
        notifyDevotee: true,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                setTempleInfo({
                    name: data.templeName,
                    email: data.contactEmail,
                    phone: data.contactPhone,
                    address: data.address,
                    website: data.website || '',
                });
                setSystemSettings({
                    currency: data.currency,
                    timezone: data.timezone || 'IST (UTC+5:30)',
                    ritualHours: data.ritualHours,
                    allowSameDayBooking: data.allowSameDayBooking,
                    notifyDevotee: data.notifyDevotee,
                });
            } catch (error) {
                console.error('Failed to fetch settings', error);
                // toast.error('Failed to load settings');
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (section) => {
        try {
            const payload = {
                templeName: templeInfo.name,
                contactEmail: templeInfo.email,
                contactPhone: templeInfo.phone,
                address: templeInfo.address,
                website: templeInfo.website,
                currency: systemSettings.currency,
                ritualHours: systemSettings.ritualHours,
                allowSameDayBooking: systemSettings.allowSameDayBooking,
                notifyDevotee: systemSettings.notifyDevotee
            };
            await api.put('/settings', payload);
            toast.success(`${section} ${t('admin.settings.save_success', 'updated successfully!')}`);
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast.error('Failed to save settings');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 font-serif">{t('admin.settings.title')}</h2>
                    <p className="text-gray-500 mt-1">{t('admin.settings.subtitle')}</p>
                </div>
            </div>

            {/* Temple Profile */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-orange-600 mr-3" />
                        <h3 className="font-bold text-gray-800">{t('admin.settings.profile_title')}</h3>
                    </div>
                    <button
                        onClick={() => handleSave('Profile')}
                        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-colors shadow-sm"
                    >
                        <Save className="w-4 h-4 mr-2" /> {t('admin.settings.save')}
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.settings.temple_name')}</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            value={templeInfo.name}
                            onChange={(e) => setTempleInfo({ ...templeInfo, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.settings.contact_email')}</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            value={templeInfo.email}
                            onChange={(e) => setTempleInfo({ ...templeInfo, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.settings.contact_phone')}</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            value={templeInfo.phone}
                            onChange={(e) => setTempleInfo({ ...templeInfo, phone: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.settings.address')}</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            value={templeInfo.address}
                            onChange={(e) => setTempleInfo({ ...templeInfo, address: e.target.value })}
                        />
                    </div>
                </div>
            </section>

            {/* System Preferences */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <div className="flex items-center">
                        <Globe className="w-5 h-5 text-orange-600 mr-3" />
                        <h3 className="font-bold text-gray-800">{t('admin.settings.pref_title')}</h3>
                    </div>
                    <button
                        onClick={() => handleSave('Preferences')}
                        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-colors shadow-sm"
                    >
                        <Save className="w-4 h-4 mr-2" /> {t('admin.settings.save')}
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.settings.currency')}</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                value={systemSettings.currency}
                                onChange={(e) => setSystemSettings({ ...systemSettings, currency: e.target.value })}
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.settings.ritual_hours')}</label>
                            <div className="flex items-center px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
                                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-600 font-medium">{systemSettings.ritualHours}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-50">
                        <label className="flex items-center cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={systemSettings.allowSameDayBooking}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, allowSameDayBooking: e.target.checked })}
                                />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${systemSettings.allowSameDayBooking ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${systemSettings.allowSameDayBooking ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-bold text-gray-700">{t('admin.settings.allow_same_day')}</p>
                                <p className="text-xs text-gray-400">{t('admin.settings.allow_same_day_desc')}</p>
                            </div>
                        </label>

                        <label className="flex items-center cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={systemSettings.notifyDevotee}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, notifyDevotee: e.target.checked })}
                                />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${systemSettings.notifyDevotee ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${systemSettings.notifyDevotee ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-bold text-gray-700">{t('admin.settings.notify_devotee')}</p>
                                <p className="text-xs text-gray-400">{t('admin.settings.notify_devotee_desc')}</p>
                            </div>
                        </label>
                    </div>
                </div>
            </section>



            {/* Security */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-red-50/30">
                    <div className="flex items-center">
                        <Shield className="w-5 h-5 text-red-600 mr-3" />
                        <h3 className="font-bold text-gray-800">{t('admin.settings.security_title')}</h3>
                    </div>
                </div>
                <div className="p-6">
                    <button className="px-6 py-3 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors">
                        {t('admin.settings.change_password')}
                    </button>
                    <p className="mt-3 text-xs text-gray-400 flex items-center">
                        {t('admin.settings.account_managed')}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Settings;
