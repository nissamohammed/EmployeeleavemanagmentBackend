const Leave = require('../models/leaveModel');
const { validateLeaveRequest, datesOverlap } = require('../utils/leaveValidation');

const applyLeave = async (user, { fromDate, toDate, leaveType, description }) => {
    const validation = validateLeaveRequest(fromDate, toDate);
    if (!validation.valid) {
        throw new Error(validation.message);
    }

    const existingLeaves = await Leave.find({
        employee: user._id,
        status: { $in: ['Pending', 'Approved'] }
    });

    const hasOverlap = existingLeaves.some((leave) =>
        datesOverlap(fromDate, toDate, leave.fromDate, leave.toDate)
    );

    if (hasOverlap) {
        throw new Error('You already have an overlapping leave request for these dates');
    }

    const newLeave = new Leave({
        employee: user._id,
        employeeName: user.name,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        leaveType,
        description,
        status: 'Pending'
    });

    await newLeave.save();
    return newLeave;
};

const getMyLeaves = async (userId, { page = 1, limit = 5, status, search }) => {
    const query = { employee: userId };

    if (status) query.status = status;
    if (search) query.employeeName = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [leaves, total] = await Promise.all([
        Leave.find(query).sort({ appliedDate: -1 }).skip(skip).limit(Number(limit)),
        Leave.countDocuments(query)
    ]);

    return {
        leaves,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) }
    };
};

const getAllLeaves = async ({ page = 1, limit = 5, status, search }) => {
    const query = {};

    if (status) query.status = status;
    if (search) query.employeeName = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [leaves, total] = await Promise.all([
        Leave.find(query).populate('employee', 'name email role').sort({ appliedDate: -1 }).skip(skip).limit(Number(limit)),
        Leave.countDocuments(query)
    ]);

    return {
        leaves,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) }
    };
};

const updateLeaveStatus = async (leaveId, status) => {
    if (!['Approved', 'Rejected'].includes(status)) {
        throw new Error('Status must be Approved or Rejected');
    }

    const leave = await Leave.findById(leaveId);
    if (!leave) {
        throw new Error('Leave application not found');
    }

    if (leave.status !== 'Pending') {
        throw new Error('Only pending leave requests can be updated');
    }

    leave.status = status;
    await leave.save();
    return leave;
};

const getLeaveStats = async (userId = null) => {
    const matchStage = userId ? { employee: userId } : {};

    const stats = await Leave.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const result = { pending: 0, approved: 0, rejected: 0, total: 0 };
    stats.forEach((s) => {
        const key = s._id.toLowerCase();
        if (result[key] !== undefined) result[key] = s.count;
        result.total += s.count;
    });

    return result;
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus,
    getLeaveStats
};
