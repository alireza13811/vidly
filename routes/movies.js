const {Movie, validate} = require('../models/movies');
const {Genre} = require('../models/genres');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res)=>{
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.get('/:id', async (req,res)=>{

    const movie = await Movie.findById(req.params.id).exec();
    if(!movie) return res.status(404).send('Movie with that ID not found!');
    res.send(movie);

});

router.post('/', async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.message);

    const genre = await Genre.findById(req.body.genreId).exec();
    if(!genre) return res.status(404).send('Genre with that ID not found!');

    const movie = await createMovie(req.body.title, genre, req.body.numberInStock, req.body.dailyRentalRate);
    res.send(movie);
});


router.put('/:id', async (req, res)=>{

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.message);

    const genre = Genre.findById(req.body.genreId).exec();
    if(!genre) return res.status(404).send('Genre with that ID not found!');

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    },{ new:true });

    if(!movie)return  res.status(404).send('Movie with that ID not found!');
    res.send(movie);

});

router.delete('/:id', async (req,res)=>{

    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie)return  res.status(404).send('Movie with that ID not found!');
    res.send(movie);

});

async function createMovie(title, genre, numberInStock, dailyRentalRate){
    const movie = new Movie({
        title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock,
        dailyRentalRate
    });
    try{
        const result = await movie.save();
        return result
    }catch (exp){
        for(let field in exp.errors){
            console.log(exp.errors[field].message);
        }
    }
}

module.exports = router;