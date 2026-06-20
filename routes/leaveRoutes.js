const express = require('express');
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', roleMiddleware('Employee'), leaveController.applyLeaveController);
router.get('/my-leaves', roleMiddleware('Employee'), leaveController.getMyLeavesController);
router.get('/stats', leaveController.getStatsController);
router.get('/', roleMiddleware('Manager'), leaveController.getAllLeavesController);
router.patch('/:id/status', roleMiddleware('Manager'), leaveController.updateLeaveStatusController);

module.exports = router;
