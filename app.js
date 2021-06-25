require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebAPI = require('spotify-web-api-node');
const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyWebAPI = new SpotifyWebAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});


//Connect to the API - copied from the documentation
spotifyWebAPI
    .clientCredentialsGrant()
    .then(data => spotifyWebAPI.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Our routes go here:
app.get('/', (req, res) => {
res.render('index');
});

//3.1
app.get('/artist-search', async (req, res) => {
    const artistName = req.query.artistName;
    let results = await spotifyWebAPI.searchArtists(artistName);
    res.render('artist-search-results', {artists: results.body.artists.items});
});


app.get('/albums/:artistId', async (req, res, next) => {

    let albumResults = await spotifyWebAPI.getArtistAlbums(req.params.artistId);

    console.log(albumResults.body.items);
    
    res.render('albums', {
        albums: albumResults.body.items
    });
});



app.get('/tracks/:trackId', async (req, res) => {
let trackResults = await spotifyWebAPI.getAlbumTracks(req.params.trackId);
console.log(trackResults.body.items);
 res.render('tracks', {
     tracks: trackResults.body.items
 });

});











app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
