const User = require('../models/User');
console.log('User model:', User);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP
const signup = async (req, res) => {
  console.log('Request body:', req.body);  // add this
  try {
    const { name, email, password, role } = req.body; // pull data from request

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // hash the password — 10 is the salt rounds (how complex the hash is)
    const hashedPassword = await bcrypt.hash(password, 10);

    // create and save the new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User created successfully', userId: user._id });

} catch (error) {
  console.log('SIGNUP ERROR:', error);
  res.status(500).json({ message: 'Server error', error: error.message });
}
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // create JWT token — expires in 7 days
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // payload stored inside token
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { signup, login };