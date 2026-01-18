import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SearchBar = ({
    value,
    onChange,
    onSearch,
    isTracking
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(value);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white p-2 md:p-4 rounded-3xl shadow-2xl border border-orange-100 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 flex items-center px-4 w-full">
                    <Search className="text-orange-600 w-6 h-6 mr-3" />
                    <input
                        type="text"
                        placeholder={t('home.search_placeholder') || "Search for Seva or Mobile Number"}
                        className="w-full py-3 outline-none text-gray-700 font-medium placeholder:text-gray-400"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {isTracking && <Loader2 className="w-5 h-5 animate-spin text-orange-600 ml-2" />}
                </div>
                <button
                    type="submit"
                    className="w-full md:w-auto px-10 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 active:scale-95"
                >
                    {t('home.find_btn')}
                </button>
            </form>

            {/* Instructional Note */}
            <p className="mt-4 text-center text-gray-500 text-sm font-medium animate-pulse">
                ✨ Search for a Seva or enter your mobile number to book again using your previous details
            </p>
        </div>
    );
};

export default SearchBar;
