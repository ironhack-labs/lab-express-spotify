// require env, express and hbs
require('dotenv').config();
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// start express
const app = express();
// start handlebars
app.set('view engine', 'hbs');

// create views folder
app.set('views', __dirname + '/views');

// create public folder
app.use(express.static(__dirname + '/public'));

//using bootstrap in a cool way
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));


// create partials folder
hbs.registerPartials(__dirname + '/views/partials');

// 1. Setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
// 2. Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));



// Our routes go here:
// 3. Create the homepage route
app.get('/', (req,res) => {
    res.render('index');
})

//4. Create the artist search route
app.get('/artist-search', (req, res) => {
   
    // console.log(artist.artistName);
    // req.query = {artist :'SEARCH'}
    const artistName = req.query.artist;

    spotifyApi
    .searchArtists(artistName)
    .then(data => {
        const result = data.body.artists.items;

        console.log('The received data from the API: ', artistName);

        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('artist-search', {result, artistName});
        // If i was not calling the search query the results would have to be inside curly braces

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));


})


// Create the albums route
app.get('/albums/:id', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const id = req.params.id;

    spotifyApi
    .getArtistAlbums(id)
    .then( data => {
        const albums = data.body.items
        const artistName = data.body.items[0].artists[0].name;

        //console.log(data.body.items[0].artists[0].name)
        console.log(data.body.items[0])

        res.render('albums', {albums, artistName});
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));

});

// Create the tracks route
app.get('/tracks/:id', (req, res, next) => {
    // .getAlbumTracks() code goes here
    const id = req.params.id;

    spotifyApi
    .getAlbumTracks(id)
    .then( data => {
        const tracks = data.body.items
        const albumName = data.body.items[0].name;

        //console.log(data.body.items[0].artists[0].name)
        console.log(data.body.items[0])
        
        res.render('tracks', {tracks, albumName});
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));

});


//Listen on port 3000
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
