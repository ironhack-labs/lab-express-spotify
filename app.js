require('dotenv').config();

const chalk = require('chalk');
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next)=>{
    res.render('index');
});

app.get('/artist-search', (req, res, next)=>{
    let search = req.query.search;
    spotifyApi
        .searchArtists(search)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // res.send(data);
            res.render('artist-search-results', {data});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});



app.listen(3000, () => console.log(chalk.green.inverse.bold('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')));
