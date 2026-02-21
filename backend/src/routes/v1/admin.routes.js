const router = require('express').Router();
const { getAllUsers } = require('../../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../../middleware/auth');

router.use(authenticate, authorizeAdmin);
router.get('/users', getAllUsers);

module.exports = router;