import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import SearchBar from './SearchBar';
import BookingLookupModal from './BookingLookupModal';

const HomeSearchSection = () => {
    const [trackPhone, setTrackPhone] = useState('');
    const [isTracking, setIsTracking] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [foundBookings, setFoundBookings] = useState([]);
    const navigate = useNavigate();

    const handleTrackBooking = async () => {
        if (!trackPhone || trackPhone.length < 10) {
            toast.error("Please enter a valid 10-digit mobile number");
            return;
        }

        setIsTracking(true);
        try {
            const { data } = await api.get(`/bookings/track/${trackPhone}`);
            if (data && data.length > 0) {
                setFoundBookings(data);
                setIsModalOpen(true);
            } else {
                setFoundBookings([]);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status !== 404) {
                toast.error("Failed to fetch bookings. Please try again.");
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
