const express = require('express');
const router = express.Router();
const {
  getAllQuestions,
  getQuestion,
  createQuestion,
  deleteQuestion,
} = require('../controllers/questionController');

router.route('/').get(getAllQuestions).post(createQuestion);
router.route('/:id').get(getQuestion).delete(deleteQuestion);


module.exports = router;
