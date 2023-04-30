const { Schema, model } = require('mongoose');

const clinicSchema = new Schema({
  name: String,
  address: String,
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  owner: {
    type: String,
    unique: true,
    required: true,
  },
  helper: {
    type: String,
    required: true,
  },
  doctors: [],
});

const Clinic = model('Clinic', clinicSchema);

module.exports = {
  Clinic,
};
