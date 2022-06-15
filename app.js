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
//Route for getting the homepage
app.get('/', (req, res, next) => res.render('home'));

//Route for search an artist
app.get('/artist-search', (req, res, next) => {
 //destructuring 
    const { artist } = req.query;
    req.nameArtist = artist;
    spotifyApi
    .searchArtists(artist)
    .then(data => {
        console.log("The received data from the API: ", data.body.artists.items);
        res.render('artist-search-results', { artist: data.body.artists.items, artist });
    } )
    .catch(error => console.log('Something went wrong while were searching the artist', error));
});
app.get('/albums/:artistId', (req, res, next) => {
    const { artistId, name } = req.params;
    spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
        console.log("The received data from the API: ", data.body.items);
        res.render('albums', { albums: data.body.items,  name });
    } )
    .catch(error => console.log('Some Error ocurred while were searching the ALBUM', error));
})

app.get('/tracks/:albumId', (req, res, next) => {
    const { albumId } = req.params
    
    spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
        res.render('tracks', { tracks: data.body.items });
    } )
    .catch(error => console.log('Something went wrong while getting the tracks', error));
});





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
