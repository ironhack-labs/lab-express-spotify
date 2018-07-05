const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const bodyparser = require('body-parser')
const hbs = require('hbs');
const debug = require('debug')('irondemo:app');
const path = require('path');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');
app.use(bodyparser.urlencoded({ extended: true }));



// Remember to paste here your credentials
var clientId = '31fe59c0ad7343b7a4c50474f5f34ad5',
    clientSecret = '118878f6bffc422ab2f2d0665ae2b6bd';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get('/',(req,res) => {
    res.render('home',{
    
    });
}) 

app.post("/artists", (req, res) => {
    const artist = req.body.artist;
  
    spotifyApi.searchArtists(artist)
    .then(data => {
        console.log(data)
        let artistArr = data.body.artists.items;
        console.log(artistArr[0])
      
        res.render('artist',{data: artistArr});

      })
      .catch(err => {
        console.error(err);
      });
  });

  app.get('/albums/:artistId', (req, res) => {

   const albums= req.params.artistId
   spotifyApi.searchArtists(albums)
      .then(data => {
        let albumArr = data.body.items;
         res.render('albums',{data: albumArr});
       })
       .catch(err => {
         console.log('Error retrieving the data', err);
       })

  });


app.listen(3000, () => {
    console.log('listening')
})