require('dotenv').config();

const express = require('express');
const app = express();
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


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
app.get('/', function(req, res){
    console.log('hello')
    res.render('index')
})

app.get('/artist-search', function(req, res){
console.log(req.query.search)
let mysearch = req.query.search
spotifyApi
  .searchArtists(mysearch)
  .then(data => {
    //console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-result', {artists: data.body.artists.items})
    
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

// ":" => means "parameter" 
app.get('/albums/:id', function(req, res){
    console.log(req.params.id)
    let mysearch = req.params.id
    spotifyApi
      .getArtistAlbums(mysearch)
      .then(data => {
        console.log('The received data from the API: ', data.body.items);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('albums', {artists: data.body.items})
        
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
    })

app.get("/tracks/:id", (req, res) => {
    const id = req.params.id;
    spotifyApi
        .getAlbumTracks(id)
        .then((data) => {
            const tracks = data.body.items;
            res.render("tracks", {
                tracks,
                // query: found,
            })
        })
        .catch((error) => console.error("Error by retrieving albums tracks", error));
});
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
