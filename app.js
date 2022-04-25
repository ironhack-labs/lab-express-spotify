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
  
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('home');
});

//get an artist:
app.get("/artist-search", (req, res, next) => {
    //console.log(req.query);
    //res.render(req.query);
    spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
        //console.log(req.query);
        //console.log('The received data from the API: ', data.body);
        //console.log(data.body.artists.items[0]);      
// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render("artist-search-results", data.body.artists.items[0]);
     })
     .catch(err => console.log('The error while searching artists occurred: ', err));

});

//get the albums of an artist:
app.get('/albums/:artistId', (req, res, next) => {

    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
                //console.log(req.params);
                //console.log('data body contains:', data.body);
                //console.log('Artist albums', data.body.items);
                console.log('Artist albums images:', data.body.items[0].images);
                res.render("albums", data.body.items);
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/albums/tracks/:albumId', (req, res, next) => {
    
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
        console.log('Artist tracks', data.body);
        res.render("tracks", data.body.items);
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});


//to keep the server running:
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
