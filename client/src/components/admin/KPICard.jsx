import React from 'react';

import { useTranslation } from 'react-i18next';

const KPICard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            <div className="flex items-center text-sm">
                <span className={`font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                    {trend === 'up' ? '↑' : '↓'} {trendValue}%
                </span>
                <span className="text-gray-400 ml-2">{t('admin.dashboard.vs_last_month', 'vs last month')}</span>
            </div>
        </div>
    );
};

export default KPICard;
