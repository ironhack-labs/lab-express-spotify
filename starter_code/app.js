require('dotenv').config()
const express = require('express');
const hbs = require('hbs');
const spotifyWebApi= require ('spotify-web-api-node')

// require spotify-web-api-node package here:
const clientId = process.env.CLIENT
const clientSecret = process.env.CLIENTSECRET
//instancia del API con las credenciales
const spotifyApi = new spotifyWebApi({
  clientId,
  clientSecret 
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
   
  })

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:






// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
