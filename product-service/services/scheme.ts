import Joi from 'joi';

export const productScheme = Joi.object().keys({
    id: Joi.any().optional(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    size: Joi.string().required(),
    color: Joi.string().required(),
    gender: Joi.string().required(),
    price: Joi.number().optional(),
    count: Joi.number().required()
});
