var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require ('path')


// Remember to paste here your credentials
var clientId = 'f81c46e1fae8486f97bbd22784a404da',
    clientSecret = 'b4af64a67a2849699f693ce4b5cf0697';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});
//1.1. Variables
const port = 3000;

//2. config basics
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs');

//3. Config Avanzadas
app.use(express.static("public"));
hbs.registerPartials(path.join(__dirname,"/views/partials"))
app.use(bodyParser.urlencoded({extended: true}))

//4. listen
app.listen(port, () => {
  console.log('My app is listening on port 3000!')
});

//5. connect to database
mongoose.connect('mongodb://localhost/spotifyapp')

//6. Routes
//const memes  = require ('./routes/memes')
//app.use('/', memes)

app.get('/', (req,res) => {
  res.render("index")
} )


const artists  = require ('./routes/artists')
app.use('/artists', artists)


//pass spotify api to other files
app.set('spotify', spotifyApi)