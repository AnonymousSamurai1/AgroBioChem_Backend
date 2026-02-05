const express = require('express');
const router = express.Router();
const {
  getAllAdmins,
  getAdmin,
  createAdmin,
  loginAdmin,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/adminController');

router.route('/').get(getAllAdmins).post(createAdmin);
router.route('/:id').get(getAdmin).put(updateAdmin).delete(deleteAdmin);
router.route('/login').post(loginAdmin)


module.exports = router;
