const { Task } = require('../models');

exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, user_id: req.user.id });
    res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const where = req.user.role === 'admin' ? {} : { user_id: req.user.id };
    const tasks = await Task.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (task.user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Forbidden' });

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (task.user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Forbidden' });

    await task.update(req.body);
    res.json({ success: true, message: 'Task updated', data: task });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (task.user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Forbidden' });

    await task.destroy();
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};