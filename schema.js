const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().allow("", null),
        category: Joi.string().allow("", null).required(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
        review: Joi.object({
            comment: Joi.string().required(),
            rating: Joi.number().min(1).max(5).required(),
            date: Joi.date().allow(null),
        }).required(),
});