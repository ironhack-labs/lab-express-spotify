const express = require('express');
const hbs = require('hbs'); 
const SpotifyWebApi = require('spotify-web-api-node')
// loading env
require('dotenv').config();


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = process.env.CLIENT_ID; // from .env
const clientSecret = process.env.CLIENT_SECRET; // from .env

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// retreive an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong with receiving access token', error);
  });



// the routes go here:
app.use('/', (req, res, next) => {
  console.log(req.url);
  next();
});

// home (with search button)
app.get('/', (req, res, next) => {
  res.render('home.hbs');
});

// artists
app.get('/artists' , (req, res, next) => { 
  spotifyApi.searchArtists(req.query.searchArtist)
    .then(result => {
      console.log(result.body.artists) 
      res.render('artists.hbs', {artist : result.body.artists.items})
    })
    .catch(err => {console.log(err)})
  // res.send(req.query); 
});

// albums
app.get('/albums/:artistId', (req, res, next) => { 
  console.log(req.params);
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(albumsFound => {
      // console.log(albumsFound.body.items);
      // console.log(albumsFound.body.items[0].artists[0].name) 
      res.render('albums.hbs', {album : albumsFound.body.items})
    })
    .catch(err => {console.log(err)})
});

// tracks
app.get('/tracks/:trackId', (req, res, next) => {
  console.log(req.params);
  spotifyApi.getAlbumTracks(req.params.trackId)
    .then(tracksFound => {
      console.log(tracksFound.body.items[0]);
      res.render('tracks.hbs', {track : tracksFound.body.items})
    })
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
