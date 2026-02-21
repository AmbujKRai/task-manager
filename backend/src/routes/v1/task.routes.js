const router = require('express').Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../../controllers/taskController');
const { authenticate } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createTaskSchema, updateTaskSchema } = require('../../validators/taskValidator');

router.use(authenticate); // all task routes are protected

router.post('/', validate(createTaskSchema), createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;