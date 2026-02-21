const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');

module.exports = { sequelize, User, Task };