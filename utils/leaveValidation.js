const calculateLeaveDays = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);
    const diffTime = to.getTime() - from.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const datesOverlap = (from1, to1, from2, to2) => {
    const start1 = new Date(from1).setHours(0, 0, 0, 0);
    const end1 = new Date(to1).setHours(0, 0, 0, 0);
    const start2 = new Date(from2).setHours(0, 0, 0, 0);
    const end2 = new Date(to2).setHours(0, 0, 0, 0);
    return start1 <= end2 && start2 <= end1;
};

const validateLeaveRequest = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        return { valid: false, message: 'Invalid date format' };
    }

    if (from > to) {
        return { valid: false, message: 'From date cannot be greater than to date' };
    }

    const days = calculateLeaveDays(from, to);
    if (days > 10) {
        return { valid: false, message: 'Leave days cannot exceed 10 days' };
    }

    return { valid: true, days };
};

module.exports = { calculateLeaveDays, datesOverlap, validateLeaveRequest };
