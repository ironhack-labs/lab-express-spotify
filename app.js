require('dotenv').config();

const chalk = require('chalk')
const express = require('express');
const hbs     = require('hbs');

// require spotify-web-api-node package here:
const  SpotifyWebApi  =  require ( 'spotify-web-api-node' ) ;
const app             = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log(chalk.bgRed('Something went wrong when retrieving an access token', error)))
  

// Our routes go here:

app.get('/', (req, res)=>{
    res.render('home.hbs')
  })

app.get('/artist-search', async (req, res)=>{
  try {
    const spotifyArtist = await spotifyApi.searchArtists(req.query.artist)
    res.render('artist.hbs', {
      spotifyArtist: spotifyArtist.body.artists.items
    })
  } catch(err){
    console.log(chalk.bgRed(err))
  }
  
})




app.listen(3000, () => console.log(chalk.bgGreen('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')))
