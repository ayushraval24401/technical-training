import Joi = require("joi");

export const registerValidator = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  confirm_password: Joi.string().required().valid(Joi.ref("password")),
});

export const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const companyValidator = Joi.object({
  name: Joi.string().required(),
});

export const reportTypeValidator = Joi.object({
  name: Joi.string().required(),
});

export const templateValidator = Joi.object({
  name: Joi.string().required(),
  companies: Joi.array().required(),
  report: Joi.string().required(),
});
