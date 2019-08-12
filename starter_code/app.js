const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = 'bf4653f2845a48439f183bde80d3751b',
    clientSecret = '9e2d88cf381a42168ba80b4d72868286';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    console
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


app.get('/',(req,res) => {
  res.render('home');
});

app.get('/artists',(req,res) => {
  let artists = req.query.artist;
    spotifyApi.searchArtists(artists)
      .then(data => {
;
          res.render('artists',{artists: data.body.artists.items});

      })
      .catch(err => {
          console.log("The error while searching artists occurred: ", err);
  });
});


app.get('/albums/:artistId',(req,res) => {
  let artist = req.params.artistId;
  spotifyApi.getArtistAlbums(artist)
    .then(data => {
    

      res.render('albums',{albums :data.body.items});
  
    })
    .catch(err => { console.error("The error while searching artists occurred: ",err);
  });
});

app.get('/tracks/:trackId',(req,res) => {
  let album = req.params.trackId; 

  spotifyApi.getAlbumTracks(album, { limit : 10, offset : 1 })
  .then(function(data) {
    let tracks = data.body.items;

    res.render('tracks',{tracks:data.body.items});
  
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
