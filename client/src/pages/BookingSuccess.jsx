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
            <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[2.5rem] shadow-xl max-w-2xl w-full text-center border border-orange-50">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short shadow-inner">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 font-serif">Booking Successful!</h1>
                <p className="text-gray-500 mb-8 text-sm sm:text-base font-medium opacity-80">
                    Your seva has been successfully booked. May the blessings be with you.
                </p>

                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 mb-8 text-left border border-gray-100">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                        <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Booking ID</span>
                        <span className="font-mono font-bold text-gray-900 text-sm sm:text-base">#{booking._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Seva Offering</span>
                        <span className="font-bold text-gray-900 text-right text-sm sm:text-base max-w-[180px] sm:max-w-none">
                            {i18n.language === 'kn' ? (booking.seva?.titleKn || booking.seva?.titleEn || booking.seva?.title) : (booking.seva?.titleEn || booking.seva?.titleKn || booking.seva?.title)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Amount Paid</span>
                        <span className="font-black text-orange-600 text-xl sm:text-2xl">₹{booking.totalAmount}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-6 py-4 bg-white text-gray-700 font-black rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm sm:text-base active:scale-95"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <button
                        onClick={generatePDF}
                        className="inline-flex items-center justify-center px-6 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-gray-200 text-sm sm:text-base active:scale-95"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
