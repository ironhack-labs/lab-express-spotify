//To avoid making our API keys public, we don't want to add and commit them.
// We'll use a package named dotenv for that.
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')
// require spotify-web-api-node package here:
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

//This package is imported at the very beginning of app.js. All that 
//is left to do is to add your keys in the .env file.
//CLIENT_ID=your clientId goes here
//CLIENT_SECRET=your clientSecret goes here
//The .env is referred to in the .gitignore file so you're safe!

// Our routes go here:
//create a homepage
app.get('/', (req, res) => {
    res.render('index')
})
app.get('/artist-search', (req, res, next) => {
  //  console.log(data.body.name)
    console.log(req.query)
  //  console.log(data.body.artists)
    spotifyApi
        .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/req.query.artist)
        .then(data => {
         // console.log('The received data from the API: ', data.body);
         //CORRECT
       //  console.log(data.body.artists.items)
       //try
        // console.log(data.body.artists.items.images.url)
          // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
          res.render('artist-search-result',  data.body  )
          
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
        
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
