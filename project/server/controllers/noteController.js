const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).populate('category');
  res.json(notes);
};

exports.createNote = async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    isBookmarked: req.body.isBookmarked,
    category: req.body.category,
    user: req.user._id
  });

  const saved = await note.save();
  const populated = await saved.populate('category'); 
  
  res.status(201).json(populated);
};

exports.updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );

  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
};

exports.deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Note deleted' });
};

exports.toggleBookmark = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

  if (!note) return res.status(404).json({ message: "Note not found" });

  note.isBookmarked = !note.isBookmarked;
  await note.save();
  res.json(note);
};