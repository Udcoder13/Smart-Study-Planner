const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (err) {
    console.error('[GET CATEGORIES] Error:', err);
    res.status(500).json({ message: 'Failed to load categories', error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  console.log('[CREATE CATEGORY] Request body:', req.body);
  try {
    const { name, description, icon, color, totalTopics } = req.body;
    const category = new Category({
      name,
      description,
      icon,
      color,
      totalTopics,
      user: req.user._id
    });
    const saved = await category.save();
    console.log('[CREATE CATEGORY] Saved:', saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error('[CREATE CATEGORY] Error:', err);
    res.status(500).json({ message: 'Failed to create category', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );

  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Deleted' });
};
