require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser')

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
 
spotifyApi
.clientCredentialsGrant()
.then((data) => {
    console.log(data);
    spotifyApi.setAccessToken(data.body.access_token);
})
.catch((error) =>
console.log("Something went wrong  retrieving the access token", error)
);


// Our routes go here:
app.get('/', (req, res) => {
    res.render('homepage');
});

app.get('/artist-search', (req, res) => {
    const { artist } = req.query;
    spotifyApi
    .searchArtists(artist)
    .then(data => {
        console.log('The received data from the API: ', data.body.artists.items);
        res.render('artist-search-results', {artist: data.body.artists.items}); 
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params;
    spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
        console.log('Artist albums', data.body.items);
        res.render('albums', {albums: data.body.items, artist: data.body.items[0].artists[0].name})
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/albums/:albumId/tracks', (req, res, next) => {
    const { albumId } = req.params;
    spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
        console.log('Tracks data: ', data.body.items);
        res.render('tracks', {tracks: data.body.items})
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
});
   
    


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
