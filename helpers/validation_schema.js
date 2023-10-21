const Joi = require("joi");

const docSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  manufacturer: Joi.string().allow(""),
  model: Joi.string().allow(""),
  docType: Joi.string().required(),
  description: Joi.string().required(),
  URL: Joi.string().uri().required(),
  dateAdded: Joi.date().required(),
  user: Joi.string().required(),
});

const idSchema = Joi.object({
  _id: Joi.string().required().length(24)
})

module.exports = {
  docSchema,
  idSchema
};
