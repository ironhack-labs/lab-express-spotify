require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

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

app.get("/",(req,res)=> {
    res.render("index")
})

//     //STEP 2

app.get('/artist-search-results', async (req, res) => {
    const searchArtist = await spotifyApi.searchArtists(req.query.search)
    //console.log('The received data from the API: ', searchArtist.body.artists.items[0]);
    res.render('artist-search-results', {searchArtist:searchArtist.body.artists.items});
  });




  //ITERATION 4

  app.get('/albums/:artistId', async (req, res, next) => {
    const searchAlbum = await spotifyApi.getArtistAlbums(req.params.artistId)
    //console.log('albums', searchAlbum.body.items);
    res.render('albums', {searchAlbum: searchAlbum.body.items});
    }, function(err) {
        console.error(err);
    });
  
//ITERATION 5
app.get('/track-information', async (req, res) => {
  const searchTrack = await spotifyApi.getAlbumTracks(req.params.artistId)
  console.log('Tracks: ', searchTrack.body.tracks.items.id);
  res.render('track-information', {searchTrack:searchTrack.body.items});
});

// spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 })
//   .then(function(data) {
//     console.log(data.body);
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
