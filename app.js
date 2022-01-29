require('dotenv').config();

const express = require('express');
//const {render} = require('express/lib/response');
const app = express();
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
 
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body['access_token']);
      console.log('token received');})
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res, next) => {
    spotifyApi.clientCredentialsGrant();
    res.render('index');
});

app.get('/artist-search', (req,res,next) => {
    //res.send(req.query);    
    let artist = req.query.artist;
    //console.log('artist: ' + JSON.stringify(artist))
    spotifyApi
      .searchArtists(artist.toString())
        .then(responseFromAPI => {
          //console.log('we got the artist ' + JSON.stringify(responseFromAPI))
          res.render('artist-search-results', responseFromAPI.body.artists);
        })
        .catch(err => console.log('error while searching ' + err));
});

//Get albums
app.get('/albums/:id', (req,res,next) => {
  let artistId = req.params.id.toString();
  console.log(artistId);
  spotifyApi
    .getArtistAlbums(artistId)
    .then(responseFromAPI =>{
      res.render('albums',responseFromAPI.body);
    })
    .catch(err => console.log('Error while fetching albums: ' + err))
});

//Get tracks
app.get('/tracks/:id', (req,res,next) => {
  let albumId = req.params.id.toString();
  console.log(albumId);
  spotifyApi
    .getAlbumTracks(albumId)
    .then(responseFromAPI =>{
      res.render('tracks',responseFromAPI.body);
      console.log(responseFromAPI.body);
    })
    .catch(err => console.log('Error while fetching albums: ' + err))
});
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
