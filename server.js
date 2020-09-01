'use strict'

//Packages
const express = require('express');
const cors = require('cors');
// const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

//Global Vars
const PORT=process.env.PORT||3003;
const app = express();
const methodOverride = require('method-override');
const client = new pg.Client()//database url here;
client.on('error', error => console.error(error));
const OMDB_API_KEY = process.env.OMDB_API_KEY;
//pass in object argument from movieObject
// const movieSearchUrl = `http://www.omdbapi.com/?i=tt3896198&apikey=${OMDB_API_KEY}`;
// const posterSearchUrl = `http://img.omdbapi.com/?i=tt3896198&h=600&apikey=${OMDB_API_KEY}`;




//CONST for DATABASE URL

//Configs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(methodOverride('_method'));
// app.get('/api/movies/:id', getSingleMovie);
app.get('/', (req, res) => {
  res.send('hello');
});

// res.render('pages/index'));

//Server
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
  });

//Routes
// app.get('/api/movies', (req, res));
// app.get('api/movies/:id', (req, res));
// app.post('/api/movies', (req, res));
// app.delete('/api/movies/:id', (req, res));

//Functions
function handleError(error, res) {
  console.error(error);
  res.render('error', {error});
}

/*****************************ROUTES */
app.get('/detail/:id', (req, res) => {
  const movies = movieObject.find(m => m.id === parseInt(req.params.id));
  if(!movies)res.status(404).send('The movie with the given id is not found');



app.post('/detail', (req, res) => {
  const {id, title, poster,rating,plot, actors, genre, username} = req.body;
  const values = [id, title, poster, rating, plot, actors, genre, username];
  const mySql = `INSERT INTO movies (id, title, poster, rating, plot, actors, genre, username) VALUES ($1, $2, $3,$4, $5, $6, $7, $8)`;
  client.query(mySql, values)
    .then( result => {
      res.redirect('/pages/watchlist', {movieObject:result.rows});
    })
    .catch(error => {
      handleError(error, res);
    });
});






const movieObject = [ {id:1, title:2 } ]; //an array of objects

function Movie(movieObject){
  //need to replace with more precise values
  this.id = movieObject.id;
  this.title = movieObject.title;
  this.poster = movieObject.poster;
  this.rating = movieObject.rating;
  this.plot = movieObject.plot;
  this.actors = movieObject.actors;
  this.genre = movieObject.genre;
  this.username = movieObject.username;
}