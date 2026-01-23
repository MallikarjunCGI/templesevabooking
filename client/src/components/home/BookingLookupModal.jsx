import React from 'react';
import { X, Calendar, MapPin, CheckCircle, ExternalLink, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';

const BookingLookupModal = ({ isOpen, onClose, bookings, phone }) => {
    if (!isOpen) return null;

    const generatePDF = (booking) => {
        try {
            const doc = new jsPDF();

            // Header
            doc.setFillColor(234, 88, 12);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("Temple Seva Booking", 105, 20, null, null, "center");
            doc.setFontSize(12);
            doc.text("Official Receipt", 105, 30, null, null, "center");

            // Info
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(14);
            doc.text(booking.seva?.templeNameEn || 'Temple', 15, 55);

            const tableBody = [
                ['Reference', `#${booking._id.slice(-6).toUpperCase()}`],
                ['Seva', booking.seva?.titleEn || 'Seva'],
                ['Devotee', booking.devoteeName || 'N/A'],
                ['Date', new Date(booking.bookingDate).toLocaleDateString()],
                ['Amount', `INR ${booking.totalAmount}`],
                ['Status', booking.status]
            ];

            autoTable(doc, {
                startY: 70,
                head: [['Field', 'Details']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [234, 88, 12] }
            });

            doc.save(`Receipt_${booking._id.slice(-6)}.pdf`);
            toast.success("Receipt Downloaded");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate receipt");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-orange-100 flex flex-col animate-in zoom-in-95 duration-300 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-orange-600 hover:rotate-90 transition-all shadow-sm border border-gray-100 z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                {bookings.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 opacity-40" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800">No Bookings Found</h3>
                        <p className="text-gray-500 mt-2 font-medium text-sm">We couldn't find any seva bookings associated with this mobile number.</p>
                    </div>
                ) : (
                    <>
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-12 -mt-12 opacity-50 z-0 text-orange-200"></div>

                        <div className="p-6 sm:p-8 relative z-10">
                            {/* Header Info */}
                            <div className="mb-6 sm:mb-8">
                                <div className="flex justify-between items-center mb-5 sm:mb-6">
                                    <div className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                        {bookings[0].status}
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-mono font-bold text-gray-300 uppercase tracking-widest">
                                        #{bookings[0]._id.slice(-6).toUpperCase()}
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight font-serif">
                                    {bookings[0].seva?.titleEn || 'Seva'}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500 flex items-center font-medium opacity-80">
                                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                                    {bookings[0].seva?.templeNameEn || 'Temple Name'}
                                </p>
                            </div>

                            {/* Details List */}
                            <div className="space-y-4 border-t border-gray-100 pt-6 sm:pt-8 mb-8 sm:mb-10">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Devotee</span>
                                    <span className="font-bold text-gray-800">{bookings[0].devoteeName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Gothram</span>
                                    <span className="font-bold text-gray-800">{bookings[0].gothram || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Rashi / Nakshatra</span>
                                    <span className="font-bold text-gray-800">
                                        {bookings[0].rashi || '-'} / {bookings[0].nakshatra || '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Booking Date</span>
                                    <span className="font-bold text-gray-800">
                                        {new Date(bookings[0].bookingDate).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-6 sm:pt-8 mb-4 sm:mb-6 border-t border-gray-100">
                                    <button
                                        onClick={() => generatePDF(bookings[0])}
                                        className="flex items-center text-[10px] font-black text-orange-600 hover:text-orange-700 transition-colors uppercase tracking-widest"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF Receipt
                                    </button>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                                    <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Total Amount</span>
                                    <span className="text-3xl font-black text-orange-600">₹{bookings[0].totalAmount}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => {
                                    sessionStorage.setItem('prefill_booking', JSON.stringify({
                                        name: bookings[0].devoteeName,
                                        gothram: bookings[0].gothram,
                                        rashi: bookings[0].rashi,
                                        nakshatra: bookings[0].nakshatra,
                                        guestName: bookings[0].guestName,
                                        guestEmail: bookings[0].guestEmail,
                                        guestPhone: phone
                                    }));
                                    onClose();
                                    const sevaId = bookings[0].seva?._id || bookings[0].seva;
                                    window.location.href = `/sevas/${sevaId}`;
                                }}
                                className="w-full py-4.5 bg-gray-900 text-white rounded-xl text-sm sm:text-base font-black flex items-center justify-center hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-[0.98] group"
                            >
                                <ExternalLink className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                Book Again Now
                            </button>
                        </div>

                        {/* Blessing Note */}
                        <div className="p-4 bg-orange-50/50 text-center border-t border-orange-100/50">
                            <p className="text-[9px] text-orange-400 font-black uppercase tracking-[0.2em]">
                                May the blessings be with you
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingLookupModal;
