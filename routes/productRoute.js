const express = require('express');
const router = express.Router();
const upload = require('../utils/multer'); 

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');


router.route('/')
  .get(getAllProducts)
  .post(upload.single('image'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(upload.single('image'), updateProduct) 
  .delete(deleteProduct);

module.exports = router;