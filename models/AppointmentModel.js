const { Schema, model } = require('mongoose');

const appointmentSchema = new Schema({
  doctor: String,
  patient_name: String,
  patient_email: String,
  patient_phone: String,
  clinic: String,
  appointment_time: Date,
  status: String,
});

const Appointment = model('Appointment', appointmentSchema);

module.exports = {
  Appointment,
};
