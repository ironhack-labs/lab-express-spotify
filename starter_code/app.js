const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
// const s = new Spotify();

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:
const clientId = 'ce2b2ea9ae5140e3a62e449d0b7b4b84',
    clientSecret = '6df7829473e249a0ad78cd618d6d1576';

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

app.get('/', (req, res, next) => {
      res.render('index');
    })

 app.get ('/artist' , (req, res, next) => {
      res.render('artist');
})

     
app.post('/artist', (req, res) => {
  const { artist } = req.body;
 // console.log('dsakljdalkjd', artist)
  spotifyApi.searchArtists(artist)
    .then(data => {
       //res.render('artist', { artist: data.body.artists.items })
       res.render('artist', { artist: data.body.artists})
        
     // console.log("The received data from the API: ", data.body.artists.items[0].name);
      console.log("The received data from the API: ", data.body.artists.items[0].images[0].url);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

    })
                      

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));


//   id ce2b2ea9ae5140e3a62e449d0b7b4b84

//secret 6df7829473e249a0ad78cd618d6d1576