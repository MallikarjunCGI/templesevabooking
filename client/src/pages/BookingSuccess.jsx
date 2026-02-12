import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Printer, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

const BookingSuccess = () => {
    const { t, i18n } = useTranslation();
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

    // Print-only receipt (opens printable window)
    // const printReceipt = () => {
    //     if (!booking) return;

    //     const templeName = booking.seva?.templeNameEn || booking.seva?.templeName || booking.seva?.templeNameKn || '';
    //     const sevaName = booking.seva?.titleEn || booking.seva?.title || booking.seva?.titleKn || '';
    //     const html = `
    //         <html>
    //         <head>
    //         <title>${t('bookings.receipt_title')}</title>
    //             <style>
    //                 body { font-family: Arial, sans-serif; padding: 24px; color: #222 }
    //                 .header { text-align:left; padding:12px 0 }
    //                 .title { font-size:18px; font-weight:700; color:#ea580c }
    //                 .box { border:1px solid #eee; padding:16px; margin-top:12px }
    //                 .row { display:flex; padding:8px 0; border-bottom:1px solid #f3f3f3 }
    //                 .label { color:#666; width:40%; text-align:left; padding-right:8px; font-weight:600 }
    //                 .value { font-weight:700; text-align:left; width:60% }
    //                 .watermark { opacity:0.7; position:fixed; bottom:8px; right:12px; font-size:10px; color:#222 }
    //                 @media print { .box { border: none } }
    //             </style>
    //         </head>
    //         <body>
    //             <div class="header">
    //                 <div class="title">${t('bookings.receipt_header')}</div>
    //             </div>
    //             <div class="box">
    //                     <div class="row"><div class="label">${t('bookings.booking_id')}</div><div class="value">#${booking._id ? booking._id.slice(-6).toUpperCase() : 'N/A'}</div></div>
    //                     <div class="row"><div class="label">${t('bookings.seva_name')}</div><div class="value">${sevaName}</div></div>
    //                     <div class="row"><div class="label">${t('bookings.mobile_number')}</div><div class="value">${booking.guestPhone || ''}</div></div>
    //                     <div class="row"><div class="label">${t('bookings.devotee_name')}</div><div class="value">${booking.devoteeName || ''}</div></div>
    //                     <div class="row"><div class="label">${t('bookings.date_of_seva')}</div><div class="value">${booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : ''}</div></div>
    //                     <div class="row"><div class="label">${t('bookings.amount_paid')}</div><div class="value">₹${booking.totalAmount || 0}</div></div>
    //                     <div class="row"><div class="label">${t('bookings.payment_mode')}</div><div class="value">${booking.paymentMode || 'N/A'}</div></div>
    //             </div>
    //             <div class="watermark">Sri Sai Digital Marketing Agency - 9740261111</div>
    //             <script>
    //                 window.onload = function() { window.print(); };
    //             </script>
    //         </body>
    //         </html>
    //     `;

    //     const w = window.open('', '_blank');
    //     if (w) {
    //         w.document.open();
    //         w.document.write(html);
    //         w.document.close();
    //     } else {
    //         toast.error(t('bookings.print_window_error'));
    //     }
    // };

// Print Receipt (opens print dialog)
const printReceipt = () => {
    if (!booking) return;
    // ...existing code for html...
    // (Use the same html as before)
    const sevaName =
        booking.seva?.titleEn ||
        booking.seva?.title ||
        booking.seva?.titleKn ||
        '';
    const bookingDateStr = booking.createdAt
        ? new Date(booking.createdAt).toLocaleDateString()
        : new Date().toLocaleDateString();
    const sevaDateStr = booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '';
    const paidType = (booking.paymentMode === 'upi' ? 'UPI' : booking.paymentMode === 'cash' ? 'Cash' : booking.paymentMode || '—');
    const html = `
    <html>
    <head>
        <style>
            @page { size: A5 landscape; margin: 0; }
            html, body {
                width: 8.37in;
                height: 5.83in;
                margin: 0;
                padding: 0;
                overflow: hidden;
                font-family: Arial, sans-serif;
                color: #000;
            }
            body {
                background: #ffffff;
            }
            .content {
                box-sizing: border-box;
                width: 8.37in;
                min-height: 5.83in;
                padding-top: 2.3in;
                padding-left: 0.4in;
                padding-right: 0.4in;
                padding-bottom: 0.3in;
            }
            .receipt-table {
                width: 100%;
                border-collapse: collapse;
                border: none;
                font-size: 15px;
            }
            .receipt-table td {
                border: none;
                padding: 6px 10px 6px 0;
                vertical-align: top;
                text-align: left;
            }
            .label { width: 38%; font-weight: bold; font-size: 15px; color: #000; }
            .value { width: 62%; font-weight: bold; font-size: 15px; }
            .footer-note {
                margin-top: 0.2in;
                font-size: 10px;
                font-weight: bold;
                text-align: center;
                color: #333;
            }
        </style>
    </head>
    <body>
        <div class="content">
            <table class="receipt-table">
                <tr><td class="label">Receipt No</td><td class="value">${booking.receiptNo != null ? booking.receiptNo : (booking._id ? '#' + booking._id.slice(-6).toUpperCase() : 'N/A')}</td></tr>
                <tr><td class="label">Booking Date</td><td class="value">${bookingDateStr}</td></tr>
                <tr><td class="label">Name</td><td class="value">${booking.devoteeName || '—'}</td></tr>
                <tr><td class="label">Mobile No</td><td class="value">${booking.guestPhone || '—'}</td></tr>
                <tr><td class="label">Place Name</td><td class="value">${booking.place || '—'}</td></tr>
                <tr><td class="label">Gothram</td><td class="value">${booking.gothram || '—'}</td></tr>
                <tr><td class="label">Seva Name</td><td class="value">${sevaName || '—'}</td></tr>
                <tr><td class="label">Seva Date</td><td class="value">${sevaDateStr || '—'}</td></tr>
                <tr><td class="label">Amount Paid</td><td class="value">₹ ${booking.totalAmount != null ? booking.totalAmount : 0}</td></tr>
                <tr><td class="label">Paid Type</td><td class="value">${paidType}</td></tr>
            </table>
            <div class="footer-note">Computer Generated Receipt</div>
        </div>
        <script>
            window.onload = function () {
                window.print();
                window.onafterprint = function () { window.close(); };
            };
        </script>
    </body>
    </html>
    `;
    const w = window.open('', '_blank');
    if (w) {
        w.document.open();
        w.document.write(html);
        w.document.close();
    }
};

// Download Receipt as PDF (no print dialog)
const downloadReceipt = () => {
    if (!booking) return;

    const sevaName =
        booking.seva?.titleEn ||
        booking.seva?.title ||
        booking.seva?.titleKn ||
        '';

    const bookingDateStr = booking.createdAt
        ? new Date(booking.createdAt).toLocaleDateString()
        : new Date().toLocaleDateString();

    const sevaDateStr = booking.bookingDate
        ? new Date(booking.bookingDate).toLocaleDateString()
        : '—';

    const paidType =
        booking.paymentMode === 'upi'
            ? 'UPI'
            : booking.paymentMode === 'cash'
            ? 'Cash'
            : booking.paymentMode || '—';

    // IMPORTANT: absolute image URL for html2canvas
    const bgImage = `${window.location.origin}/images/Temple_Reciept.jpg`;

    const element = document.createElement('div');
    element.innerHTML = `
        <div style="
            width: 8.37in;
            height: 5.83in;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: url('${bgImage}') no-repeat center center;
            background-size: cover;
        ">
            <div style="
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                padding-top: 2.3in;
                padding-left: 0.4in;
                padding-right: 0.4in;
                padding-bottom: 0.3in;
            ">
                <table style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 15px;
                ">
                    <tr><td style="width:38%; font-weight:bold;">Receipt No</td><td style="width:62%; font-weight:bold;">${booking.receiptNo ?? '#' + booking._id.slice(-6).toUpperCase()}</td></tr>
                    <tr><td style="font-weight:bold;">Booking Date</td><td style="font-weight:bold;">${bookingDateStr}</td></tr>
                    <tr><td style="font-weight:bold;">Name</td><td style="font-weight:bold;">${booking.devoteeName || '—'}</td></tr>
                    <tr><td style="font-weight:bold;">Mobile No</td><td style="font-weight:bold;">${booking.guestPhone || '—'}</td></tr>
                    <tr><td style="font-weight:bold;">Place Name</td><td style="font-weight:bold;">${booking.place || '—'}</td></tr>
                    <tr><td style="font-weight:bold;">Gothram</td><td style="font-weight:bold;">${booking.gothram || '—'}</td></tr>
                    <tr><td style="font-weight:bold;">Seva Name</td><td style="font-weight:bold;">${sevaName}</td></tr>
                    <tr><td style="font-weight:bold;">Seva Date</td><td style="font-weight:bold;">${sevaDateStr}</td></tr>
                    <tr><td style="font-weight:bold;">Amount Paid</td><td style="font-weight:bold;">₹ ${booking.totalAmount ?? 0}</td></tr>
                    <tr><td style="font-weight:bold;">Paid Type</td><td style="font-weight:bold;">${paidType}</td></tr>
                </table>

                <div style="
                    margin-top: 0.2in;
                    text-align: center;
                    font-size: 10px;
                    font-weight: bold;
                    color: #333;
                ">
                    Computer Generated Receipt
                </div>
            </div>
        </div>
    `;

    html2pdf()
        .set({
            margin: 0,
            filename: `Receipt_${booking.receiptNo || booking._id}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: null
            },
            jsPDF: {
                unit: 'in',
                format: 'a5',
                orientation: 'landscape'
            }
        })
        .from(element)
        .save();
};






    if (!booking) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[2.5rem] shadow-xl max-w-2xl w-full text-center border border-orange-50">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short shadow-inner">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 font-serif">{t('bookings.success_title')}</h1>
                <p className="text-gray-500 mb-8 text-sm sm:text-base font-medium opacity-80">{t('bookings.success_subtitle')}</p>

                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 mb-8 text-left border border-gray-100">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-left">
                        <div className="text-[10px] sm:text-xs font-black text-gray-400 uppercase">{t('bookings.booking_id')}</div>
                        <div className="font-mono font-bold text-gray-900">{booking.receiptNo != null ? booking.receiptNo : '#' + booking._id.slice(-6).toUpperCase()}</div>

                        <div className="text-[10px] sm:text-xs font-black text-gray-400 uppercase">{t('admin.management.field_temple')}</div>
                        <div className="font-bold text-gray-900">{booking.seva?.templeNameEn || booking.seva?.templeName || booking.seva?.templeNameKn || 'Sri Kshetra Ramteertha'}</div>

                        <div className="text-[10px] sm:text-xs font-black text-gray-400 uppercase">{t('admin.sankalpa.col_seva')}</div>
                        <div className="font-bold text-gray-900">
                            {i18n.language === 'kn' ? (booking.seva?.titleKn || booking.seva?.titleEn || booking.seva?.title) : (booking.seva?.titleEn || booking.seva?.titleKn || booking.seva?.title)}
                        </div>

                        <div className="text-[10px] sm:text-xs font-black text-gray-400 uppercase">{t('bookings.gothram')}</div>
                        <div className="font-bold text-gray-900">{booking.gothram || '—'}</div>

                        <div className="text-[10px] sm:text-xs font-black text-gray-400 uppercase">Amount Paid</div>
                        <div className="font-black text-orange-600 text-lg sm:text-xl">₹{booking.totalAmount}</div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-6 py-4 bg-white text-gray-700 font-black rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm sm:text-base active:scale-95"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        {t('common.back_home')}
                    </Link>
                    <button
                        onClick={printReceipt}
                        className="inline-flex items-center justify-center px-6 py-4 bg-white text-gray-900 font-black rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm sm:text-base active:scale-95"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        {t('bookings.print_receipt')}
                    </button>
                    <button
                        onClick={downloadReceipt}
                        className="inline-flex items-center justify-center px-6 py-4 bg-white text-gray-900 font-black rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm sm:text-base active:scale-95"                    >
                        
                        Download Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
