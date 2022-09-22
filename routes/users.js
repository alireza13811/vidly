const _ = require('lodash');
const {User, validate} = require('../models/users');
const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();

router.post('/', async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered.');

    user = await createUser(req.body);
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

async function createUser(data){
    const user = new User(_.pick(data, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash('1234', salt);
    try{
        await user.save();
        return user
    }catch (exp){
        for(let field in exp.errors){
            console.log(exp.errors[field].message);
        }
    }
}

module.exports = router;
