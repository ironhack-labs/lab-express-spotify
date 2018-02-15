const SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.use(express.json()); // to support json encoded bodies
app.use(express.urlencoded()); 


app.use(express.static("public"));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views',__dirname+'/views');
app.set('view engine', 'ejs')


const clientId = '856c2138229f4eb1863f79d05f0c2a21',
    clientSecret = 'a0655b53f4a8482196f9513d51311450';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get("/",(req,res,next)=>{
  res.render("home");
});


app.post('/artists',(req,res,next)=>{
const artist = req.body.term
console.log(req.body.term);
spotifyApi.searchArtists(artist).then((response)=>{
  console.log(response)
})
});

app.get("/artists", function (req, res, next) {
  res.render();
  next();
});

app.get('/artists', (req, res, next)=>{
  res.send('${req.body.term}')
});



app.get('/example', (req,res,next)=>{
  res.render('example');
});


app.listen(3000, function (err) { 
    if (err) console.log(err);
    console.log("Tu servidor esta funcionando en el puerto 3000")
});