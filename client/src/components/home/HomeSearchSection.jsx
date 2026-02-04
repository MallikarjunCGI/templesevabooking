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
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleTrackBooking = async () => {
        // Only allow 10 digit mobile numbers
        const phone = (trackPhone || '').replace(/\D/g, '');
        if (!phone || phone.length !== 10) {
            toast.error('Please enter a valid 10 digit mobile number');
            return;
        }
        setTrackPhone(phone);
        setIsTracking(true);
        let devotee = null;
        try {
            // Try to fetch devotee details
            const response = await api.get(`/devotees/${phone}`);
            devotee = response.data;
        } catch (error) {
            // If 404, treat as not found, but proceed
            if (error.response?.status !== 404) {
                toast.error(t('home.error_fetch_bookings'));
                setIsTracking(false);
                return;
            }
        }
        // Prefill if devotee found
        let prefill = {};
        if (devotee) {
            prefill = {
                fullName: devotee.fullName || undefined,
                gothram: devotee.gothram,
                rashi: devotee.rashi,
                nakshatra: devotee.nakshatra,
                guestEmail: devotee.guestEmail,
                guestPhone: devotee.mobile || devotee.guestPhone || phone,
                state: devotee.state || 'Karnataka',
                district: devotee.district || 'Belagavi',
                taluk: devotee.taluk || 'Athani',
                place: devotee.place, // Village/Town
                pincode: devotee.pincode,
                address: devotee.fullAddress || devotee.address, // Prefer fullAddress if present
                paymentMode: devotee.paymentMode || 'upi'
            };
        } else {
            // If not found, at least prefill phone
            prefill = { guestPhone: phone };
        }
        try {
            sessionStorage.setItem('prefill_booking', JSON.stringify(prefill));
        } catch (e) {
            console.warn('Could not store prefill in sessionStorage', e);
        }
        // Try to fetch sevas and navigate accordingly
        try {
            const { data: sevasList } = await api.get('/sevas');
            if (sevasList && sevasList.length > 0) {
                const firstId = sevasList[0]._id;
                if (isAuthenticated && user?.role === 'admin') {
                    navigate(`/sevas/${firstId}`, { state: { selectedSevaId: firstId, paymentType: 'upi' } });
                } else if (isAuthenticated && user?.role === 'user') {
                    navigate(`/sevas/${firstId}`, { state: { selectedSevaId: firstId, paymentType: 'upi' } });
                } else {
                    navigate('/sevas');
                }
            } else {
                navigate('/sevas');
            }
        } catch (e) {
            console.warn('Failed to fetch sevas for navigation', e);
            navigate('/sevas');
        }
        setIsTracking(false);
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
