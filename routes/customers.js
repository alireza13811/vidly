const mongoose = require('mongoose');
const Joi = require("joi");
const express = require('express');
const router = express.Router();

const GenresSchema = new mongoose.Schema({
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
})

const Customer = mongoose.model('Customer ', GenresSchema);

router.get('/', async (req, res)=>{
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req,res)=>{
    try{
        const customer = await Customer.findById(req.params.id);
        res.send(customer);
    }catch (exp){
        return res.status(404).send('Customer with that ID not found!');
    }
});

router.post('/', async (req, res)=>{
    const {error} = validateData(req.body);
    if(error) return res.status(400).send(error.message);

    const customer = await createCustomer(req.body.name, req.body.phone, req.body.isGold);
    res.send(customer);
});


router.put('/:id', async (req, res)=>{

    const {error} = validateData(req.body);
    if(error) return res.status(400).send(error.message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    },{ new:true });

    if(!customer)return  res.status(404).send('Customer with that ID not found!');
    res.send(customer);

});

router.delete('/:id', async (req,res)=>{

    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer)return  res.status(404).send('Customer with that ID not found!');
    res.send(customer);

});

function validateData(genre){
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(50),
        phone: Joi.string().required().min(8).max(10),
        isGold: Joi.boolean()
    });
    return schema.validate(genre);
}

async function createCustomer(name, phone, isGold){
    const customer = new Customer({
        name: name,
        phone: phone,
        isGold: isGold
    })
    try{
        const result = await customer.save();
        return result
    }catch (exp){
        for(let field in exp.errors){
            console.log(exp.errors[field].message);
        }
    }
}

module.exports = router;