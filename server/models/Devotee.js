const mongoose = require('mongoose');

const DevoteeSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  gothram: { type: String },
  state: { type: String },
  district: { type: String },
  taluk: { type: String },
  pincode: { type: String },
  place: { type: String },
  fullAddress: { type: String },
  totalAmountSpent: { type: Number, default: 0 },
  sevaCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Devotee', DevoteeSchema);
