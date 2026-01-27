import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

import SankalpaForm from '../components/booking/SankalpaForm';
import PricingWidget from '../components/booking/PricingWidget';
import UPILayer from '../components/booking/UPILayer';
import api from '../utils/api';

import { useTranslation } from 'react-i18next';

const SevaDetails = () => {
    const { id } = useParams();
    const isDirectBooking = !id;
    const [allSevas, setAllSevas] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [seva, setSeva] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        gothram: '',
        rashi: '',
        nakshatra: '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        sevaId: '' // 👈 IMPORTANT
    });

    const [errors, setErrors] = useState({
        name: false,
        guestPhone: false
    });

    // Date (local timezone)
    const localYYYYMMDD = (d = new Date()) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };
    const today = localYYYYMMDD();
    const [selectedDate, setSelectedDate] = useState(today);

    // Pricing
    const [count, setCount] = useState(1);
    const [total, setTotal] = useState(0);

    const [showUPI, setShowUPI] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    const { i18n, t } = useTranslation();
    const currentLang = i18n.language;

useEffect(() => {
    const fetchAllSevas = async () => {
        try {
            const { data } = await api.get('/sevas');
            setAllSevas(data);
        } catch (error) {
            console.error('Failed to fetch sevas', error);
                toast.error(t('sankalpa.failed_load_sevas'));
        }
    };

    const fetchSingleSeva = async () => {
        try {
            const { data } = await api.get(`/sevas/${id}`);
            setSeva(data);

            // Preselect seva
            setFormData(prev => ({
                ...prev,
                sevaId: data._id
            }));
        } catch (error) {
                toast.error(t('sankalpa.failed_load_seva'));
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
            console.error('Failed to load settings');
        }
    };

    fetchSettings();
    fetchAllSevas();

    if (!isDirectBooking) {
        fetchSingleSeva();
    } else {
        setLoading(false);
    }
}, [id]);

// Read any prefill data placed in sessionStorage (e.g., from phone lookup)
useEffect(() => {
    try {
        const raw = sessionStorage.getItem('prefill_booking');
        if (raw) {
            console.log('Raw prefill_booking found:', raw);
            const pre = JSON.parse(raw);
            console.log('Parsed prefill_booking:', pre);
            // Filter out empty values so we don't overwrite good defaults with blanks
            const filtered = Object.fromEntries(
                Object.entries(pre).filter(([, v]) => v !== undefined && v !== null && v !== '')
            );
            console.log('Filtered prefill_booking:', filtered);
            // Merge prefill so it overrides only when values are present
            setFormData(prev => ({ ...prev, ...filtered }));

            // If prefill contains a bookingDate, apply it to the selectedDate (normalize to yyyy-mm-dd)
            if (filtered.bookingDate) {
                try {
                    const d = new Date(filtered.bookingDate);
                    if (!isNaN(d.getTime())) {
                        setSelectedDate(localYYYYMMDD(d));
                    }
                } catch (e) {
                    // ignore invalid date
                }
            }
            sessionStorage.removeItem('prefill_booking');
        }
    } catch (e) {
        console.warn('Failed to apply prefill booking', e);
    }
}, []);

const selectedSeva =
    allSevas.find(s => s._id === formData.sevaId) || seva;

// Ensure selectedDate defaults to today when a seva is selected and no date provided
useEffect(() => {
    if (selectedSeva) {
        try {
            if (!selectedDate || selectedDate === '') {
                setSelectedDate(today);
            }
        } catch (e) {
            // ignore
        }
    }
}, [selectedSeva]);

