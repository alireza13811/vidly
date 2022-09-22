const mongoose = require('mongoose');
const Joi = require('joi');
const {GenreSchema} = require('./genres');

const MovieSchema = new mongoose.Schema({
   title: {
       type: String,
       required: true,
       minLength: 5,
       maxLength: 255,
       trim: true
   },
   genre: {
       type: GenreSchema,
       required: true
   },
   numberInStock: {
       type: Number,
       required: true,
       min: 0,
       max: 255
   },
   dailyRentalRate: {
       type: Number,
       required: true,
       min: 0,
       max: 255
   }
});

const Movie = mongoose.model('Movie', MovieSchema);


function validateData(movie){
    const Schema = Joi.object({
       title: Joi.string().required().min(5).max(355),
       genreId: Joi.string().required(),
       numberInStock: Joi.number().min(0).max(255).required(),
       dailyRentalRate: Joi.number().min(0).max(255).required()
    });
    return Schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateData;