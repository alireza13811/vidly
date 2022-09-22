const {Rental, validate} = require('../models/rentals');
const {Movie} = require('../models/movies');
const {Customer} = require('../models/customers');
const Fawn = require('fawn')
const express = require('express');
const router = express.Router();

Fawn.init("mongodb://localhost/vidly_db");

router.get('/', async (req, res)=>{
    const rental = await Rental.find().sort('-dateOut');
    res.send(rental);
});

router.post('/', async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.message);

    const customer = await Customer.findById(req.body.customerId).exec();
    if(!customer) return res.status(404).send('Customer with that ID not found!');

    const movie = await Movie.findById(req.body.movieId).exec();
    if(!movie) return res.status(404).send('Movie with that ID not found!');

    if(movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    const rental = await createRental(req.body.title, customer, movie);
    res.send(rental);
});

async function createRental(title, customer, movie){
    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {
                $inc: { numberInStock: -1}
            })
            .run();
        return rental
    }catch (exp){
        for(let field in exp.errors){
            console.log(exp.errors[field].message);
        }
    }
}

module.exports = router;