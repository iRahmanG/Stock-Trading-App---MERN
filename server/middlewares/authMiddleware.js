const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request
            req.user = await User.findById(decoded.id).select('-password');

            // NEW SECURITY CHECK: If user is banned, block them immediately
            if (req.user && req.user.status === 'Suspended') {
                return res.status(403).json({ message: "Access denied. Account suspended." });
            }

            next(); // Only call next() once inside the try block
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        // If no token at all, return error
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };