const Keys = require('../models/keyModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.getAllKeys = async (req, res) => {
  try {
    const keys = await Keys.find().select('-password');
    if (!keys) {
      res.status(404).json({ success: false, msg: 'No key is found' });
    }
    res.status(200).json({ success: true, data: keys });
  } catch (err) {
    res.status(400).json({ success: false, msg: err });
  }
};
exports.getKey = async (req, res) => {
  try {
    const key = await Keys.findById(req.params.id).select('-password');
    if (!key) {
      res.status(404).json({ success: false, msg: 'No key is found' });
    }
    res.status(200).json({ success: true, data: key });
  } catch (err) {}
};

exports.createKey = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res
        .status(400)
        .json({ success: false, msg: 'Password is required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const key = await Keys.create({ email, password: hashedPassword });
    res.status(201).json({ success: true, msg: 'Admin created', key });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.loginKey = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: 'Password is required' });
    }
    const keys = await Keys.find();
    for (const key of keys) {
      const isMatch = bcrypt.compareSync(password, key.password);
      if (isMatch) {
        return res
          .status(200)
          .json({ success: true, message: 'Login successful' });
      } else {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid password' });
      }
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error: ', data: err });
  }
};

exports.updateKey = async (req, res) => {
  try {
    const key = await Keys.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!key) {
      return res.status(404).json({ success: false, msg: 'Key not found' });
    }
    res.status(200).json({ success: true, msg: 'Key updated', key });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Error updating Key', error });
  }
};

exports.deleteKey = async (req, res) => {
  try {
    const key = await Keys.findByIdAndDelete(req.params.id);
    if (!key) {
      return res.status(404).json({ success: false, msg: 'Admin not found' });
    }
    res
      .status(200)
      .json({
        success: true,
        msg: `Admin with id: ${req.params.id} deleted`,
        key,
      });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: 'Error deleting Admin', error });
  }
};
