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

app.get('/artists/', (req, res) => {


    spotifyApi
    .searchArtists(req.query.searchartist)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items[0].name);
      //console.log(data);
       //console.log(data.body)
      res.render('artists', {artists: data.body.artists.items, images: data.body.artists.items[0].images})

    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });

    
  
  //console.log(req.query);
  

})







app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
