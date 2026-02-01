import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PaymentTypeSelect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const sevaId = location.state?.selectedSevaId;
    const prefill = location.state?.prefill || {};

    const handleSelect = (type) => {
        if (type === 'cash') {
            navigate('/contact-trust');
        } else {
            navigate(`/sevas/${sevaId}`, { state: { selectedSevaId: sevaId, paymentType: 'upi', ...prefill } });
        }
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-orange-100 p-8 sm:p-10 text-center">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 font-serif">
                    {t('seva_card.select_payment_type', 'Select Payment Type')}
                </h1>
                <div className="flex flex-col gap-6 mb-8">
                    <button
                        className="w-full py-4 rounded-xl font-bold text-lg bg-orange-600 text-white hover:bg-orange-700"
                        onClick={() => handleSelect('upi')}
                    >
                        {t('seva_card.pay_upi', 'Pay with UPI')}
                    </button>
                    <button
                        className="w-full py-4 rounded-xl font-bold text-lg bg-gray-200 text-gray-700 hover:bg-orange-100"
                        onClick={() => handleSelect('cash')}
                    >
                        {t('seva_card.pay_cash', 'Pay with Cash')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentTypeSelect;
