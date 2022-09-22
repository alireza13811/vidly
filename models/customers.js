const mongoose = require('mongoose');
const Joi = require('joi');

const CustomersSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        minLength:3,
        maxLength: 50
    },
    phone: {
        type: String,
        required:true,
        minLength:8,
        maxLength: 10
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

const Customer = mongoose.model('Customer', CustomersSchema);

function validateData(genre){
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(50),
        phone: Joi.string().required().min(8).max(10),
        isGold: Joi.boolean()
    });
    return schema.validate(genre);
}

exports.Customer = Customer;
exports.validate = validateData;