const allowCustomAmount = (selectedSeva && ((selectedSeva.titleEn || selectedSeva.title || '').toLowerCase().includes('sarva seva')));



    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handlePayment = () => {
        const errs = {};
        const messages = [];

        // Name: required, reasonable length
        if (!formData.name || !formData.name.trim()) {
            errs.name = true;
            messages.push(t('sankalpa.error_name'));
        } else if (formData.name.trim().length > 100) {
            errs.name = true;
            messages.push(t('sankalpa.error_name'));
        }

        // Seva must be selected
        if (!formData.sevaId) {
            errs.sevaId = true;
            messages.push(t('sankalpa.error_select_seva'));
        }

        // Guest phone: if user is not authenticated, require 10 digit numeric phone
        if (!isAuthenticated) {
            const phone = (formData.guestPhone || '').replace(/\D/g, '');
            if (!phone || phone.length !== 10) {
                    errs.guestPhone = true;
                    messages.push(t('home.error_invalid_phone'));
            }
        }

        // Pincode: if provided, must be 6 digits
        if (formData.pincode) {
            const pin = (formData.pincode || '').replace(/\D/g, '');
            if (pin.length !== 6) {
                errs.pincode = true;
                messages.push(t('sankalpa.error_pincode'));
            }
        }

        // Place (village): optional but max length
            if (formData.place && formData.place.length > 100) {
            errs.place = true;
            messages.push(t('sankalpa.error_place'));
        }

        // Address: optional but max length
        if (formData.address && formData.address.length > 250) {
            errs.address = true;
            messages.push(t('sankalpa.error_address'));
        }

        setErrors(prev => ({ ...prev, ...errs }));

        if (messages.length > 0) {
            toast.error(messages[0]);
            return;
        }

        // If payment mode is cash, skip UPI and confirm booking immediately
        if (formData.paymentMode === 'cash') {
            confirmBooking();
            return;
        }

        setShowUPI(true);
    };

    const confirmBooking = async () => {
        setIsBooking(true);
        try {
            const payload = {
                sevaId: formData.sevaId,
                // store a human-readable seva snapshot
                sevaName: selectedSeva?.titleEn || selectedSeva?.title || '',
                devoteeName: formData.name,
                bookingType: 'individual',
                count,
                totalAmount: total,
                guestPhone: formData.guestPhone,
                bookingDate: selectedDate,
                // Location fields
                state: formData.state,
                district: formData.district,
                taluk: formData.taluk,
                pincode: formData.pincode,
                place: formData.place,
                address: formData.address,
                paymentMode: formData.paymentMode
            };

            const { data } = await api.post('/bookings', payload);
            toast.success(t('bookings.success_title'));

            navigate('/booking-success', {
                state: {
                    booking: {
                        ...data,
                        // include the currently selected seva object so the receipt shows correct seva details
                        seva: selectedSeva
                    }
                }
            });
        } catch (e) {
            toast.error(t('sankalpa.booking_failed'));
        } finally {
            setIsBooking(false);
            setShowUPI(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            </div>
        );
    }

    if (!seva) return null;

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Header */}
            <div className="relative h-64 bg-black">
                <img
                    src={seva.image}
                    alt={seva.titleEn}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 text-white flex items-center font-bold"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        {t('common.back')}
                    </button>
                    <h1 className="text-4xl font-black text-white">
                        {currentLang === 'kn' ? seva.titleKn : seva.titleEn}
                    </h1>
                    <p className="text-gray-200 flex items-center text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {currentLang === 'kn' ? seva.locationKn : seva.locationEn}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Form */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
<SankalpaForm
    formData={formData}
    handleChange={handleFormChange}
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
    errors={errors}
    sevas={allSevas}
/>
                    </div>

                    {/* Pricing */}
                    <div className="lg:col-span-1 sticky top-24 space-y-6">
<PricingWidget
    key={selectedSeva?._id || 'pricing'}
    basePrice={selectedSeva?.price || 0}
    count={count}
    setCount={setCount}
    total={total}
    setTotal={setTotal}
    allowCustomAmount={allowCustomAmount}
/>
                        

                        <button
                            onClick={handlePayment}
                            className="w-full py-4 rounded-xl font-bold text-lg bg-orange-600 text-white hover:bg-orange-700"
                        >
                            {t('seva_details.proceed_pay')} ₹{total}
                        </button>
                    </div>
                </div>
            </div>

            <UPILayer
                isOpen={showUPI}
                onClose={() => setShowUPI(false)}
                onConfirm={confirmBooking}
                amount={total}
                upiId={settings?.upiId}
                templeName={seva.templeNameEn}
                sevaName={seva.titleEn}
            />

            {isBooking && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                </div>
            )}
        </div>
    );
};

export default SevaDetails;
