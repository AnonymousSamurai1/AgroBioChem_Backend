const mongoose = require('mongoose');

const keySchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

keySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

keySchema.set('toJSON', {
  virtuals: true,
});
module.exports = mongoose.model('Keys', keySchema);
