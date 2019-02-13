const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '6ff1df1cc4124121b84e2cc663824207',
    clientSecret = '10e9c259b96a4acd9bfe270d548cbe84';

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
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/artist', (req, res) => {
  console.log(req.body)
  let artist = req.body.artist;
  
  spotifyApi.searchArtists(artist)
    .then(data => {

      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      //let myArtists = data.body.artists.items;
      //console.log(`=> ${myArtists}`);
      //res.send(data.body);
      res.render('artist', {myArtists: data.body.artists.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  
  //res.send(`=> ${artist}`);
});


app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  console.log(req.body, req.params, req.query);
  
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function(data) {
    console.log('Artist albums', data);
    res.send(data.body);
  }, function(err) {
    console.error(err);
});
});




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
