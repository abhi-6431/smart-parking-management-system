const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const vehicleRoutes = require('./vehicle.routes');
const slotRoutes = require('./slot.routes');
const bookingRoutes = require('./booking.routes');
const sessionRoutes = require('./session.routes');
const paymentRoutes = require('./payment.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok', service: 'smart-parking-api' }));
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/slots', slotRoutes);
router.use('/bookings', bookingRoutes);
router.use('/sessions', sessionRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
