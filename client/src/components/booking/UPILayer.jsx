import React from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { X, ShieldCheck, ArrowRight, CreditCard } from 'lucide-react';

const UPILayer = ({ isOpen, onClose, onConfirm, amount, upiId, templeName, sevaName }) => {
    const [showUTR, setShowUTR] = React.useState(false);
    const [utr, setUTR] = React.useState('');
    const [utrError, setUTRError] = React.useState('');
    const isAuthenticated = !!localStorage.getItem('token');
    React.useEffect(() => {
        if (isOpen) {
            document.body.classList.add('hide-navbar');
        } else {
            document.body.classList.remove('hide-navbar');
        }
        return () => document.body.classList.remove('hide-navbar');
    }, [isOpen]);

    const { t } = useTranslation();
    if (!isOpen) return null;

    // UPI Deep Link Format: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&tn=NOTE&cu=CURRENCY
    const encodedTempleName = encodeURIComponent(templeName || t('admin.management.field_temple') || 'Temple');
    const encodedSevaName = encodeURIComponent(sevaName || t('bookings.receipt_header') || 'Seva Booking');    
    //const upiLink = `upi://pay?pa=${upiId}&pn=${encodedTempleName}&am=${amount}&tn=${encodedSevaName}&cu=INR`;
const transactionRef = `TXN${Date.now()}`;
const orderId = `ORD${Date.now()}`;

const upiLink = `upi://pay?pa=${upiId}&pn=${encodedTempleName}&am=${amount}&tn=${encodedSevaName}&cu=INR&tr=${transactionRef}&tid=${orderId}&mc=0000`;


    // Only for public (not logged in) users
    const showUPILink = !isAuthenticated;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-[340px] sm:max-w-[400px] overflow-hidden shadow-2xl border border-orange-100 flex flex-col animate-in zoom-in-95 duration-300 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-5 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-orange-600 transition-all z-20"
                >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Header */}
                <div className="p-5 pt-6 sm:p-8 sm:pt-8 text-center">
                    <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-orange-50 text-orange-600 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2 sm:mb-3">
                        <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        {t('upi.title')}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-0.5 leading-tight">{t('upi.scan_to_pay')}</h2>
                    <p className="text-gray-500 text-[10px] sm:text-xs font-medium italic">{t('upi.simple_secure')}</p>
                </div>

                {/* QR Code Container - Responsive Size */}
                <div className="px-5 pb-4 sm:px-10 sm:pb-6 flex flex-col items-center">
                    <div className="p-3 sm:p-6 bg-white rounded-3xl sm:rounded-[2.5rem] shadow-inner border-2 border-orange-50 relative group">
                        <div className="absolute inset-0 bg-orange-600/5 rounded-3xl scale-110 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="hidden sm:block">
                            <QRCodeSVG
                                value={upiLink}
                                size={180}
                                level="H"
                                includeMargin={false}
                            />
                        </div>
                        <div className="block sm:hidden">
                            <QRCodeSVG
                                value={upiLink}
                                size={120}
                                level="H"
                                includeMargin={false}
                            />
                        </div>
                    </div>

                    {/* UPI Payment Link for public users */}
                    {showUPILink && (
                        <div className="mt-4 text-center">
                            <a
                                href={upiLink}
                                className="inline-block px-4 py-2 mt-2 bg-orange-100 text-orange-700 font-bold rounded-lg border border-orange-200 hover:bg-orange-200 transition-all text-sm"
                                style={{ wordBreak: 'break-all' }}
                            >
                                {t('upi.pay_with_app', 'Pay with UPI App (PhonePe, GPay, etc.)')}
                            </a>
                            <div className="text-[10px] text-gray-400 mt-1">{upiLink}</div>
                        </div>
                    )}

                    <div className="mt-4 sm:mt-6 text-center space-y-0.5 sm:space-y-1">
                        <p className="text-2xl sm:text-3xl font-black text-orange-600">₹{amount}</p>
                        <p className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest leading-none line-clamp-1">{sevaName}</p>
                    </div>
                </div>

                {/* Instructions & Actions */}
                <div className="p-5 sm:p-8 bg-gray-50 border-t border-gray-100">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col items-center bg-blue-50/50 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-blue-100/50 text-center">
                            <ShieldCheck className="w-5 h-5 sm:w-6 sm:size-6 text-blue-600 mb-2" />
                            <div>
                                <p className="text-[10px] sm:text-sm font-black text-blue-900 uppercase tracking-wide">{t('upi.scan_pay_confirm')}</p>
                                <p className="text-[9px] sm:text-xs text-blue-700/80 font-medium leading-tight mt-1">{t('upi.pay_exactly', { amount })}</p>
                            </div>
                        </div>

                        {isAuthenticated ? (
                            <button
                                onClick={() => onConfirm()}
                                className="w-full py-4 sm:py-5 bg-gray-900 text-white rounded-xl sm:rounded-2xl text-base sm:text-xl font-black flex items-center justify-center hover:bg-orange-600 transition-all shadow-xl active:scale-[0.98] group"
                            >
                                {t('upi.confirm_payment')}
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            !showUTR ? (
                                <button
                                    onClick={() => setShowUTR(true)}
                                    className="w-full py-4 sm:py-5 bg-gray-900 text-white rounded-xl sm:rounded-2xl text-base sm:text-xl font-black flex items-center justify-center hover:bg-orange-600 transition-all shadow-xl active:scale-[0.98] group"
                                >
                                    {t('upi.confirm_payment')}
                                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        value={utr}
                                        onChange={e => {
                                            setUTR(e.target.value.replace(/\D/g, ''));
                                            setUTRError('');
                                        }}
                                        placeholder="Enter UTR Number"
                                        maxLength={16}
                                        minLength={12}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm font-bold bg-white"
                                    />
                                    {utrError && <p className="text-xs text-red-600">{utrError}</p>}
                                    <button
                                        onClick={() => {
                                            if (!utr || utr.length < 12 || utr.length > 16) {
                                                setUTRError('UTR must be 12-16 digits');
                                                return;
                                            }
                                            setUTRError('');
                                            onConfirm(utr);
                                        }}
                                        className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold mt-1"
                                    >
                                        Confirm & Book
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Secure footer */}
                <div className="p-3 bg-white text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center">
                        <ShieldCheck className="w-3 h-3 mr-1 text-green-500" />
                        {t('upi.secure_transaction')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UPILayer;
