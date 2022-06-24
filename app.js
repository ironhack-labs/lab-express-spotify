require('dotenv').config();

const express = require('express');
const hbs = require('hbs');



// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

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
app.get('/', function(req, res){
    res.render('index')
})

app.get('/artist-search', function(req, res){
   spotifyApi
  .searchArtists(req.query.q)
  .then(data => {
   //console.log(data.body.artists.items[0].images[0].url)
    //we used items to make it an array to iterate easily
   // console.log('The received data from the API: ', data.body);
    res.render('artist-search-result', {artistList: data.body.artists.items})
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/album/:artistId", (req, res, next) => {
    console.log('parameters: ', req.params)
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function (data) {
        console.log(data.body)
        //console.log(req.params.artistId);
        //console.log("Artist albums", data.body);
        res.render("album", { artistsAlbum: data.body.items});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err)); 
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


