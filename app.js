require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
console.log("ClientID "+ process.env.CLIENT_ID);

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.use(express.static('public'));
// Our routes go here:

app.get('/', (req, res) => {
    res.render('artist-search');
});

app.get('/artist-search', (req, res) => {
    const artist = req.query.artist;

    spotifyApi
        .searchArtists(artist)
        .then(data => {
             //console.log(data.body.artists.items[0].images[0].url);
             //console.log('The received data from the API: ', data.body.artists.items);
             res.render('artist-search-results',  { 
                artists: data.body.artists.items
              }); 
             // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/artists', (req, res) => {
    if(req.body !== undefined) {
        const artist = req.body.name;
        console.log(artist);
    }
});

app.get('/albums/:artistId', (req, res, next) => {
    console.log(res.body);
    let albums = ['Penny Lane', 'Number 1 Hits', 'Jasfasfaas'];
    res.render('albums', albums); 
});

app.get('/tracks/:albumid', (req, res) => {
    console.log("Albums");
    res.render('tracks'); 
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
