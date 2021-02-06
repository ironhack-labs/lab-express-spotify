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
app.get('/', function (req,res){
    res.render('homePage')
});

app.get('/artist-search', (req,res) => {
    //console.log(req.query)
    spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    //console.log(data.body.artists.items)
    //console.log(data.body.artits.items[0])
    res.render('artist-search-results', { artists: data.body.artists.items} )
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
//res.render('artistSearch')
}); 

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    //console.log('teeest', req.params.artistId)
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
          console.log('Artist albums', data.body);
          res.render('albums', {albums: data.body.items} )
        })
    //.catch(err => console.error('We have an error',err));
  });


  app.get('/tracks/:tracksId', (req,res,next)=> {
      //console.log('TEEEEEEEEEST', req.params.artistId.id)
    spotifyApi
    .getAlbumTracks(req.params.tracksId)
    .then(track => {
      res.render('tracks', {tracks: track.body.items})
    })
    //.catch(err => console.log('The error while searching tracks occurred: ', err));
  })



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
