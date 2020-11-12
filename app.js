require('dotenv').config();

const express       = require('express');
const hbs           = require('hbs');
const dotenv        = require("dotenv");

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const { response } = require('express');


const app = express();

require('dotenv').config();

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




// Our routes go here:

app.get('/', (req, res, next)=>{
    res.render('home');
});

app.get('/artist-search', (req, res, next)=>{

    spotifyApi
    .searchArtists('Love')
    .then((data)=>{
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('artist-search')
        console.log('The received data from the API: ', data.body);
    })
    
    .catch(err => console.log('The error while searching artists occurred: ', err));
})





app.listen(process.env.PORT, () => console.log(`My Spotify project running on port ${process.env.PORT}3000 🎧 🥁 🎸 🔊`));
