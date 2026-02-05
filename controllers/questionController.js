const Question = require('../models/questionModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    if (!questions) {
      return res
        .status(404)
        .json({ success: false, msg: 'No Question was found' });
    }
    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        msg: `Question not found with id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res
      .status(201)
      .json({ success: true, msg: 'Question created successfully', question});
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, msg: 'Question not found' });
    }
    res.status(200).json({
      success: true,
      msg: `Question with id: ${req.params.id} deleted`,
      question,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: 'Error deleting Question', error });
  }
};
