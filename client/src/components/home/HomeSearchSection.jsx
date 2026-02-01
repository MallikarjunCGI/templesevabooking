import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import SearchBar from './SearchBar';
import BookingLookupModal from './BookingLookupModal';

const HomeSearchSection = () => {
    const [trackPhone, setTrackPhone] = useState('');
    const [isTracking, setIsTracking] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [foundBookings, setFoundBookings] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();
    // Removed isAuthenticated restriction for mobile search

    const handleTrackBooking = async () => {
        // Only allow 10 digit mobile numbers
        const phone = (trackPhone || '').replace(/\D/g, '');
        if (!phone || phone.length !== 10) {
            toast.error('Please enter a valid 10 digit mobile number');
            return;
        }
        // Only allow numbers
        setTrackPhone(phone);
        console.log('handleTrackBooking invoked with', phone);

        setIsTracking(true);
        try {
            const { data } = await api.get(`/bookings/track/${phone}`);
            if (data && data.length > 0) {
                // Use bookings list to build a robust prefill: prefer latest non-empty values
                const latest = data[0];

                const findFirstNonEmpty = (field) => {
                    for (const b of data) {
                        if (b[field] !== undefined && b[field] !== null && String(b[field]).trim() !== '') return b[field];
                    }
                    return undefined;
                };
                const prefill = {
                    name: findFirstNonEmpty('devoteeName') || findFirstNonEmpty('guestName') || undefined,
                    rashi: findFirstNonEmpty('rashi'),
                    nakshatra: findFirstNonEmpty('nakshatra'),
                    guestName: findFirstNonEmpty('guestName'),
                    guestEmail: findFirstNonEmpty('guestEmail'),
                    guestPhone: findFirstNonEmpty('guestPhone') || phone,
                    state: findFirstNonEmpty('state') || 'Karnataka',
                    district: findFirstNonEmpty('district') || 'Belagavi',
                    taluk: findFirstNonEmpty('taluk') || 'Athani',
                    place: findFirstNonEmpty('place'),
                    pincode: findFirstNonEmpty('pincode'),
                    address: findFirstNonEmpty('address'),
                    paymentMode: findFirstNonEmpty('paymentMode') || 'upi'
                };

                // If a booking date exists in any booking, use the first non-empty one and normalize to yyyy-mm-dd
                const rawDate = findFirstNonEmpty('bookingDate');
                if (rawDate) {
                    try {
                        const dt = new Date(rawDate);
                        if (!isNaN(dt.getTime())) {
                            prefill.bookingDate = dt.toISOString().split('T')[0];
                        }
                    } catch (e) {
                        // ignore invalid date
                    }
                }

                try {
                    console.log('Storing prefill_booking:', prefill);
                    sessionStorage.setItem('prefill_booking', JSON.stringify(prefill));
                } catch (e) {
                    console.warn('Could not store prefill in sessionStorage', e);
                }

                const sevaId = latest.seva?._id || latest.seva;
                // If logged in, go directly. If not, prompt for payment type
                const isAuthenticated = !!localStorage.getItem('token');
                if (isAuthenticated) {
                    navigate(`/sevas/${sevaId}`, { state: { selectedSevaId: sevaId, paymentType: 'upi' } });
                } else {
                    navigate('/select-payment', { state: { selectedSevaId: sevaId, prefill } });
                }
            } else {
                // No previous bookings: still navigate to a Seva details page with phone prefilled
                const prefill = {
                    guestPhone: phone,
                    state: 'Karnataka',
                    district: 'Belagavi',
                    taluk: 'Athani',
                    paymentMode: 'upi'
                };

                try {
                    console.log('Storing prefill_booking (no bookings):', prefill);
                    sessionStorage.setItem('prefill_booking', JSON.stringify(prefill));
                } catch (e) {
                    console.warn('Could not store prefill in sessionStorage', e);
                }

                // Try to fetch sevas and navigate to the first one, otherwise go to listing
                try {
                    const { data: sevasList } = await api.get('/sevas');
                    if (sevasList && sevasList.length > 0) {
                        const firstId = sevasList[0]._id;
                        const isAuthenticated = !!localStorage.getItem('token');
                        if (isAuthenticated) {
                            navigate(`/sevas/${firstId}`, { state: { selectedSevaId: firstId, paymentType: 'upi' } });
                        } else {
                            navigate('/select-payment', { state: { selectedSevaId: firstId, prefill } });
                        }
                    } else {
                        navigate('/sevas');
                    }
                } catch (e) {
                    console.warn('Failed to fetch sevas for navigation', e);
                    navigate('/sevas');
                }
            }
            } catch (error) {
            console.error(error);
                if (error.response?.status !== 404) {
                    toast.error(t('home.error_fetch_bookings'));
                }
        } finally {
            setIsTracking(false);
        }
    };

    // Auto-trigger search on 10 digits
    useEffect(() => {
        if (trackPhone.length === 10) {
            handleTrackBooking();
        }
    }, [trackPhone]);

    return (
        <div className="w-full px-4">
            <div className="relative z-10 space-y-4">
                <SearchBar
                    value={trackPhone}
                    onChange={setTrackPhone}
                    onSearch={handleTrackBooking}
                    isTracking={isTracking}
                    placeholder="Search with Mobile number"
                />
            </div>

            <BookingLookupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bookings={foundBookings}
                phone={trackPhone}
            />
        </div>
    );
};

export default HomeSearchSection;
