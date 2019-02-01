const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const clientId =  '356bef0652fb42a7be03f629d060254d'
const clientSecret = 'ec02e3d8777544139617e8fd4d5dee80'

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

app.get('/', (req, res, next) => {
  res.render('index');
});


app.get('/artists', (req,res, next)=>{
 spotifyApi.searchArtists(req.query.searchartists)
    .then(data => {
const albums = data.body.artists.items;
      res.render('artists',{albums})
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

})


app.get('/albums/:id', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.id)
  .then((data)=>{

    const albums = data.body.items


    res.render('albums',{albums})

  })

});

app.get('/tracks/:id', (req, res, next) => {



  spotifyApi.getAlbumTracks(req.params.id)
  .then((data)=>{

  const tracks = data.body.items

  console.log(tracks)
    res.render('tracks',{tracks})

  })

});


// Retrieve an access token.



// setting the spotify-api goes here:






// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
