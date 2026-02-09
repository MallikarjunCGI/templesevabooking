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
    const { isAuthenticated } = useSelector((state) => state.auth);

    const handleTrackBooking = async () => {
        if (!isAuthenticated) return;
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
                    name: devotee.fullName || '',
                    gothram: devotee.gothram || '',
                    state: devotee.state || 'Karnataka',
                    district: devotee.district || 'Belagavi',
                    taluk: devotee.taluk || 'Athani',
                    pincode: devotee.pincode || '',
                    place: devotee.place || '',
                    address: devotee.fullAddress || '',
                    guestPhone: devotee.mobile || phone,
                    // Add other fields if your SevaForm expects them
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
                        if (isAuthenticated) {
                            navigate(`/sevas/${firstId}`, { state: { selectedSevaId: firstId, paymentType: 'upi' } });
                        }
                    } else {
                        navigate('/sevas');
                    }
                } catch (e) {
                    console.warn('Failed to fetch sevas for navigation', e);
                    navigate('/sevas');
                }
            } else {
                // Redirect to SevaDetails page to fill the form if devotee not found
                navigate('/sevas');
                // Optionally, you can prefill the phone number in sessionStorage for SevaDetails
                try {
                    sessionStorage.setItem('prefill_booking', JSON.stringify({ guestPhone: phone }));
                } catch (e) {
                    console.warn('Could not store prefill in sessionStorage', e);
                }
            }
        } catch (error) {
            if (error.response?.status === 404) {
                // Redirect to SevaDetails page to fill the form if devotee not found
                navigate('/sevas');
                try {
                    sessionStorage.setItem('prefill_booking', JSON.stringify({ guestPhone: phone }));
                } catch (e) {
                    console.warn('Could not store prefill in sessionStorage', e);
                }
            } else {
                toast.error(t('home.error_fetch_bookings'));
            }
        } finally {
            setIsTracking(false);
        }
    };

    // Auto-trigger search on 10 digits
    useEffect(() => {
        if (isAuthenticated && trackPhone.length === 10) {
            handleTrackBooking();
        }
    }, [trackPhone, isAuthenticated]);

    return (
        <div className="w-full px-4">
            <div className="relative z-10 space-y-4">
                <SearchBar
                    value={trackPhone}
                    onChange={setTrackPhone}
                    onSearch={handleTrackBooking}
                    isTracking={isTracking}
                    disabled={!isAuthenticated}
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
