'use strict'

//Packages
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

//Global Vars
const PORT=process.env.PORT ||3003;
const app = express();
const methodOverride = require('method-override');
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL)
client.on('error', error => console.error(error));
const API_KEY = process.env.API_KEY;

//Configs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.static('./public'));
app.use(methodOverride('_method'));
app.use(express.static('./public'));

//Server
// The server has to listen first for the requests
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
  });

//Routes
app.get('/', renderHomepage);
app.get('/watchlist', renderWatchlist);
app.get('/about', renderAboutPage);

// Functions
function handleError(error, res) {
  console.error(error);
  res.render('error', {error});
}

/*****************************ROUTES */
app.get('/detail/:id', (req, res) => {
  //username takes place of id in this case
  // When a request is made to the server, the server will look for /detail/:id of one movie
  //Anything after the colon in the route is stored as a parameter
  const mySql = `SELECT * FROM movies WHERE id=$1;`;
  const id = req.params.id;
  // the request object has a query, params and a body
  // A query is made in the URL
  //Params come from the URL but are specified with colons in the route
  //I assigned params to const for easy use

  client.query(mySql, [id])
    .then( result => {
      if(!result)res.status(404).send('The movie with the given id is not found');
      // send whatever pages/detail needs to render data
      res.render('pages/detail', {movie: result.rows[0]});
    })
    .catch(error => {
      handleError(error, res);
    });
});

//This is adding a route of /preview
// I am sending a body in the request to tell the server what I want to post
app.post('/preview' , (req, res)=> {
  //The body is not coming from the URL but from the form submission
  //All input fields in form are being sent up as the body
  //Body can only work with POST and PUT
  const movie = req.body;
  res.render('pages/detail', {movie:movie});
})

//Adding a route of /detail
app.post('/detail', (req, res) => {
  //ES6 spread operator used to turn properties of body into variables
  // Created 6 vars from the properties on the body of the request that comes from the form submission
  const {title, poster,vote_average, overview, release_date, username} = req.body;
  const values = [title, poster,vote_average, overview, release_date, username];
  //I added new entry into the movies database 
  // For security, the user provided values (req.body) is NOT included in the SQL command
  //Instead, the SQL command uses placeholders with $ and the user VALUES are provided separately
  const mySql = `INSERT INTO movies (title, poster, vote_average, overview, release_date, username) VALUES ($1, $2, $3,$4, $5, $6)`;
  // Below I am querying the database and passing in the SQL command and values as separate args
  // Passing them in as separate args to prevent someone from including SQL commands in the request.body
  // username = "riva ); DROP TABLE;"--COMMANDS LIKE THIS WILL NOT BE EXECUTED if values are passed in
  //Anything that is user provided needs to be in values NOT the SQl statement
  client.query(mySql, values)
    .then( result => {
      //Sending the response from the form submission to the route that matches /watchlist
      res.redirect('/watchlist');
    })
    .catch(error => {
      handleError(error, res);
    });
});

//adding a route using DELETE
//This will look for a reqest of TYPE DELETE that matches the route of /watchlist/:id
app.delete('/watchlist/:id', (req, res) => {
  //I am sending a SQL commands to database that tells it to DELETE one movie from the database
  //The delete from watchlist button calls the route with an id included
  const mySql = `DELETE FROM movies WHERE id=$1;`;
  //assigned the params to a const for easy use
  const id = req.params.id;
  //Sending the mySQL command and the array of user provided values (which is a movie id)
  client.query(mySql, [id])
    .then( result => {
      //const movies = movieObject.find(m => m.id === parseInt(req.params.id));
      //if there is no id that matches the query, then send the 404 response
      if(!result)res.status(404).send('The movie with the given id is not found');
      res.redirect('/watchlist');
    })
    .catch(error => {
      handleError(error, res);
    });
});

function Movie(movieObject){
  this.title = movieObject.title;
  this.poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movieObject.poster_path;
  this.vote_average = movieObject.vote_average;
  this.overview = movieObject.overview;
  movieObject.release_date = movieObject.release_date.slice(0,4);
  this.release_date = movieObject.release_date;
}

function renderHomepage(req,res){
  const movieSearchUrl =  `https://api.themoviedb.org/3/discover/movie/?certification_country=US&sort_by=vote_average&api_key=${API_KEY}&vote_count.gte=15&vote_average.gte=8&primary_release_date.gte=2018-01-01`;
  superagent.get(movieSearchUrl)
    .then(APIMovieData => {
      const movieArr = APIMovieData.body.results.map(movieData => new Movie(movieData));
      res.render('pages/index.ejs', { movies : movieArr});
    })
    .catch();
}

function renderWatchlist(req, res){
  //Thank you geeksforgeeks.org!
  const mySql = `SELECT * FROM movies ORDER BY id DESC;`;
  client.query(mySql)
    .then( result => {
      if(!result)res.status(404).send('The movie with the given id is not found');
      res.render('pages/watchlist', {movies: result.rows});
    })
    .catch(error => {
      handleError(error, res);
    });
}

function renderAboutPage(req, res){
  res.render('pages/about');
}
