const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  fullname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  question: {
    type: String,
    require: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

questionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

questionSchema.set('toJSON', {
  virtuals: true,
});
module.exports = mongoose.model('Questions', questionSchema);
