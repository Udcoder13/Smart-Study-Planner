const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Category = require('../models/Category');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });

  // Insert default categories for this user
  await Category.insertMany([
    {
      name: 'Data Structures & Algorithms',
      description: 'Master problem-solving with efficient algorithms',
      icon: 'Code2',
      color: 'from-indigo-500 to-purple-600',
      totalTopics: 25,
      user: user._id
    },
    {
      name: 'Development',
      description: 'Build modern web and mobile applications',
      icon: 'Monitor',
      color: 'from-purple-500 to-pink-600',
      totalTopics: 30,
      user: user._id
    },
    {
      name: 'System Design',
      description: 'Design scalable and reliable systems',
      icon: 'Network',
      color: 'from-emerald-500 to-teal-600',
      totalTopics: 20,
      user: user._id
    }
  ]);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
