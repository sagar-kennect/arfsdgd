const { Schema, model } = require('mongoose');

const doctorSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  specialty: String,
  clinics: [],
});

const Doctor = model('Doctor', doctorSchema);

module.exports = {
  Doctor,
};
