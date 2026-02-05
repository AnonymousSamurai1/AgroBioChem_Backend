const express = require('express');
const router = express.Router();
const {
  getAllKeys,
  getKey,
  createKey,
  loginKey,
  updateKey,
  deleteKey,
} = require('../controllers/keyController');

router.route('/').get(getAllKeys).post(createKey);
router.route('/:id').get(getKey).put(updateKey).delete(deleteKey);
router.route('/login').post(loginKey);

module.exports = router;
