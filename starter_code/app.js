const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// setting the spotify-api goes here:
const clientId = '63e211b506434e74bc23cea933bfc533',
 clientSecret = '70e76cbfcaad40d089000132cb00d09a';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


// the routes go here:

app.get('/', (req, res, next) => res.render('home'))

app.post('/artists', (req, res, next) => {

  let {searchbar} = req.body
  
  spotifyApi.searchArtists(searchbar)
    .then(data => {

      console.log("The received data from the API: ", data.body.artists.items);
      let myData=data.body.artists.items;
      // res.json(myData)
      res.render('artists', {myData})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/albums/:id', (req, res, next) => {
  
  spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {

      let myData = data.body.items;
      // res.json(myData)
      res.render('albums', {myData})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/tracks/:id', (req, res, next) => {  
  
  spotifyApi.getAlbumTracks(req.params.id)
    .then(data => {

      let myData = data.body.items;
      // res.json(myData)
      res.render('tracks', {myData})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

// app.get('/artists', (req, res, next) => res.render('artists'))

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
