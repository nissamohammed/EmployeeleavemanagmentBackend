const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'leave_management_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

module.exports = { generateToken, JWT_SECRET };
