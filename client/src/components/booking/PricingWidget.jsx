import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Users, Check, Info } from 'lucide-react';

const PricingWidget = ({ basePrice, count, setCount, total, setTotal, allowCustomAmount = false }) => {
    const { t } = useTranslation();

    const [price, setPrice] = React.useState(basePrice || 0);

    useEffect(() => {
        setPrice(basePrice || 0);
    }, [basePrice]);

    useEffect(() => {
        const p = Number(price) || 0;
        setTotal(p * count);
    }, [price, count, setTotal]);

    return (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-orange-100">
            <h3 className="text-lg font-black text-gray-900 mb-5">{t('pricing.title')}</h3>

            {/* Individual Selection (Now the only option) */}
            <div className="flex flex-col space-y-3 mb-6">
                <div className="relative p-4 rounded-2xl border-2 border-orange-600 bg-orange-50/50 text-left transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-2 sm:p-2.5 rounded-xl bg-orange-600 text-white shadow-md shadow-orange-100">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <p className="font-black text-gray-900 leading-none mb-1">{t('pricing.individual')}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">For single devotee</p>
                            </div>
                        </div>
                        <Check className="w-5 h-5 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Dynamic Content (Count Selection) */}
            <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('pricing.count')}</span>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setCount(Math.max(1, count - 1))}
                            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm active:scale-90"
                        >
                            <span className="text-xl font-bold">-</span>
                        </button>
                        <span className="text-xl font-black w-6 text-center text-gray-900">{count}</span>
                        <button
                            onClick={() => setCount(Math.min(10, count + 1))}
                            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm active:scale-90"
                        >
                            <span className="text-xl font-bold">+</span>
                        </button>
                    </div>
                </div>
            </div>

            {allowCustomAmount && (
                <div className="mb-4">
                    <label className="text-sm text-gray-500 font-bold">Custom Amount (₹)</label>
                    <input
                        type="number"
                        min={0}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full mt-2 p-3 border border-gray-200 rounded-xl text-lg font-black"
                    />
                </div>
            )}

            {/* Total Display */}
            <div className="border-t border-dashed border-gray-200 pt-5 flex justify-between items-end">
                <div>
                    <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.2em] mb-1.5">{t('seva_details.total_amount')}</p>
                    <p className="text-4xl font-black text-gray-900">₹{total}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-black text-gray-400">₹{basePrice} × {count}</p>
                </div>
            </div>
        </div>
    );
};

export default PricingWidget;
