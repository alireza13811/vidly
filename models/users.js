const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require("joi-password-complexity");

const UserSchema = new mongoose.Schema({
   name: {
       type: String,
       required: true,
       minLength: 5,
       maxLength: 50,
   },
   email: {
       type: String,
       required: true,
       unique: true,
       minLength: 5,
       maxLength: 255,
   },
   password: {
       type: String,
       required: true,
       minLength: 5,
       maxLength: 1024
   }
});

const User = mongoose.model('User', UserSchema);

function validateData(rental){
    const Schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        email: Joi.string().required().min(5).max(255).email(),
        password: PasswordComplexity()
    });
    return Schema.validate(rental);
}

exports.User = User;
exports.validate = validateData;