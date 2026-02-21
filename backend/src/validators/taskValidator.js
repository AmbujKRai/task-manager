const Joi = require('joi');

exports.createTaskSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().optional().allow(''),
  status: Joi.string().valid('pending', 'in-progress', 'done').optional()
});

exports.updateTaskSchema = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().optional().allow(''),
  status: Joi.string().valid('pending', 'in-progress', 'done').optional()
});