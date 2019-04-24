const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

const app = express();



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials');


// setting the spotify-api goes here:
const clientId = 'f439fd90b2ca4783a484229625b60539',
    clientSecret = '04aa6750d2b84b9bad011649dbbebba1';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
    
  })
  
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

app.get('/', (req, res, next) => {
    res.render('index');
})

app.get('/artist', (req, res, next)=>{
    spotifyApi.searchArtists(req.query.search)
    .then(data => {

      console.log("The received data from the API: ", data.body.artists.items[0].images[0]);
      res.render('artist', {items: data.body.artists.items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/albums/:albumId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.albumId)
    .then (data => {
      console.log("Artist Albums", data.body);
      res.render('album', {items: data.body.items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  });

  app.get('/tracks/:tracksId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.tracksId)
    .then (data => {
      console.log("Artist Albums", data.body);
      res.render('tracks', {items: data.body.items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  });


// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
