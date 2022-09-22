const mongoose = require('mongoose');
const Joi = require('joi');


const GenresSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        minLength:3,
        maxLength: 50
    }
})

const Genre = mongoose.model('Genre', GenresSchema);

function validateData(genre){
    const schema = Joi.object({
        name: Joi.string().required().min(3)
    });
    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateData;
exports.GenreSchema = GenresSchema;