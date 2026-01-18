import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';

const BookingSuccess = () => {
    const { i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if (location.state?.booking) {
            setBooking(location.state.booking);
        } else {
            // If no booking data in state, redirect home
            navigate('/');
        }
    }, [location, navigate]);

    const generatePDF = () => {
        if (!booking) return;

        try {
            const doc = new jsPDF();

            console.log("Generating PDF for:", booking);

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
                ['Seva Name', booking.seva?.titleEn || booking.seva?.title || booking.seva?.titleKn || 'Seva'],
                ['Devotee Name', booking.devoteeName || 'N/A'],
                ['Gothram', booking.gothram || 'N/A'],
                ['Rashi / Nakshatra', `${booking.rashi || '-'} / ${booking.nakshatra || '-'}`],
                ['Seva Date', booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'],
                ['Booking Type', (booking.bookingType || 'individual').charAt(0).toUpperCase() + (booking.bookingType || 'individual').slice(1)],
                ['Amount Paid', `INR ${booking.totalAmount || 0}`],
                ['Payment Status', 'Paid (Confirmed)']
            ];

            // Add guest info if present
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
                columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } }
            });

            // Footer
            const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 150;
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Thank you for your booking. May you be blessed.", 105, finalY + 20, null, null, "center");

            doc.save(`Receipt_${booking._id ? booking._id.slice(-6) : 'booking'}.pdf`);
            toast.success("Receipt Downloaded");
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Failed to generate receipt");
        }
    };

    if (!booking) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl w-full text-center border border-gray-100">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
                    <CheckCircle className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Successful!</h1>
                <p className="text-gray-500 mb-8">
                    Your seva has been successfully booked. May the blessings be with you.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                        <span className="text-gray-500 font-medium">Booking ID</span>
                        <span className="font-mono font-bold text-gray-900">#{booking._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-500 font-medium">Seva</span>
                        <span className="font-bold text-gray-900 text-right">
                            {i18n.language === 'kn' ? (booking.seva?.titleKn || booking.seva?.titleEn || booking.seva?.title) : (booking.seva?.titleEn || booking.seva?.titleKn || booking.seva?.title)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Amount</span>
                        <span className="font-bold text-orange-600">₹{booking.totalAmount}</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <button
                        onClick={generatePDF}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                    </button>
                    {/* Optional: Add "View My Bookings" if authenticated, but keeping it simple for now */}
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
