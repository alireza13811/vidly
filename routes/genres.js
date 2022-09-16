const {Genre, validateData} = require('../models/genres');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res)=>{
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', async (req,res)=>{
    try{
        const genre = await Genre.findById(req.params.id);
        res.send(genre);
    }catch (exp){
        return res.status(404).send('Genre with that ID not found!');
    }
});

router.post('/', async (req, res)=>{
    const {error} = validateData(req.body);
    if(error) return res.status(400).send(error.message);

    const genre = await createGenre(req.body.name);
    res.send(genre);
});


router.put('/:id', async (req, res)=>{

    const {error} = validateData(req.body);
    if(error) return res.status(400).send(error.message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    },{ new:true });

    if(!genre)return  res.status(404).send('Genre with that ID not found!');
    res.send(genre);

});

router.delete('/:id', async (req,res)=>{

    const genre = await Genre.findByIdAndDelete(req.params.id);
    if(!genre)return  res.status(404).send('Genre with that ID not found!');
    res.send(genre);

});

async function createGenre(name){
    const genre = new Genre({
        name: name,
    })
    try{
        const result = await genre.save();
        return result
    }catch (exp){
        for(let field in exp.errors){
            console.log(exp.errors[field].message);
        }
    }
}

module.exports = router;