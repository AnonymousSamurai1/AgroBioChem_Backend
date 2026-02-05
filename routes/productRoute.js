const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  uploadSingle,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.route('/').get(getAllProducts).post(uploadSingle).post(createProduct);
router
  .route('/:id')
  .get(getProduct)
  .put(uploadSingle)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
