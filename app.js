require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser')



// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) 

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

// Our routes go here:

app.get('/', (req,res)=>{
    res.render('index')
})
let searchTerm;
let searchResults;
let imageToUse;

app.get('/artist-search', (req,res)=>{
    searchTerm = req.query
    console.log(req.path)
    console.log(searchTerm)
    spotifyApi
    .searchArtists(searchTerm.artist)
    .then(data => {
    console.log('The received data from the API: ', data.body);
    searchResults = data.body.artists.items;
    console.log(searchResults)
    console.log(searchResults[2].genres[0])
    console.log(searchResults[1].images[1].url)
    
    
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .then (()=>res.render('artist-search-results', {searchResults, imageToUse}))
  //.then ((data)=> {
  //  console.log(data)
  //  res.render('artist-search-results', data)
  //})
  .catch(err => console.log('The error while searching artists occurred: ', err));
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
