const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const { signToken } = require('../services/token.service');

function validationError(req) {
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(({ msg, path }) => ({ field: path, message: msg }));
}

async function register(req, res, next) {
  try {
    const errors = validationError(req);
    if (errors) return res.status(422).json({ message: 'Validation failed', errors });

    const { name, email, password, phone } = req.body;
    const existingUser = await User.findByEmail(email.toLowerCase());
    if (existingUser) return res.status(409).json({ message: 'An account with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash, phone });
    const token = signToken(user);
    return res.status(201).json({ message: 'Registration successful', token, user });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationError(req);
    if (errors) return res.status(422).json({ message: 'Validation failed', errors });

    const { email, password } = req.body;
    const user = await User.findByEmail(email.toLowerCase());
    const passwordIsValid = user && await bcrypt.compare(password, user.password_hash);
    if (!passwordIsValid) return res.status(401).json({ message: 'Invalid email or password.' });

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };
    return res.json({ message: 'Login successful', token: signToken(safeUser), user: safeUser });
  } catch (error) {
    return next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login, getProfile };

