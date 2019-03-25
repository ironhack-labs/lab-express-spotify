const express =       require('express');
const hbs =           require('hbs');
const SpotifyWebApi = require('spotify-web-api-node'); 

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId   = '14e3b24bdcc54f8aa2f94acb66b52445',
    clientSecret = 'd6cdb344db414d3e80611e1b32e47a9a';

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

// the routes
app.use('/', function (req, res, next) {
  console.log(req.url);
  next();
})

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist) // artist comes from the 'name=' (in serch form)
    .then( data => {
      console.log("The received data from the API: ", data.body);
      res.render('artists', data.body);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  });

  //artist's all albums:
  app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then( album => {
        //console.log('Artist albums', album.body);
        res.render('albums', album.body);
      debugger
      })
      .catch (err =>{
        console.error(err);
      })
  });

  // see tracks:
  app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
      .then(tracks => {
      //console.log(tracks.body.items[0]);
      res.render('tracks', tracks.body)
  })
  .catch(err => {
    console.log('Something went wrong!', err);
  });
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
