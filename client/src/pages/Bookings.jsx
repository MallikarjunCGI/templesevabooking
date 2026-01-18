import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Calendar, MapPin, Clock, Download, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { useTranslation } from 'react-i18next';

const Bookings = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        // Redirect if not admin - devotee login flow is removed
        if (!isAuthenticated || user?.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings/mybookings');
                // Ensure data is an array
                const bookingsData = Array.isArray(response.data) ? response.data : [];
                setBookings(bookingsData);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                // Don't show toast on 401/404 to avoid spam logic, just log
                // or keep toast but ensure state is fail-safe
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const generatePDF = (booking) => {
        try {
            const doc = new jsPDF();
            console.log("Generating receipt for:", booking);

            // Header - Orange Background
            doc.setFillColor(234, 88, 12); // Orange-600
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("Temple Seva Booking", 105, 20, null, null, "center");
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text("Official Receipt", 105, 30, null, null, "center");

            // Temple Details
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            const templeName = booking.seva?.templeNameEn || booking.seva?.templeName || booking.seva?.templeNameKn || 'Temple';
            doc.text(templeName, 15, 55);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            const locationStr = booking.seva?.locationEn || booking.seva?.location || booking.seva?.place || booking.seva?.locationKn || 'Temple Location';
            doc.text(locationStr, 15, 60);

            // Booking Info Table
            const tableBody = [
                ['Booking Reference', `#${booking._id ? booking._id.slice(-6).toUpperCase() : 'N/A'}`],
                ['Seva Name', booking.seva?.titleEn || booking.seva?.title || booking.seva?.titleKn || 'Unknown Seva'],
                ['Devotee Name', booking.devoteeName || 'N/A'],
                ['Gothram', booking.gothram || 'N/A'],
                ['Rashi / Nakshatra', `${booking.rashi || '-'} / ${booking.nakshatra || '-'}`],
                ['Seva Date', booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'],
                ['Booking Type', (booking.bookingType || 'individual').charAt(0).toUpperCase() + (booking.bookingType || 'individual').slice(1)],
                ['Amount Paid', `INR ${booking.totalAmount || 0}`],
                ['Payment Status', 'Paid (Confirmed)']
            ];

            // Add guest info if present - for consistency though mybookings typically implies logged in user
            if (booking.guestName) {
                tableBody.push(['Booked By (Guest)', `${booking.guestName} (${booking.guestPhone || ''})`]);
            }

            autoTable(doc, {
                startY: 70,
                head: [['Description', 'Details']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [234, 88, 12] }, // Orange Header
                styles: { fontSize: 10, cellPadding: 3 },
                columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
            });

            // Footer
            const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 150;
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Thank you for your booking. May you be blessed.", 105, finalY + 20, null, null, "center");

            doc.save(`Receipt_${booking._id ? booking._id.slice(-6) : 'booking'}.pdf`);
            toast.success(t('bookings.receipt_downloaded'));
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Could not generate receipt");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">{t('common.loading')}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[60vh]">
            {/* Back Button */}
            <Link
                to="/"
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-bold mb-6 group transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                {t('common.back_home')}
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('bookings.title')}</h1>

            {bookings.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-gray-200 text-center shadow-sm">
                    <p className="text-gray-500 mb-4">{t('bookings.no_bookings')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-1">
                                    {i18n.language === 'kn' ? (booking.seva?.titleKn || booking.seva?.titleEn || booking.seva?.title) : (booking.seva?.titleEn || booking.seva?.titleKn || booking.seva?.title)}
                                </h3>
                                <p className="text-gray-500 text-sm mb-3 flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {i18n.language === 'kn' ? (booking.seva?.templeNameKn || booking.seva?.templeNameEn || booking.seva?.templeName) : (booking.seva?.templeNameEn || booking.seva?.templeNameKn || booking.seva?.templeName)}
                                </p>
                                <p className="text-gray-400 text-xs mb-3 -mt-2">
                                    {i18n.language === 'kn' ? (booking.seva?.locationKn || booking.seva?.locationEn || booking.seva?.location || booking.seva?.place) : (booking.seva?.locationEn || booking.seva?.locationKn || booking.seva?.location || booking.seva?.place)}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span className="flex items-center bg-orange-50 px-3 py-1 rounded-full text-orange-700 font-medium border border-orange-100">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {new Date(booking.bookingDate).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center text-gray-500">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {booking.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 md:mt-0 flex flex-col items-end space-y-3 pl-4 md:border-l border-gray-100">
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-800">₹{booking.totalAmount}</p>
                                    <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded inline-block mt-1">
                                        {t('bookings.payment_success')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => generatePDF(booking)}
                                    className="flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {t('bookings.receipt')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings;
