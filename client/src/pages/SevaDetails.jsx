import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import SankalpaForm from '../components/booking/SankalpaForm';
import PricingWidget from '../components/booking/PricingWidget';
import api from '../utils/api';

import { useTranslation } from 'react-i18next';

const SevaDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [seva, setSeva] = useState(null);
    const [loading, setLoading] = useState(true);

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
        // if (!isAuthenticated) {
        //     toast.error('Please login to book a seva');
        //     navigate('/login');
        //     return;
        // }

        const newErrors = {
            name: !formData.name,
            guestPhone: !isAuthenticated && !formData.guestPhone
        };

        setErrors(newErrors);

        if (newErrors.name || newErrors.guestPhone) {
            toast.error('Please fill all mandatory fields');

            // Focus the first error field
            const firstError = newErrors.name ? 'name' : 'guestPhone';
            setTimeout(() => {
                const element = document.getElementsByName(firstError)[0];
                if (element) {
                    element.focus();
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            return;
        }

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
            toast.success('Booking Successful!');

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
            <div className="relative h-64 md:h-80 w-full bg-gray-900">
                <img
                    src={seva.image}
                    alt={currentLang === 'kn' ? seva.titleKn : seva.titleEn}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 text-white hover:text-orange-200 flex items-center transition-colors font-bold group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" />
                        {t('common.back')}
                    </button>
                    <span className="text-orange-300 font-bold tracking-wider uppercase text-sm mb-2">
                        {currentLang === 'kn' ? (seva.templeNameKn || seva.templeNameEn || seva.templeName || seva.temple) : (seva.templeNameEn || seva.templeNameKn || seva.templeName || seva.temple)}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white leading-tight font-serif">
                        {currentLang === 'kn' ? (seva.titleKn || seva.titleEn || seva.title) : (seva.titleEn || seva.titleKn || seva.title)}
                    </h1>
                    <p className="text-gray-200 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> {currentLang === 'kn' ? (seva.locationKn || seva.locationEn || seva.location || seva.place) : (seva.locationEn || seva.locationKn || seva.location || seva.place)}
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
        </div>
    );
};

export default SevaDetails;
