require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");


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
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      //console.log("Something went wrong when retrieving an access token", error);
    });










// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
})


app.get('/artists', (req, res, next) => {

    //console.log(req.query);//{ artistName: 'drake' }

    spotifyApi.searchArtists(req.query.artistName).then(data => {
        
        //console.log("The received data from the API: ",  data.body.artists.items);

        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
         res.render('artists.hbs', {items: data.body.artists.items});

        })
        .catch(err => {
            //console.log("The error while searching artists occurred: ", err);
        });
})



app.get('/albums/:albumsID', (req, res, next) => {
    
    //console.log(req.params);
    
    spotifyApi.getArtistAlbums(req.params.albumsID)
        .then(function(data) {
            console.log('Artist albums', data.body.items);
           
            res.render(`albums`, { items: data.body.items});

        }, function(err) {  
            //console.error(err);
        });

})



app.get('/tracks/:tracksID', (req, res, next) => {
   
   
    spotifyApi.getAlbumTracks(req.params.tracksID)
        .then(function(data) {
            console.log(data.body.items);
            res.render('tracks', {items : data.body.items});
  }, 
  function(err) {
    console.log('Something went wrong!', err);
  });
})





app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));



