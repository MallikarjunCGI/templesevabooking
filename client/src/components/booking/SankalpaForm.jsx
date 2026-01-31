import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, BookOpen, User, Phone, MapPin, Hash, Building2, CreditCard, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const STATES_DATA = [
    { 
        name: "Karnataka", 
        districts: ["Belagavi", "Bagalkot", "Ballari", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"] 
    },
    { 
        name: "Maharashtra", 
        districts: ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"] 
    }
];

const SankalpaForm = ({ 
    formData, 
    handleChange, 
    selectedDate, 
    setSelectedDate, 
    sevas = [], 
    errors = {} 
}) => {
    const { t } = useTranslation();
    const location = useLocation();
    const today = new Date().toISOString().split('T')[0];
    const [districts, setDistricts] = useState([]);

    const handleNumericInput = (name, value, maxLen = 999) => {
        const cleaned = (value || '').replace(/\D/g, '').slice(0, maxLen);
        handleChange({ target: { name, value: cleaned } });
    };

useEffect(() => {
    // 1. Only set date if it doesn't exist
    if (!selectedDate) {
        setSelectedDate(today);
    }

    // 2. Only handle Seva pre-selection if sevaId is currently empty
    if (sevas.length > 0 && !formData.sevaId) {
        const passedId = location.state?.selectedSevaId;
        const targetId = passedId || sevas[0]._id;
        handleChange({ target: { name: 'sevaId', value: targetId } });
    }

    // 3. IMPORTANT: Only set location defaults if they are MISSING
    // Also ensure the `districts` local state is populated for the chosen state
    if (!formData.state || !formData.district || !formData.taluk) {
        const mockEvent = (name, val) => ({ target: { name, value: val } });

        const defaultState = formData.state || 'Karnataka';
        const selectedStateObj = STATES_DATA.find(s => s.name === defaultState);
        if (selectedStateObj) {
            setDistricts(selectedStateObj.districts);
        }

        if (!formData.state) handleChange(mockEvent('state', defaultState));
        if (!formData.district) handleChange(mockEvent('district', (selectedStateObj && selectedStateObj.districts[0]) || 'Belagavi'));
        if (!formData.taluk) handleChange(mockEvent('taluk', 'Athani'));
        if (!formData.paymentMode) handleChange(mockEvent('paymentMode', 'upi'));
    }
}, [sevas.length, location.state, formData.state]); // Only depend on specific values

// Ensure districts are populated whenever the state value changes (covers redirects/prefill)
useEffect(() => {
    const stateName = formData.state || 'Karnataka';
    const selectedState = STATES_DATA.find(s => s.name === stateName);
    if (selectedState) {
        setDistricts(selectedState.districts);
        if (!formData.district) {
            handleChange({ target: { name: 'district', value: selectedState.districts[0] } });
        }
    } else {
        setDistricts([]);
    }
}, [formData.state]);

    const handleStateUpdate = (e) => {
        const stateName = e.target.value;
        const selectedState = STATES_DATA.find(s => s.name === stateName);
        setDistricts(selectedState ? selectedState.districts : []);
        handleChange(e);
        
        // Reset district to first available in new state
        if (selectedState && selectedState.districts.length > 0) {
            handleChange({ target: { name: 'district', value: selectedState.districts[0] } });
        }
    };

    return (
        <div className="bg-orange-50 p-4 sm:p-6 rounded-2xl border border-orange-100">
            <h3 className="text-lg font-black text-orange-800 mb-5 flex items-center">
                <span className="w-1.5 h-6 bg-orange-600 mr-3 rounded-full shadow-sm shadow-orange-200"></span>
                {t('sankalpa.title', 'Seva Registration')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* ROW 1: Seva Name & Date (Mandatory) */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Seva Name *</label>
                            <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BookOpen className="h-4 w-4 text-orange-600" />
                            </div>
                            <select
                                name="sevaId"
                                value={formData.sevaId ?? ''}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-10 px-4 py-3 border rounded-xl outline-none text-sm font-bold bg-white shadow-sm transition-all appearance-none ${errors.sevaId ? 'border-red-500' : 'border-gray-200'}`}
                                required
                            >
                                <option value="">{t('sankalpa.label_seva_name')}</option>
                                {sevas.map(s => (
                                    <option key={s._id} value={s._id}>{s.titleEn} (₹{s.price})</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.label_seva_date')} *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <input
                            type="date"
                            value={selectedDate || today}
                            min={today}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm font-bold bg-white shadow-sm"
                            required
                        />
                    </div>
                </div>

                {/* ROW 2: Mobile Number & Full Name (Mandatory) */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.label_mobile')} *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-orange-600" />
                        </div>
                        <input
                            type="tel"
                            name="guestPhone"
                            value={formData.guestPhone ?? ''}
                            onChange={(e) => handleNumericInput('guestPhone', e.target.value, 10)}
                            placeholder={t('sankalpa.placeholder_10_digit')}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                            className={`w-full pl-10 px-4 py-3 border rounded-xl outline-none text-sm font-bold bg-white ${errors.guestPhone ? 'border-red-500' : 'border-gray-200'}`}
                            required
                        />
                        {errors.guestPhone && (
                            <p className="text-sm text-red-600 mt-1">{t('sankalpa.error_phone')}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.label_full_name')} *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-orange-600" />
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name ?? ''}
                            onChange={handleChange}
                            placeholder={t('sankalpa.placeholder_devotee_name')}
                            className={`w-full pl-10 px-4 py-3 border rounded-xl outline-none text-sm font-bold bg-white ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                            required
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">{t('sankalpa.error_name')}</p>
                        )}
                    </div>
                </div>

                {/* Gothram (optional) */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.gothram')}</label>
                    <input
                        type="text"
                        name="gothram"
                        value={formData.gothram ?? ''}
                        onChange={handleChange}
                        placeholder={t('sankalpa.gothram')}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm font-bold bg-white"
                    />
                </div>

                {/* ROW 3: State & District */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.label_state')}</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-orange-600" />
                        </div>
                        <select
                            name="state"
                            value={formData.state || "Karnataka"}
                            onChange={handleStateUpdate}
                            className="w-full pl-10 pr-10 px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none text-sm font-bold appearance-none"
                        >
                            {STATES_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.label_district')}</label>
                    <div className="relative">
                        <select
                            name="district"
                            value={formData.district ?? ''}
                            onChange={handleChange}
                            className="w-full pr-10 px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none text-sm font-bold appearance-none"
                        >
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* ROW 4: Taluk & Pincode */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.label_taluk')}</label>
                    <input
                        type="text"
                        name="taluk"
                        value={formData.taluk ?? ''}
                        onChange={handleChange}
                        placeholder="Enter Taluk"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none text-sm font-bold"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.label_pincode')}</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Hash className="h-4 w-4 text-orange-600" />
                        </div>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode ?? ''}
                            onChange={(e) => handleNumericInput('pincode', e.target.value, 6)}
                            placeholder={t('sankalpa.placeholder_10_digit')}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm font-bold bg-white"
                        />
                        {errors.pincode && (
                            <p className="text-sm text-red-600 mt-1">{t('sankalpa.error_pincode')}</p>
                        )}
                    </div>
                </div>

                {/* ROW 5: Place & Address */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.label_place')}</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-4 w-4 text-orange-600" />
                        </div>
                        <input
                            type="text"
                            name="place"
                            value={formData.place ?? ''}
                            onChange={handleChange}
                            placeholder={t('sankalpa.placeholder_village_name')}
                            maxLength={100}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm font-bold bg-white"
                        />
                        {errors.place && (
                            <p className="text-sm text-red-600 mt-1">{t('sankalpa.error_place')}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">{t('sankalpa.label_address')}</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address ?? ''}
                        onChange={handleChange}
                        placeholder={t('sankalpa.placeholder_address')}
                        maxLength={250}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm font-bold bg-white"
                    />
                    {errors.address && (
                        <p className="text-sm text-red-600 mt-1">{t('sankalpa.error_address')}</p>
                    )}
                </div>

                {/* ROW 6: Payment Mode */}
                <div className="md:col-span-2 pt-4 border-t border-orange-100 mt-2">
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-4 text-center font-bold">{t('sankalpa.label_payment_mode')}</label>
                    <div className="flex justify-center gap-6">
                        {['upi', 'cash'].map((mode) => (
                            <label key={mode} className={`flex items-center gap-2 px-6 py-3 rounded-2xl cursor-pointer border-2 transition-all ${formData.paymentMode === mode ? 'border-orange-600 bg-orange-100' : 'border-gray-200 bg-white'}`}>
                                <input 
                                    type="radio" 
                                    name="paymentMode" 
                                    value={mode} 
                                    checked={formData.paymentMode === mode} 
                                    onChange={handleChange} 
                                    className="hidden" 
                                />
                                <CreditCard className={`w-4 h-4 ${formData.paymentMode === mode ? 'text-orange-600' : 'text-gray-400'}`} />
                                <span className={`text-sm font-black uppercase tracking-widest ${formData.paymentMode === mode ? 'text-orange-600' : 'text-gray-500'}`}>
                                    {t(`sankalpa.${mode}`) || mode}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SankalpaForm;