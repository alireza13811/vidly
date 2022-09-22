const mongoose = require('mongoose');
const Joi = require('joi');
const {GenreSchema} = require("./genres");

const RentalSchema = new mongoose.Schema({
   customer: {
      type: new mongoose.Schema({
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
      }),
      required: true
   },
   movie: {
      type: new mongoose.Schema({
          title: {
              type: String,
              required: true,
              minLength: 5,
              maxLength: 255,
              trim: true
          },
          dailyRentalRate: {
              type: Number,
              required: true,
              min: 0,
              max: 255
          }
      }),
      required: true
   },
   dateOut: {
       type: Date,
       required: true,
       default: Date.now
   },
   dateReturned: Date,
   rentalFee: {
       type: Number,
       min: 0
   }
});

const Rental = mongoose.model('Rental', RentalSchema);

function validateData(rental){
    const Schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });
    return Schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateData;