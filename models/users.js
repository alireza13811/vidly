const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

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
   },
   isAdmin: Boolean
});

UserSchema.methods.generateAuthToken = function (){
    return jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'));
}

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