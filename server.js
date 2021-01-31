'use strict'

//Packages
const express = require('express');
const cors = require('cors');
// const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');
// const axios = require('axios');
const api = require('./api');
const axios = api.instance;

//Global Vars
const PORT=process.env.PORT || 3003;
const app = express();
const methodOverride = require('method-override');
const API_KEY = process.env.API_KEY;
// const client = new pg.Client(DATABASE_URL)
// client.on('error', error => console.error(error));


//Configs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.static('./public'));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.use(express.json());


//Server
// The server has to listen first for the requests
// client.connect()
//   .then(() => {
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
//   });

//Routes
app.get('/', renderHomepage);
app.get('/watchlist', renderWatchlist);
app.get('/about', renderAboutPage);
app.get('/login', (req, res) => {
  res.render('pages/login');
})

// Functions
function handleError(error, res) {
  console.error(error);
  res.render('error', {error});
}

/*****************************ROUTES */
app.get('/detail/:id', (req, res) => {
  const mySql = `SELECT * FROM movies WHERE id=$1;`;
  const id = req.params.id;

  axios.get(`/${id}`)
    .then( result => {
      if(!result)res.status(404).send('The movie with the given id is not found');
      // send whatever pages/detail needs to render data
      res.render('pages/detail', {movie: result.rows[0]});
    })
    .catch(error => {
      handleError(error, res);
    });
});

app.post('/preview' , (req, res)=> {
  const movie = req.body;
  res.render('pages/detail', {movie:movie});
})

app.post('/detail', (req, res) => {
  // const {title, poster,vote_average, overview, release_date, username} = req.body;
  // const values = [title, poster,vote_average, overview, release_date, username];
  // const mySql = `INSERT INTO movies (title, poster, vote_average, overview, release_date, username) VALUES ($1, $2, $3,$4, $5, $6)`;

  axios.post('', req.body)
    .then(result => {
      //Sending the response from the form submission to the route that matches /watchlist
      res.redirect('/watchlist');
    })
    .catch(error => {
      console.log('error in post to detail', error);
      handleError(error, res);
    });
});

// app.delete('/watchlist/:id', (req, res) => {
//   const mySql = `DELETE FROM movies WHERE id=$1;`;
//   const id = req.params.id;
//   //Sending the mySQL command and the array of user provided values (which is a movie id)
//   client.query(mySql, [id])
//     .then( result => {
//       if(!result)res.status(404).send('The movie with the given id is not found');
//       res.redirect('/watchlist');
//     })
//     .catch(error => {
//       handleError(error, res);
//     });
// });

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
  axios.get(movieSearchUrl)
    .then(APIMovieData => {
      console.log('in renderHomepage', APIMovieData);
      const movieArr = APIMovieData.data.results.map(movieData => new Movie(movieData));
      res.render('pages/index.ejs', { movies : movieArr});
    })
    .catch();
}

function renderWatchlist(req, res){
  console.log('fetching watchlist', req.params);
  //Thank you geeksforgeeks.org!
  axios.get(req.params.id)
    .then( result => {
      console.log('in renderWatchlist', result);
      if(!result)res.status(404).send('The movie with the given id is not found');
      res.render('pages/watchlist', {movies: result.data});
    })
    .catch(error => {
      handleError(error, res);
    });
}

function renderAboutPage(req, res){
  res.render('pages/about');
}


//CODE FOR USER AUTH/PASSWORD LOGIN

const users = [];
app.get('/users',(req,res) => {
  res.json(users)
});

app.post('/users', async (req,res)=> {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    console.log(salt);
    console.log(hashedPassword);
    const user = {name:req.body.name, password: hashedPassword};
    users.push(user);
    res.status(201).send();
} catch {
  res.status(500).send();
  };

});

app.post('/users/login', async (req, res)=> {
  const user = users.find(user => user.name = req.body.name);
  if(user === null) {
    return res.status(400).send('Unable to find user')
  }
  //comparison for password
  try {
    //pass it the intial password and then hashed password
    //This will compare and get salt and make sure hashed version equals the same thing
    if(await bcrypt.compare(req.body.password, user.password)){
      //will return true or false
      //if it is true then user is logged in
      res.send('Success');
    } else {
      //if passwords are not the same, then this will happen
      res.send('Not Allowed');
    }
  } catch {
    res.status(500).send()
  }
})
//saved hashed password into database
//upon sign up, how to save password into database
//upon sign in how to decrypt and compare what the password entered vs hashed
