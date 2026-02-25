const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  categoryType: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  ingredient: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Product', productSchema);