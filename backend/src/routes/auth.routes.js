const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters.'),
    body('email').trim().isEmail().normalizeEmail().withMessage('A valid email is required.'),
    body('password').isLength({ min: 8, max: 72 }).withMessage('Password must be 8-72 characters.'),
    body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 20 }).withMessage('Phone must be at most 20 characters.')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('A valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.')
  ],
  login
);

router.get('/me', authenticate, getProfile);

module.exports = router;

