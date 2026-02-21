const { User } = require('../models');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};