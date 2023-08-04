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

// Route that displayers a search bar
app.get('/', (req,res)=> {
    res.render('index');

});

// Route to display list of artists based on the query
app.get('/artist-search', (req, res)=>{

    const {artist} = req.query;

    spotifyApi
    .searchArtists(artist)
    .then(data => {
    // console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', {artistList:data.body.artists.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

// Route to display list of albums based on artist ID
app.get('/albums/:artistId', async (req, res, next)=>{
    try{
    const {artistId} = req.params;

    let artistAlbums = await spotifyApi.getArtistAlbums(artistId);
    res.render('albums', {albums :artistAlbums.body.items})
    }

    catch(error){
        console.log('The error while searching albums occurred: ', error);
    }
});

// Route to display track of album based on album ID

app.get('/tracks/:albumId', async (req, res, next)=>{
    try{
    const {albumId} = req.params;
    let albumTracks = await spotifyApi.getAlbumTracks(albumId);
    res.render('album-tracks', {tracks :albumTracks.body.items})
    console.log (albumTracks.body.items[0].preview_url)
    }

    catch(error){
        console.log('The error while searching tracks occurred: ', error);
    }
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
