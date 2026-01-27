import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const handleTrackBooking = async () => {
        console.log('handleTrackBooking invoked with', trackPhone);
        if (!trackPhone || trackPhone.length < 10) {
            toast.error(t('home.error_invalid_phone'));
            return;
        }

        setIsTracking(true);
        try {
            const { data } = await api.get(`/bookings/track/${trackPhone}`);
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
                    gothram: findFirstNonEmpty('gothram'),
                    rashi: findFirstNonEmpty('rashi'),
                    nakshatra: findFirstNonEmpty('nakshatra'),
                    guestName: findFirstNonEmpty('guestName'),
                    guestEmail: findFirstNonEmpty('guestEmail'),
                    guestPhone: findFirstNonEmpty('guestPhone') || trackPhone,
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
                navigate(`/sevas/${sevaId}`, { state: { selectedSevaId: sevaId } });
            } else {
                // No previous bookings: still navigate to a Seva details page with phone prefilled
                const prefill = {
                    guestPhone: trackPhone,
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
                        navigate(`/sevas/${firstId}`, { state: { selectedSevaId: firstId } });
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
                    onSearch={(val) => navigate('/sevas', { state: { search: val } })}
                    isTracking={isTracking}
                />
            </div>

            {/* Booking Lookup Modal */}
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
