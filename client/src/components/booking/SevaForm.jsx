import React, { useEffect, useState } from 'react';
import { Clock, BookOpen, User, Phone, MapPin, Hash, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Comprehensive Data for Karnataka and Maharashtra
const STATES_DATA = [
    { 
        name: "Karnataka", 
        districts: ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"] 
    },
    { 
        name: "Maharashtra", 
        districts: ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"] 
    }
];

const SevaForm = ({ 
    formData, 
    handleChange, 
    selectedDate, 
    setSelectedDate, 
    sevas = [], 
    errors = {} 
}) => {
    const { t } = useTranslation();
    const today = new Date().toISOString().split('T')[0];
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        // Default logic for Karnataka initialization
        if (!selectedDate) setSelectedDate(today);
        const karnataka = STATES_DATA.find(s => s.name === "Karnataka");
        setDistricts(karnataka ? karnataka.districts : []);
    }, []);

    const handleStateChange = (e) => {
        const stateName = e.target.value;
        const selectedState = STATES_DATA.find(s => s.name === stateName);
        setDistricts(selectedState ? selectedState.districts : []);
        handleChange(e); 
    };

    return (
        <div className="bg-orange-50 p-4 sm:p-6 rounded-2xl border border-orange-100">
            <h3 className="text-lg font-black text-orange-800 mb-5 flex items-center">
                <span className="w-1.5 h-6 bg-orange-600 mr-3 rounded-full shadow-sm shadow-orange-200"></span>
                Seva Registration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* ROW 1: Seva Name Dropdown & Date (Mandatory) */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Seva Offering *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BookOpen className="h-4 w-4 text-orange-600" />
                        </div>
                        <select
                            name="sevaId"
                            value={formData.sevaId}
                            onChange={handleChange}
                            className={`w-full pl-10 px-4 py-3 border rounded-xl outline-none text-sm font-bold bg-white shadow-sm transition-all appearance-none ${errors.sevaId ? 'border-red-500' : 'border-gray-200'}`}
                            required
                        >
                            <option value="">Select Seva</option>
                            {sevas.map(s => (
                                <option key={s._id} value={s._id}>{s.titleEn} (₹{s.price})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Seva Date *</label>
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
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Mobile Number *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-orange-600" />
                        </div>
                        <input
                            type="tel"
                            name="guestPhone"
                            value={formData.guestPhone}
                            onChange={handleChange}
                            placeholder="10-digit mobile"
                            className={`w-full pl-10 px-4 py-3 border rounded-xl outline-none text-sm font-bold bg-white ${errors.guestPhone ? 'border-red-500' : 'border-gray-200'}`}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Full Name *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-orange-600" />
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className={`w-full pl-10 px-4 py-3 border rounded-xl outline-none text-sm font-bold bg-white ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                            required
                        />
                    </div>
                </div>

                {/* ROW 3: State & District Dropdown (Optional) */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">State</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-orange-600" />
                        </div>
                        <select
                            name="state"
                            value={formData.state || "Karnataka"}
                            onChange={handleStateChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none text-sm font-bold"
                        >
                            {STATES_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">District</label>
                    <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none text-sm font-bold"
                    >
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                {/* ROW 4: Taluk & Pincode (Optional) */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Taluk</label>
                    <input
                        type="text"
                        name="taluk"
                        value={formData.taluk}
                        onChange={handleChange}
                        placeholder="Enter Taluk"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none text-sm font-bold"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Pincode</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Hash className="h-4 w-4 text-orange-600" />
                        </div>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="6-digit PIN"
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm font-bold bg-white"
                        />
                    </div>
                </div>

                {/* ROW 5: Place & Address (Optional) */}
                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Place (Village/Town)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-4 w-4 text-orange-600" />
                        </div>
                        <input
                            type="text"
                            name="place"
                            value={formData.place}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm font-bold bg-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-orange-600/70 uppercase tracking-[0.2em] mb-2">Full Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm font-bold bg-white"
                    />
                </div>
            </div>
        </div>
    );
};

export default SevaForm;