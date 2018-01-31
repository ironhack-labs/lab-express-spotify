
const express = require("express");
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const spotifyApi = new SpotifyWebApi({
  clientId : 'f53d912621d942c694520248cd84db89',
  clientSecret : '8ed48a0bcdc447faaba8e833a0bd60c0'
});

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// USE BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => { 
  let data = {
    clientId : 'f53d912621d942c694520248cd84db89',
    clientSecret : '8ed48a0bcdc447faaba8e833a0bd60c0' };
  res.render('index', data); });

// Retrieve an access token.
// spotifyApi.clientCredentialsGrant()
//   .then(function(data) {
//     spotifyApi.setAccessToken(data.body['access_token']);
//   }, function(err) {
//     console.log('Something went wrong when retrieving an access token', err);
// });

app.get("/random", (req, res, next) => {
  spotifyApi.clientCredentialsGrant()
    .then(i => {
      res.render("index", { artist: i.value });
    })
    .catch(err => {
      console.log('Something went wrong when retrieving an access token', err);});
});

// DISPLAY A FORM - NEW ROUTE: 
app.get('/homepage', (req, res) => { 
  res.render('homepage')
});

// POST ROUTE
app.post('/homepage', (req, res) => { 
  let artist = req.body.artist; 
  res.send(`Artist: ${artist}`); });


// Server Started
app.listen(3000, () => {
  console.log("My first app listening on port 3000!");
});


