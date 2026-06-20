const express = require('express');
const authRoutes = require('./authRoutes');
const leaveRoutes = require('./leaveRoutes');

const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/leaves', leaveRoutes);

module.exports = router;
