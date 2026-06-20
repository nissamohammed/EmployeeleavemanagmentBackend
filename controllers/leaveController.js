const leaveService = require('../services/leaveService');

exports.applyLeaveController = async (req, res) => {
    try {
        const { fromDate, toDate, leaveType, description } = req.body;

        if (!fromDate || !toDate || !leaveType || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const leave = await leaveService.applyLeave(req.user, { fromDate, toDate, leaveType, description });
        res.status(201).json(leave);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMyLeavesController = async (req, res) => {
    try {
        const { page, limit, status, search } = req.query;
        const result = await leaveService.getMyLeaves(req.user._id, { page, limit, status, search });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllLeavesController = async (req, res) => {
    try {
        const { page, limit, status, search } = req.query;
        const result = await leaveService.getAllLeaves({ page, limit, status, search });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateLeaveStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const leave = await leaveService.updateLeaveStatus(id, status);
        res.status(200).json(leave);
    } catch (error) {
        const statusCode = error.message === 'Leave application not found' ? 404 : 400;
        res.status(statusCode).json({ error: error.message });
    }
};

exports.getStatsController = async (req, res) => {
    try {
        const userId = req.user.role === 'Employee' ? req.user._id : null;
        const stats = await leaveService.getLeaveStats(userId);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
