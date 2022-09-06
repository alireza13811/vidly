const Joi = require("joi");
const express = require('express');
const router = express.Router();

const genres = [
    { id:1 , name:'horror'},
    { id:2 , name:'comedy'},
    { id:3 , name:'drama'},
];

router.get('/', (req, res)=>{
    res.send(genres);
});

router.get('/:id', (req,res)=>{
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('Genre with that ID not found!');
    res.send(genre);
});

router.post('/', (req, res)=>{
    const {error} = validateData(req.body);
    if(error) return res.status(400).send(error.message);

    const genre = {
        id: genres.length+1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

router.put('/:id', (req, res)=>{
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('Genre with that ID not found!');

    const {error} = validateData(req.body);
    if(error) return res.status(400).send(error.message);

    genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', (req,res)=>{
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('Genre with that ID not found!');

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
});

function validateData(genre){
    const schema = Joi.object({
        name: Joi.string().required().min(3)
    });
    return schema.validate(genre);
}

module.exports = router;