const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const transporter = require('../config/nodemailer');
const validator = require('validator');

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email' });
  if (!validator.isStrongPassword(password)) return res.status(400).json({ error: 'Weak password' });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
      from: `"Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification',
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
    });

    res.status(200).json({ message: 'Verification email sent' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(decoded.password, 10);

    const existing = await User.findOne({ email: decoded.email });
    if (existing) return res.status(400).json({ error: 'User already verified' });

    await User.create({ email: decoded.email, password: hashedPassword, isVerified: true });
    res.status(201).json({ message: 'Email verified. User created.' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (!user.isVerified) return res.status(403).json({ error: 'Email not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Signed in successfully', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
