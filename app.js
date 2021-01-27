require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const  SpotifyWebApi  =  require ( 'spotify-web-api-node' ) ;
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: proceso.env.CLIENT_ID,
  clientSecret: proceso.env.CLIENT_SECRET,
});

// Recupera un token de acceso
spotifyApi
  .clientCredentialsGrant()
  .luego((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Algo salió mal al recuperar un token de acceso", error)
  );

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
