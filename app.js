require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
    app.get("/", (req, res) => {
        res.render("homepage");
      });

    app.get("/artist-search", (req, res) => {
        console.log(req.query)

        spotifyApi
        .searchArtists(req.query.artistName.toLowerCase())
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items[0].images/*, data.body.artists.items[2].images*/ );
            
            res.render('artist-search-results', {
                artists: data.body.artists.items
              });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));                
    });

    
    app.get("/albums/:id", (req, res) => {

        spotifyApi.getArtistAlbums(req.params.id).then(
            function(data) {res.render("albums", {
              albums: data.body.items
            })
              console.log('Artist albums', data.body.items);
            },
            function(err) {
              console.error(err);
            }
          );
    })


    app.get("/tracks/:albumId", (req,res) => {
      spotifyApi.getAlbumTracks(req.params.albumId)
        .then(function(data) {
          res.render("tracks", {
            tracks: data.body.items
          });
    }),
    
    function(err) {
      console.log('Something went wrong!', err);
     }});
  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
