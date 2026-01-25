import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft,  Clock,  MapPin,  ShieldCheck,  Loader2,} 
from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import SankalpaForm from "../components/booking/SankalpaForm";
import PricingWidget from "../components/booking/PricingWidget";
import UPILayer from "../components/booking/UPILayer";
import api from "../utils/api";

const SevaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;

  const [seva, setSeva] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUPI, setShowUPI] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    gothram: "",
    rashi: "",
    nakshatra: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    guestPhone: false,
  });

  // Date State
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Pricing State
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchSeva = async () => {
      try {
        const { data } = await api.get(`/sevas/${id}`);
        if (!data) {
          toast.error("Seva details not found");
          navigate("/sevas");
          return;
        }
        setSeva(data);
      } catch (error) {
        toast.error("Failed to load seva details");
        navigate("/sevas");
      } finally {
        setLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings", error);
      }
    };

    const savedData = sessionStorage.getItem("prefill_booking");
    if (savedData) {
      try {
        setFormData((prev) => ({
          ...prev,
          ...JSON.parse(savedData),
        }));
        sessionStorage.removeItem("prefill_booking");
      } catch (err) {
        console.error(err);
      }
    }

    if (id) {
      fetchSeva();
      fetchSettings();
    }
  }, [id, navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handlePayment = async () => {
    if (!formData.name || (!isAuthenticated && !formData.guestPhone)) {
      setErrors({
        name: !formData.name,
        guestPhone: !isAuthenticated && !formData.guestPhone,
      });
      toast.error("Please fill mandatory fields");
      return;
    }

    setIsBooking(true);

    try {
      const bookingData = {
        sevaId: id,
        devoteeName: formData.name,
        gothram: formData.gothram,
        rashi: formData.rashi,
        nakshatra: formData.nakshatra,
        bookingType: count > 1 ? "family" : "individual",
        count,
        totalAmount: total,
        guestName: formData.guestName || formData.name,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        bookingDate: selectedDate,
      };

      const { data } = await api.post("/bookings", bookingData);

      const options = {
        key: data.razorpayKey,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: "Shree Kshetra Ramtirtha",
        description: `Seva: ${
          currentLang === "kn" ? seva.titleKn : seva.titleEn
        }`,
        order_id: data.razorpayOrder.id,
        handler: () => {
          toast.success("Payment Successful!");
          navigate("/booking-success", {
            state: { booking: data.booking },
          });
        },
        prefill: {
          name: formData.name,
          contact: formData.guestPhone,
          email: formData.guestEmail,
        },
        theme: { color: "#ea580c" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      toast.error("Payment failed to initiate");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (!seva) {
    return <div className="text-center py-20">Seva not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* UI trimmed for brevity – logic remains unchanged */}
    </div>
  );
};

export default SevaDetails;
