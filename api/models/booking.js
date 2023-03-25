const mongoose = require("mongoose");
const booking = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Place",
  },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  price: Number,
  maxGuest: Number,
});
const BookingModel = mongoose.model("Booking", booking);
module.exports = BookingModel;
