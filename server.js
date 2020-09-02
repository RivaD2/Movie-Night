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
const DATABASE_URL = process.env.DATABASE_URL;

const client = new pg.Client(DATABASE_URL)
client.on('error', error => console.error(error));

const API_KEY = process.env.API_KEY;
//pass in object argument from movieObject
const movieSearchUrl = `https://api.themoviedb.org/3/discover/movie/?certification_country=US&sort_by=vote_average&api_key=${API_KEY}&vote_count.gte=25&vote_average.gte=7.5`;



//Configs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.static('./public'));
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
//app.get('/api/movies', (req, res));
// app.get('api/movies/:id', (req, res));
// app.post('/api/movies', (req, res));
// app.delete('/api/movies/:id', (req, res));
app.get('/', renderHomepage);

// Functions
function handleError(error, res) {
  console.error(error);
  res.render('error', {error});
}
/*****************************ROUTES */
app.get('/detail/:id', (req, res) => {
  const mySql = `SELECT * FROM movies WHERE id='${req.params.id}';`;
  client.query(mySql)
    .then( result => {
      //const movies = movieObject.find(m => m.id === parseInt(req.params.id));
      if(!result)res.status(404).send('The movie with the given id is not found');
      console.log(result);
      res.render('pages/detail', {movie: result});
    })
    .catch(error => {
      handleError(error, res);
    });
});




app.post('/detail', (req, res) => {
  const {id, title, poster,rating,plot, actors, genre, username} = req.body;
  const values = [id, title, poster, rating, plot, actors, genre, username];
  const mySql = `INSERT INTO movies (id, title, poster, vote_average, overview, release_data) VALUES ($1, $2, $3,$4, $5, $6)`;
  client.query(mySql, values)
    .then( result => {
      res.redirect('/pages/watchlist', {movieObject:result.rows});
    })
    .catch(error => {
      handleError(error, res);
    });
});




const movieObject = [ {id:1,title:2 } ];

function Movie(movieObject){
  //need to replace with more precise values
  this.title = movieObject.title;
  this.poster = movieObject.poster_path;
  this.vote_average = movieObject.vote_average;
  this.overview = movieObject.overview;
  this.release_date = movieObject.release_date;
}
function renderHomepage(req,res){
  const movieSearchUrl = `http://www.omdbapi.com/?i=tt3896198&apikey=${OMDB_API_KEY}&page=1`;
  res.render('pages/index.ejs');
}
