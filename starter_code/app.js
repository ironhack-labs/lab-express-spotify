const express = require('express');
const hbs = require('hbs');
require('dotenv').config()
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node')

const ID = process.env.ID
const SECRET = process.env.SECRET
const PORT = process.env.PORT

// require spotify-web-api-node package here:
// setting the spotify-api goes here:


const app = express();

//MIDDLEWARE
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({extended:true}))



// Remember to insert your credentials here

const spotifyApi = new SpotifyWebApi({
  clientId : ID,
  clientSecret : SECRET
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

//MAIN ROUTER 

app.use('/', require('./routes'))
//

// the routes go here:



app.listen(PORT, () => console.log(`My Spotify project running on port ${PORT} 🎧 🥁 🎸 🔊`));
