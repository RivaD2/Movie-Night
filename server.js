'use strict'

//Packages
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

//Global Vars
const PORT=process.env.PORT||3003;
const app = express();
const methodOverride = require('method-override');
const client = new pg.Client()//database url here;
client.on('error', error => console.error(error));
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
//pass in object argument from movieObject





//CONST for DATABASE URL

//Configs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(methodOverride('_method'));
app.use(express.static('./public'));
// app.get('/api/movies/:id', getSingleMovie);
// app.get('/', (req, res) => {
//   res.send('hello');
// });

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
app.get('/', renderHomepage);

// Functions
function handleError(error, res) {
  console.error(error);
  res.render('error', {error});
}
/*****************************ROUTES */
app.get('/detail/:id', (req, res) => {
  const movies = movieObject.find(m => m.id === parseInt(req.params.id));
  if(!movies)res.status(404).send('The movie with the given id is not found')});



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
const movieObject = [ {id:1,title:2 } ];
function Movie(movieObject){
  //need to replace with more precise values
  this.title = movieObject.title;
  this.poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movieObject.poster_path;
  this.vote_average = movieObject.vote_average;
  this.overview = movieObject.overview;
  this.release_date = movieObject.release_date;

 
}

function renderHomepage(req,res){
  // const movieSearchUrl = `https://api.themoviedb.org/3/movie/3/recommendations?api_key=${MOVIE_API_KEY}&language=en-US&page=1`;

  const movieSearchUrl =  `https://api.themoviedb.org/3/discover/movie/?certification_country=US&sort_by=vote_average&api_key=82d4270c35eb3e4492fa5462bb89256d&vote_count.gte=15&vote_average.gte=8&primary_release_date.gte=2018-01-01`;

  superagent.get(movieSearchUrl)
    .then(APIMovieData => {

      // console.log(APIMovieData);
      const movieArr = APIMovieData.body.results.map(movieData => new Movie(movieData));


      res.render('pages/index.ejs', { movies : movieArr});


    })
    .catch();

}
