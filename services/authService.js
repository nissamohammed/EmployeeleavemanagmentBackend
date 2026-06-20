const User = require('../models/userModel');
const { generateToken } = require('../utils/jwtUtils');

const registerUser = async ({ name, email, password, role }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const validRole = role === 'Manager' ? 'Manager' : 'Employee';
    const user = new User({ name, email, password, role: validRole });
    await user.save();

    const token = generateToken(user);
    return {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
    };
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken(user);
    return {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
    };
};

module.exports = { registerUser, loginUser };
