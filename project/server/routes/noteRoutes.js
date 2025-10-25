const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  toggleBookmark
} = require('../controllers/noteController');

router.get('/', protect, getNotes);
router.post('/', protect, createNote);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);
router.patch('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
