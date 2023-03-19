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

app.get("/", (req, res, next)=>{
    res.render("index")
})


app.get('/artist-search', (req, res) => {
    spotifyApi
  .searchArtists(req.query.artist)
  .then(artistsArray => {

    console.log('The received data from the API: ', artistsArray.body.artists.items);

    const data = {
        artists: artistsArray.body.artists.items
    }
    res.render('artist-search-results', data);

  })
  .catch(err => console.log('An error occurred while searching artists: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    artistId = req.params.artistId;
    spotifyApi
  .getArtistAlbums(artistId)
  .then(albumsData => {

    res.render('albums', {albumsData});
  })
    
  .catch(err => console.log('An error occured while searching tracks: ', err));
});

app.get('/tracks/:tracksId', (req, res, next) => {
    tracksId = req.params.tracksId;
    spotifyApi
  .getAlbumTracks(tracksId)
  .then(tracksData => {

    res.render('tracks', {tracksData});
  })
    
  .catch(err => console.log('An error occured while searching tracks: ', err));
});






app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));