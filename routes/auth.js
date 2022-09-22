const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {User} = require('../models/users');
const express = require('express');
const bcrypt = require("bcrypt");
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
const router = express.Router();
const config = require('config');

router.post('/', async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
});

function validate(request){
    const Schema = Joi.object({
        email: Joi.string().required().min(5).max(255).email(),
        password: PasswordComplexity()
    });
    return Schema.validate(request);
}


module.exports = router;
