const {Customer, validate} = require('../models/customers');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res)=>{
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req,res)=>{

    const customer = await Customer.findById(req.params.id).exec();
    res.send(customer);
    if(!customer) res.status(404).send('Customer with that ID not found!');

});

router.post('/', auth, async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.message);

    const customer = await createCustomer(req.body.name, req.body.phone, req.body.isGold);
    res.send(customer);
});


router.put('/:id', auth, async (req, res)=>{

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    },{ new:true });

    if(!customer)return  res.status(404).send('Customer with that ID not found!');
    res.send(customer);

});

router.delete('/:id', auth, async (req,res)=>{

    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer)return  res.status(404).send('Customer with that ID not found!');
    res.send(customer);

});

async function createCustomer(name, phone, isGold){
    const customer = new Customer({
        name: name,
        phone: phone,
        isGold: isGold
    })
    try{
        await customer.save();
        return customer
    }catch (exp){
        for(let field in exp.errors){
            console.log(exp.errors[field].message);
        }
    }
}

module.exports = router;