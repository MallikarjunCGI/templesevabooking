import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import SankalpaForm from '../components/booking/SankalpaForm';
import PricingWidget from '../components/booking/PricingWidget';
import api from '../utils/api';
import UPILayer from '../components/booking/UPILayer';

import { useTranslation } from 'react-i18next';

const SevaDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [seva, setSeva] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUPI, setShowUPI] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        gothram: '',
        rashi: '',
        nakshatra: '',
        guestName: '',
        guestEmail: '',
        guestPhone: ''
    });

    const [errors, setErrors] = useState({
        name: false,
        guestPhone: false
    });

    // Date State
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);

    // Pricing State
    const [count, setCount] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchSeva = async () => {
            try {
                console.log(`Fetching seva details for ID: ${id}`);
                const { data } = await api.get(`/sevas/${id}`);
                console.log('Seva data received:', data);
                if (!data) {
                    console.error('No data received from API');
                    toast.error('Seva details not found');
                    navigate('/sevas');
                    return;
                }
                setSeva(data);
            } catch (error) {
                console.error('Failed to load seva details:', error);
                toast.error('Failed to load seva details');
                navigate('/sevas');
            } finally {
                setLoading(false);
            }
        };

        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                setSettings(data);
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        };

        // Check for pre-filled data from lookup
        const savedData = sessionStorage.getItem('prefill_booking');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setFormData(prev => ({ ...prev, ...parsed }));
                sessionStorage.removeItem('prefill_booking');
                toast.success('Continuing with your saved details!');
            } catch (error) {
                console.error('Failed to parse prefill data:', error);
            }
        }

        if (id) {
            fetchSeva();
            fetchSettings();
        } else {
            console.error('No ID provided in URL');
            navigate('/sevas');
        }
    }, [id, navigate]);


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };


