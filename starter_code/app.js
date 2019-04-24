const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:
const clientId = '0535c4c3c6ad40e0aece0f616b006be6',
    clientSecret = '7bc4e07883134c8ba10dcbb77823960c';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })





// the routes go here:
app.get('/',(req,res,next) =>{ //index always has nothing after the domain name
  res.render('index.hbs')
})

app.get('/artists',(req,res,next) =>{ //index always has nothing after the domain name
  spotifyApi.searchArtists(req.query.search) // query --- > ?   param --> /
  .then(data => {
    res.render('artists', {items: data.body.artists.items})
    console.log("The received data from the API: ", data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
})
 
app.get('/albums/:id',(req,res,next) =>{ //:id is to track that specific album
  spotifyApi.getArtistAlbums(req.params.id).then(data=>{
    let items = data.body.items
    res.render('albums',{items})
  })
})




app.get('/tracks/:albumsId', (req, res, next)=> {
  spotifyApi.getAlbumTracks(req.params.albumsId).then(data=>{
      res.render('tracks.hbs',{items:data.body.items})
    }) 
  })


  app.listen(3005, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"))
