const { celebrate, Joi, Segments } = require('celebrate');

const signupValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(1).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signinValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  signupValidation,
  signinValidation,
};
