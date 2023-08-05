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
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

//Home route
app.get('/', (req, res) => {
    res.render('index');
  });


//artist-search route
app.get('/artist-search', (req,res) => {
    
    const {artist} = req.query

    spotifyApi.searchArtists(artist)
        .then(data => {
        //console.log('The received data from the API: ', data.body);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        //console.log('The received data from the API: ', data.body.artists.items)
        res.render('artist-search-results', {artist: data.body.artists.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


//albums route
app.get('/albums/:artistId', async (req,res,next) => {
    try{
    const {artistId} = req.params
    let allAlbums = await spotifyApi.getArtistAlbums(artistId)
    console.log(allAlbums.body.items)
    res.render('albums', {allAlbums: allAlbums.body.items});
    }
    catch(error){console.log(error)}
})


//tracks route
app.get('/tracks/:albumId', async (req,res,next) => {
    try{
    const {albumId} = req.params
    let albumTracks = await spotifyApi.getAlbumTracks(albumId)
    console.log(albumTracks)
    res.render('album-tracks', {albumTracks: albumTracks.body.items});
    }
    catch(error){console.log(error)}
})



app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);