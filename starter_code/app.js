require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
var bodyParser = require('body-parser')


// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });





// the routes go here:

app.get('/', (req, res) => {
  res.render('index');
})

var artists;

app.get('/artists/', (req, res) => {


    spotifyApi
    .searchArtists(req.query.searchartist)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items[0].name);
      artists = data.body.artists;
     
    console.log("try3", data.body.artists.items[0].id);
       //console.log(data.body)
      res.render('artists', {artists: data.body.artists.items})

    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });

    
  
  //console.log(req.query);
  

})

app.get("/albums/:artistId", (req, res) => {
    console.log("muraaa", req.params.artistId)
    
    spotifyApi
    .searchArtists(req.params.artistId)
    .then(data => {
    spotifyApi.getArtistAlbums(data.body.artists.items[0].id)
  .then(function(data) {
        console.log('Artist albums', data.body.items);
    res.render('albums', {albums: data.body.items});
  })
    })
    .catch(err => {
        throw err;
      })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
})




// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', {limit: 10})
//   .then(function(data) {
//     return data.albums.map(function(a) { return a.id; });
//   })
//   .then(function(albums) {
//     return spotifyApi.getAlbums(albums);
//   }).then(function(data) {
//     console.log(data);
//   });







app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
