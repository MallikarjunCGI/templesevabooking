import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Users, Check, Info } from 'lucide-react';

const PricingWidget = ({ basePrice, count, setCount, total, setTotal }) => {
    const { t } = useTranslation();

    useEffect(() => {
        setTotal(basePrice * count);
    }, [basePrice, count, setTotal]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('pricing.title')}</h3>

            {/* Individual Selection (Now the only option) */}
            <div className="flex flex-col space-y-3 mb-6">
                <div className="relative p-4 rounded-xl border-2 border-orange-500 bg-orange-50 text-left transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="ml-3">
                                <p className="font-bold text-gray-900">{t('pricing.individual')}</p>
                                <p className="text-xs text-gray-500">For single devotee</p>
                            </div>
                        </div>
                        <Check className="w-5 h-5 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Dynamic Content (Count Selection) */}
            <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
                    <span className="text-gray-700 font-medium text-sm">{t('pricing.count')}</span>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setCount(Math.max(1, count - 1))}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                        >
                            -
                        </button>
                        <span className="text-lg font-bold w-6 text-center">{count}</span>
                        <button
                            onClick={() => setCount(Math.min(10, count + 1))}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Total Display */}
            <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-end">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">{t('seva_details.total_amount')}</p>
                    <p className="text-3xl font-bold text-gray-900">₹{total}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">₹{basePrice} x {count}</p>
                </div>
            </div>
        </div>
    );
};

export default PricingWidget;
