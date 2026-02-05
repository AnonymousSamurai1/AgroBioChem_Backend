const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    if (!admins) {
      return res
        .status(404)
        .json({ success: false, msg: 'No Admin was found' });
    }
    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        msg: `Admin not found with id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { fullname, dob, gender, location, contact, email, password } =
      req.body;

    if (
      !fullname ||
      !dob ||
      !gender ||
      !location ||
      !contact ||
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({ success: false, msg: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      fullname,
      dob,
      gender,
      location,
      contact,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ success: true, msg: 'Admin created', admin });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(400).json({ success: false, message: error.message });
    console.log(error);
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Password is required' });
    }
    const admins = await Admin.find();
    for (const admin of admins) {
      if (admin.email === email) {
        const isMatch = bcrypt.compareSync(password, admin.password);
        if (isMatch) {
          return res.status(200).json({
            success: true,
            message: 'Login successful',
            admin: {
              id: admin._id,
              email: admin.email,
              fullname: admin.fullname,
            },
          });
        }
      }
    }
    res.status(401).json({ success: false, message: 'Invalid password' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!admin) {
      return res.status(404).json({ success: false, msg: 'Admin not found' });
    }
    res.status(200).json({ success: true, msg: 'Admin updated', admin });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: 'Error updating Admin', error });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, msg: 'Admin not found' });
    }
    res.status(200).json({
      success: true,
      msg: `Admin with id: ${req.params.id} deleted`,
      admin,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: 'Error deleting Admin', error });
  }
};
