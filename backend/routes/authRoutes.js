const express = require('express');
const { signup, verifyEmail, signin } = require('../controllers/authController');
const router = express.Router();
const passport = require('passport');

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/signin', signin);

// Redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback from Google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    // Send a JWT token if you want
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.redirect(`${process.env.CLIENT_URL}/google-success?token=${token}`);
  }
);

module.exports = router;
