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
        setTrackPhone(phone);
        setIsTracking(true);
        try {
            // Fetch devotee details from devotees collection
            const { data: devotee } = await api.get(`/devotees/${phone}`);
            if (devotee) {
                const prefill = {
                    name: devotee.name || devotee.devoteeName || devotee.guestName || undefined,
                    rashi: devotee.rashi,
                    nakshatra: devotee.nakshatra,
                    guestName: devotee.guestName,
                    guestEmail: devotee.guestEmail,
                    guestPhone: devotee.mobile || devotee.guestPhone || phone,
                    state: devotee.state || 'Karnataka',
                    district: devotee.district || 'Belagavi',
                    taluk: devotee.taluk || 'Athani',
                    place: devotee.place,
                    pincode: devotee.pincode,
                    address: devotee.address,
                    paymentMode: devotee.paymentMode || 'upi'
                };
                try {
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
            } else {
                toast.error('No devotee found for this mobile number');
            }
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error('No devotee found for this mobile number');
            } else {
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
