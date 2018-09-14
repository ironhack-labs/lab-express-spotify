
//importaciones
const express = require('express');
const hbs = require('hbs');
const path = require('path')

//variable
const port = 3000;

//config basic
const app = express();

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '10a31eb8eee44fc693d10b56d0d13925',
    clientSecret = '57d07cf58a59433bb430904e9aa6e73c';
const spotifyApi = new SpotifyWebApi({
  clientId, clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get('/', (req, res)=>{
    res.render('home')
})

//listener
app.listen(port, ()=> console.log('escuchandote en el puerto 3000'))