const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Require admin role
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Require staff role (or admin)
const requireStaff = (req, res, next) => {
    if (req.user.role !== 'Staff' && req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Staff access required' });
    }
    next();
};

// Check department access
const checkDepartmentAccess = (req, res, next) => {
    // Admins can access all departments
    if (req.user.role === 'Admin') {
        return next();
    }

    // Staff can only access their own department
    const requestedDepartment = req.body.department || req.query.department;

    if (requestedDepartment && requestedDepartment !== req.user.department) {
        return res.status(403).json({ error: 'Access denied to this department' });
    }

    next();
};

module.exports = {
    authenticate,
    requireAdmin,
    requireStaff,
    checkDepartmentAccess
};