const handlePayment = async () => {
    // 1. Basic Validation (Name and Phone are required)
    if (!formData.name || (!isAuthenticated && !formData.guestPhone)) {
        setErrors({
            name: !formData.name,
            guestPhone: !isAuthenticated && !formData.guestPhone
        });
        toast.error('Please fill mandatory fields');
        return;
    }

    setIsBooking(true);

    try {
        const bookingData = {
            sevaId: id,
            devoteeName: formData.name,
            gothram: formData.gothram,
            rashi: formData.rashi,
            nakshatra: formData.nakshatra,
            bookingType: count > 1 ? 'family' : 'individual',
            count,
            totalAmount: total,
            guestName: formData.guestName || formData.name,
            guestEmail: formData.guestEmail,
            guestPhone: formData.guestPhone,
            bookingDate: selectedDate
        };

        // 2. Call your backend to create a "Pending" booking and Razorpay Order
        const { data } = await api.post('/bookings', bookingData);

        // 3. Configure Razorpay Options
        const options = {
            //key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure this is in your .env
            key: data.razorpayKey,
            amount: data.razorpayOrder.amount,
            currency: data.razorpayOrder.currency,
            name: "Shree Kshetra Ramtirtha",
            description: `Seva: ${currentLang === 'kn' ? seva.titleKn : seva.titleEn}`,
            order_id: data.razorpayOrder.id,
            handler: function (response) {
                // This function runs on payment success
                toast.success('Payment Successful!');
                navigate('/booking-success', { 
                    state: { booking: data.booking } 
                });
            },
            prefill: {
                name: formData.name,
                contact: formData.guestPhone,
                email: formData.guestEmail
            },
            theme: {
                color: "#ea580c", // Matches your orange theme
            },
            modal: {
                ondismiss: function() {
                    setIsBooking(false);
                }
            }
        };
        

        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error('Payment Error:', error);
        toast.error(error.response?.data?.message || 'Payment failed to initiate');
    } finally {
        setIsBooking(false);
    }
};

    const confirmBooking = async () => {
        setIsBooking(true);
        try {
            const bookingData = {
                sevaId: id,
                devoteeName: formData.name,
                gothram: formData.gothram,
                rashi: formData.rashi,
                nakshatra: formData.nakshatra,
                bookingType: 'individual',
                count: count,
                totalAmount: total,
                guestName: formData.guestName,
                guestEmail: formData.guestEmail,
                guestPhone: formData.guestPhone,
                bookingDate: selectedDate
            };

            const { data: responseData } = await api.post('/bookings', bookingData);
            toast.success('Payment Confirmed!');

            // Navigate to success page with booking data for receipt
            navigate('/booking-success', {
                state: {
                    booking: {
                        ...responseData,
                        // Ensure we have the seva details we just displayed
                        seva: seva
                    }
                }
            });

        } catch (error) {
            console.error(error);
            toast.error('Booking failed. Please try again.');
        } finally {
            setIsBooking(false);
            setShowUPI(false);
        }
    };

    const { i18n, t } = useTranslation();
    const currentLang = i18n.language;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            </div>
        );
    }

    if (!seva) return <div className="text-center py-20">Seva not found</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero Section */}
            <div className="relative h-56 sm:h-64 md:h-80 w-full bg-gray-900">
                <img
                    src={seva.image}
                    alt={currentLang === 'kn' ? seva.titleKn : seva.titleEn}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12 max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 sm:top-6 left-4 sm:left-6 text-white hover:text-orange-200 flex items-center transition-colors font-bold group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" />
                        {t('common.back')}
                    </button>
                    <span className="text-orange-300 font-bold tracking-wider uppercase text-[10px] sm:text-xs mb-1 sm:mb-2">
                        {currentLang === 'kn' ? (seva.templeNameKn || seva.templeNameEn || seva.templeName || seva.temple) : (seva.templeNameEn || seva.templeNameKn || seva.templeName || seva.temple)}
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight font-serif drop-shadow-lg">
                        {currentLang === 'kn' ? (seva.titleKn || seva.titleEn || seva.title) : (seva.titleEn || seva.titleKn || seva.title)}
                    </h1>
                    <p className="text-gray-200 flex items-center text-xs sm:text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1.5" /> {currentLang === 'kn' ? (seva.locationKn || seva.locationEn || seva.location || seva.place) : (seva.locationEn || seva.locationKn || seva.location || seva.place)}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('seva_details.about')}</h2>
                            <div className="prose prose-orange max-w-none">
                                <p className="text-gray-600 leading-relaxed text-lg italic bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50">
                                    {currentLang === 'kn' ? (seva.descriptionKn || seva.descriptionEn || seva.description) : (seva.descriptionEn || seva.descriptionKn || seva.description)}
                                </p>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-500 border-t border-gray-100 pt-4">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-orange-500" />
                                    Duration: 45 Mins
                                </div>
                                <div className="flex items-center">
                                    <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
                                    Verified Temple
                                </div>
                            </div>
                        </div>

                        {/* Sankalpa Form */}
                        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                            <SankalpaForm
                                formData={formData}
                                handleChange={handleFormChange}
                                isAuthenticated={isAuthenticated}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                errors={errors}
                            />
                        </div>
                    </div>

                    {/* Sidebar / Pricing */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6 form-wrapper">
                            <PricingWidget
                                basePrice={seva.price}
                                count={count}
                                setCount={setCount}
                                total={total}
                                setTotal={setTotal}
                            />

                            <button
                                onClick={handlePayment}
                                className="w-full py-4 rounded-xl font-bold text-lg transition transform active:scale-95 shadow-lg bg-orange-600 text-white hover:bg-orange-700"
                            >
                                {t('seva_details.proceed_pay')} ₹{total}
                            </button>

                            <p className="text-center text-xs text-gray-400">
                                {t('seva_details.secure_payment')}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* UPI Payment Layer */}
            <UPILayer
                isOpen={showUPI}
                onClose={() => setShowUPI(false)}
                onConfirm={confirmBooking}
                amount={total}
                upiId={settings?.upiId || 'payment@upi'}
                templeName={currentLang === 'kn' ? (seva.templeNameKn || settings?.templeName) : (seva.templeNameEn || settings?.templeName)}
                sevaName={currentLang === 'kn' ? seva.titleKn : seva.titleEn}
            />

            {/* Loading Overlay when booking */}
            {isBooking && (
                <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                        <p className="font-bold text-gray-800">Processing Your Booking...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SevaDetails;
