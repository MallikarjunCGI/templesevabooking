import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchBar = ({
    value,
    onChange,
    onSearch,
    isTracking,
    disabled = false
}) => {
    const { t } = useTranslation();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (disabled) return;
        onSearch(value);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white p-1.5 sm:p-3 rounded-[1.25rem] sm:rounded-3xl shadow-2xl shadow-orange-100/50 border border-orange-100 flex items-center gap-2 sm:gap-4 overflow-hidden">
                <div className="flex-1 flex items-center px-3 sm:px-4">
                    {/* <Search className="text-orange-600 w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 shrink-0" /> */}
                    <input
                        type="text"
                        placeholder={t('home.search_placeholder') || "Search with Mobile Number"}
                        className={`w-full py-2.5 sm:py-3 outline-none text-gray-700 text-sm sm:text-base font-bold placeholder:text-gray-400 bg-transparent ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                    />
                    {isTracking && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-orange-600 ml-2" />}
                </div>
                <button
                    type="submit"
                    className={`flex items-center justify-center font-black rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-orange-100 active:scale-95 shrink-0 h-11 w-11 sm:h-auto sm:w-auto sm:px-10 sm:py-4 ${disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                    disabled={disabled}
                >
                    <Search className="w-5 h-5 sm:hidden" />
                    <span className="hidden sm:block">
                        {t('home.find_btn')}
                    </span>
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
