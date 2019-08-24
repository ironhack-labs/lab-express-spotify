require('dotenv').config()
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
// require spotify-web-api-node package here:



const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:


// Remember to insert your credentials here
const clientId = process.env.CLIENTID,
    clientSecret = process.env.CLIENTSECRET;

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


// the routes go here:
app.get('/', function (req, res) {
  res.render('index');
})

app.post('/artists', (req, res) => { 
  // console.log('This is req.body.artist variable:' + req.body.artist)
  spotifyApi.searchArtists(req.body.artist)
  .then((data) => {
    // console.log("The received data from the API data.body.artists.items : ", data.body.artists.items);
      let { artists } = data.body
      // console.log(artists.items.images)
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artists', artists)
  })
  .catch((err) => {
    console.log(`The error while searching artists occurred: , ${err}`);
  })
})
  
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then((data) => {
      // console.log('This is data.body only: ', data.body);
      let viewAlbum = data.body
      res.render('albums', viewAlbum )
    })
    .catch ((err) => {
      console.log(`The error while searching albums occurred: ${err}`);
    });
});

// .getAlbumTracks()

app.get('/tracks/:albumId', (req, res, next) => {
  // console.log('This is req.params.albumId: ' + req.params.albumId)
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then((data) => {
      // console.log('This is data.body to tracks page only: ', data.body);
      let viewAlbum = data.body
      res.render('tracks', viewAlbum )
    })
    .catch (err => {
      console.log(`The error while searching albums occurred: ", ${err}`);
    })
});



  app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));


