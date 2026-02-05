const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

adminSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

adminSchema.set('toJSON', {
  virtuals: true,
});
module.exports = mongoose.model('Admins', adminSchema);
