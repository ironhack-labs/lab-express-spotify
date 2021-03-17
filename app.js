require('dotenv').config();

const { response } = require("express");
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

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (request, response) => {
    response.render('home');
});

app.get('/artist-search', async (request, response) => {
    const { artistName } = request.query;
    try{    
        const { body: { artists: { items }}} = await spotifyApi.searchArtists(artistName);
        response.render('artist-search-results', { items });
    } catch(error){
        console.log(error);
    }
}) 

// Our routes go here:

app.listen(process.env.PORT, () => console.log(`My Spotify project running on port ${process.env.PORT} 🎧 🥁 🎸 🔊`));
