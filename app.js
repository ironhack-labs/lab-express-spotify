require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')
const path = require('path');
const bodyParser = require('body-parser')


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

//Register location for handlebars --EXTRA
hbs.registerPartials(path.join(__dirname, 'views/partials'));

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

app.get('/', (req, res)=>{
    res.render('home')
}),

app.get('/artist-search', (req, res) =>{
spotifyApi
.searchArtists(req.query.artist) //GETS THE INPUT FROM THE FORM
.then(data => {
    // console.log('The received data from the API: ', data.body);
    console.log(data.body.artists.items)
        res.render('artist-search-results', {data: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
}),

//Get albums with id
app.get('/albums/:artistId', (req, res, next) => {
    console.log(req.params.artistId) //id number
    spotifyApi
    .getArtistAlbums(req.params.artistId) 
    .then(data => {
        // res.send(data.body.items)
        res.render('albums', {data: data.body.items})
    })
    .catch(err => console.log('The error while searching album occurred: ', err));

//GetSongs
})
app.get('/songs/:albumId', (req, res, next) => {
    console.log(req.params.albumId) //id number
    spotifyApi
    .getAlbumTracks(req.params.albumId) 
    .then(data => {
        // res.send(data.body.items) 
        //-------> Useful way to check the object/array on screen
        res.render('songs', {data: data.body.items})
    })
    .catch(err => console.log('The error while searching song occurred: ', err));
}),

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
