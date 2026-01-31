import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin,
    Phone,
    Mail,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    ExternalLink
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

import { useSelector } from 'react-redux';

const Footer = () => {
    const { t, i18n } = useTranslation();
    const [settings, setSettings] = useState(null);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch footer settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: t('nav.home'), path: "/" },
        { name: t('nav.book_seva'), path: "/sevas" },
        { name: t('footer.privacy_policy'), path: "#" },
        { name: t('footer.terms_service'), path: "#" }
    ];

    // Add My Bookings for logged-in admin and user roles
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'user')) {
        quickLinks.splice(2, 0, { name: t('nav.my_bookings'), path: "/bookings" });
    }

    return (
        <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

                    {/* Temple Identity */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center group">
                            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900 group-hover:rotate-12 transition-transform duration-300">
                                <span className="text-white font-black text-xl">ॐ</span>
                            </div>
                            <span className="ml-3 text-xl font-black text-white tracking-tighter font-serif">
                                {t('nav.temple_name_prefix')} <span className="text-orange-500">{t('nav.temple_name_suffix')}</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
                            {t('home.grace_desc')}
                        </p>
                        <div className="flex space-x-3">
                            {[
                                { Icon: Facebook, href: "#", color: "hover:text-blue-500" },
                                { Icon: Instagram, href: "#", color: "hover:text-pink-500" },
                                { Icon: Twitter, href: "#", color: "hover:text-blue-400" },
                                { Icon: Youtube, href: "#", color: "hover:text-red-500" }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-all ${social.color} hover:bg-gray-700`}
                                >
                                    <social.Icon className="w-4.5 h-4.5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-lg">{t('footer.quick_links')}</h4>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.path}
                                        className="text-sm hover:text-orange-500 transition-colors flex items-center group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2.5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 lg:col-span-2">
                        <h4 className="text-white font-bold text-lg">{t('footer.contact_us')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-gray-800 rounded text-orange-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('footer.about_temple')}</p>
                                    <p className="text-sm text-gray-300 leading-snug">
                                        {settings?.address || "Address loading..."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-gray-800 rounded text-green-500">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Phone</p>
                                    <p className="text-sm text-gray-300">
                                        {settings?.contactPhone || "+91 XXXXXXXXXX"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-gray-800 rounded text-blue-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email</p>
                                    <p className="text-sm text-gray-300 truncate max-w-[180px]">
                                        {settings?.contactEmail || "contact@temple.com"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-gray-800 rounded text-purple-500">
                                    <ExternalLink className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Website</p>
                                    <p className="text-sm text-gray-300">
                                        {settings?.website || "www.temple.com"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                    <p className="text-xs text-gray-500">
                        © {currentYear} {settings?.templeName || "Temple"}. {t('footer.all_rights_reserved')}.
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>Built with</span>
                        <span className="text-orange-600">❤</span>
                        <span>for devotees</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
