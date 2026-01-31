import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Save, User, Building2, Shield, Globe, Clock, CreditCard, Image, Plus, Trash2, Lock, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Settings = () => {
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const [templeInfo, setTempleInfo] = useState({
        name: 'Shree Kshetra Ramtirtha',
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
        upiId: '',
    });

    const [ownPassword, setOwnPassword] = useState({ current: '', new: '', confirm: '' });
    const [changingOwn, setChangingOwn] = useState(false);
    const [users, setUsers] = useState([]);
    const [userPassword, setUserPassword] = useState({}); // userId -> { new, confirm }
    const [changingUser, setChangingUser] = useState(null);

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
                    upiId: data.upiId || '',
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
                timezone: systemSettings.timezone,
                ritualHours: systemSettings.ritualHours,
                allowSameDayBooking: systemSettings.allowSameDayBooking,
                notifyDevotee: systemSettings.notifyDevotee,
                upiId: systemSettings.upiId
            };
            await api.put('/settings', payload);
            toast.success(`${section} ${t('admin.settings.save_success', 'updated successfully!')}`);
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast.error('Failed to save settings');
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/auth/users');
            setUsers(data);
        } catch (e) {
            console.error('Failed to fetch users', e);
            toast.error('Failed to load users');
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') fetchUsers();
    }, [user?.role]);

    const handleChangeOwnPassword = async (e) => {
        e.preventDefault();
        if (ownPassword.new !== ownPassword.confirm) {
            toast.error(t('admin.settings.password_mismatch', 'New passwords do not match'));
            return;
        }
        if (ownPassword.new.length < 6) {
            toast.error(t('admin.settings.password_min', 'Password must be at least 6 characters'));
            return;
        }
        setChangingOwn(true);
        try {
            await api.put('/auth/change-password', {
                currentPassword: ownPassword.current,
                newPassword: ownPassword.new,
            });
            toast.success(t('admin.settings.password_updated', 'Password updated successfully'));
            setOwnPassword({ current: '', new: '', confirm: '' });
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to update password';
            toast.error(msg);
        } finally {
            setChangingOwn(false);
        }
    };

    const handleSetUserPassword = async (userId) => {
        const p = userPassword[userId];
        if (!p || p.new !== p.confirm) {
            toast.error(t('admin.settings.password_mismatch', 'Passwords do not match'));
            return;
        }
        if (p.new.length < 6) {
            toast.error(t('admin.settings.password_min', 'Password must be at least 6 characters'));
            return;
        }
        setChangingUser(userId);
        try {
            await api.put(`/auth/users/${userId}/password`, { newPassword: p.new });
            toast.success(t('admin.settings.password_updated', 'Password updated successfully'));
            setUserPassword((prev) => ({ ...prev, [userId]: {} }));
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to update password';
            toast.error(msg);
        } finally {
            setChangingUser(null);
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
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">UPI ID (VPA)</label>
                            <div className="flex items-center px-4 py-3 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
                                <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    className="w-full outline-none bg-transparent"
                                    placeholder="e.g. temple@upi"
                                    value={systemSettings.upiId}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, upiId: e.target.value })}
                                />
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

            {/* Security – Change password */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-red-50/30">
                    <div className="flex items-center">
                        <Shield className="w-5 h-5 text-red-600 mr-3" />
                        <h3 className="font-bold text-gray-800">{t('admin.settings.security_title')}</h3>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <form onSubmit={handleChangeOwnPassword} className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            {t('admin.settings.change_own_password', 'Change your password')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">{t('admin.settings.current_password', 'Current password')}</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={ownPassword.current}
                                    onChange={(e) => setOwnPassword((p) => ({ ...p, current: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">{t('admin.settings.new_password', 'New password')}</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={ownPassword.new}
                                    onChange={(e) => setOwnPassword((p) => ({ ...p, new: e.target.value }))}
                                    minLength={6}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">{t('admin.settings.confirm_password', 'Confirm new password')}</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={ownPassword.confirm}
                                    onChange={(e) => setOwnPassword((p) => ({ ...p, confirm: e.target.value }))}
                                    minLength={6}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={changingOwn}
                            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
                        >
                            {changingOwn && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {t('admin.settings.change_password')}
                        </button>
                    </form>

                    {user?.role === 'admin' && users.length > 0 && (
                        <div className="pt-6 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {t('admin.settings.set_user_passwords', 'Set passwords for Admin & User accounts')}
                            </h4>
                            <div className="space-y-4">
                                {users.map((u) => (
                                    <div key={u._id} className="flex flex-wrap items-end gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="min-w-[140px]">
                                            <p className="text-xs text-gray-500 uppercase font-bold">{u.name}</p>
                                            <p className="text-sm text-gray-700">{u.email} <span className="text-orange-600 font-bold">({u.role})</span></p>
                                        </div>
                                        <div className="flex-1 flex flex-wrap gap-2 items-end">
                                            <input
                                                type="password"
                                                placeholder={t('admin.settings.new_password', 'New password')}
                                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm w-40"
                                                value={userPassword[u._id]?.new || ''}
                                                onChange={(e) => setUserPassword((prev) => ({
                                                    ...prev,
                                                    [u._id]: { ...prev[u._id], new: e.target.value }
                                                }))}
                                            />
                                            <input
                                                type="password"
                                                placeholder={t('admin.settings.confirm_password', 'Confirm')}
                                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm w-40"
                                                value={userPassword[u._id]?.confirm || ''}
                                                onChange={(e) => setUserPassword((prev) => ({
                                                    ...prev,
                                                    [u._id]: { ...prev[u._id], confirm: e.target.value }
                                                }))}
                                            />
                                            <button
                                                type="button"
                                                disabled={changingUser === u._id}
                                                onClick={() => handleSetUserPassword(u._id)}
                                                className="px-4 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center"
                                            >
                                                {changingUser === u._id && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                                                {t('admin.settings.set_password', 'Set password')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Settings;
