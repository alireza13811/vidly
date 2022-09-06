const Joi = require('joi');
const express = require('express');
const app = express();


app.use(express.json());

const genres = [
   { id:1 , name:'horror'},
   { id:2 , name:'comedy'},
   { id:3 , name:'drama'},
];

app.get('/api/genres', (req, res)=>{
   res.send(genres);
});

app.get('/api/genres/:id', (req,res)=>{
   const genre = genres.find(g => g.id === parseInt(req.params.id));
   if(!genre) return res.status(404).send('Genre with that ID not found!');
   res.send(genre);
});

app.post('/api/genres', (req, res)=>{
   const {error} = validateData(req.body);
   if(error) return res.status(400).send(error.message);

   const genre = {
      id: genres.length+1,
      name: req.body.name
   };
   genres.push(genre);
   res.send(genre);
});

app.put('/api/genres/:id', (req, res)=>{
   const genre = genres.find(g => g.id === parseInt(req.params.id));
   if(!genre) return res.status(404).send('Genre with that ID not found!');

   const {error} = validateData(req.body);
   if(error) return res.status(400).send(error.message);

   genre.name = req.body.name;
   res.send(genre);
});

app.delete('/api/genres/:id', (req,res)=>{
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

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));
