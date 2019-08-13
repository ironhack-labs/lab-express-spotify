const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = '0556e64d03064177b1992df58bcba884',
    clientSecret = '51ec9a24ad874f0fbd6c52c938fe1dc6';

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
app.get('/', (req, res, next) => res.render('index'));


app.get('/artists', (req,res,next)=>{
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    res.render('artists', {artists: data.body.artists.items});
    console.log("The received data from the API: ", data.body.artists.items);
    // ----> ‘HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API’
  })
  .catch(err => {
    console.log("The error while searching artists occurred:" , err);
  })
})
  
//:id me representa lo que viene atras del URL albums/Queen
app.get('/albums/:id', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.id)
       .then(data => {
         console.log('The albums are:', data.body.items);
         res.render('albums', {albums: data.body.items});
         // ----> ‘HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API’
       })
       .catch(err => {
         console.log('The error while searching albums occurred:' , err);
       })
  
});

app.get('/tracks/:id', (req, res, next) => {
  //artistToFind
  spotifyApi.getAlbumTracks(req.params.id)
      .then(data => {
        console.log('The tracks are:', data.body.items);
        res.render('tracks', {tracks: data.body.items});
        // ----> ‘HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API’
      })
      .catch(err => {
        console.log('The error while searching tracks occurred: ', err);
      })

    });


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
