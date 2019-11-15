require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const bodyParser = require("body-parser")

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('partials', __dirname + '/views/partials');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));




hbs.registerPartials(__dirname + "/views/partials");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application application/json
app.use(bodyParser.json());

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

app.get("/artists/", (req, res, next) =>{
    // it is a query because it is from a form with submit
    // console.log(req.query.artist);
    // res.send(req.query);
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
    //   console.log("The received data from the API: ", data.body.artists.items[0]);
      res.render("artists", {arrayArtist: data.body.artists.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });

});

app.get("/albums/:artistId", (req, res, next) => {

    console.log("res param: ",res.params);
    console.log("res query: ",res.query);
    console.log("req param: ",req.params.artistId);
    console.log("res query",req.query);
    
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        console.log("The received data from the API: ", data.body.items[0].name);
        console.log("The received data from the API: ", data.body.items[0].images[0].url);
        res.render("albums", {arrayAlbums: data.body.items});
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      });
  });



app.get("/", (req, res, next) =>{
    res.render("index");
});



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
