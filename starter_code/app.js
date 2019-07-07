const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
hbs.registerPartials(__dirname + '/views/partials')
// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = 'bc601c18f9be413f93bc2e24eab366ec',
    clientSecret = 'c0ae5ac7f5b1458fa6b4e7ec6471e7f4';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


// the routes go here:
app.get('/', function (req, res) {
  res.render('homepage')
})
app.post('/artists', (req, res, next) => {
  console.log(req.body);
    spotifyApi.searchArtists(req.body.artistsSearch)
        .then(data => {
         console.log("The received data from the API: ", data.body.artists.items[0]);
         res.render('artists', {artist: data.body.artists.items});
      
        })
        .catch(err => {
          console.log("The error while searching artists occurred: ", err);
        })
  })


  app.get('/albums/:artistId', (req, res, next) => {
      let theID =  req.params.artistId;
    spotifyApi.getArtistAlbums(theID).then(
      function(data) {
        console.log('Artist albums', data.body);
       res.render('albums' ,{album: data.body.items});
      },
      function(err) {
        console.error(err);
      }
      );
    });



    app.get('/tracks/:albumID' , (req,  res, next) => {
      let newID = req.params.albumID;
      spotifyApi.getAlbumTracks(newID)
      .then(function(data) {
        console.log(data.body);
        res.render('tracks', {track: data.body});
      }, function(err) {
        console.log('Something went wrong!', err);
      });
      
    });




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
