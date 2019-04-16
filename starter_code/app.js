const express = require('express');
const hbs = require('hbs');
const path = require('path')
const bodyParser = require('body-parser')
const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.urlencoded({ extended: true }))
hbs.registerPartials(__dirname + '/views/partials');
// hbs.registerPartial('artistpartial', '{{artistpartial}}')

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId : '5d23562243044ee3b584a326d7fdd4ab',
  clientSecret : 'ccf90f60a77f46afa5423ea204e6dc61'
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log(data.body['access_token'])
  })
  .catch(error => {
    console.log('Something went wrong when retireving an access token', error);
  })





// the routes go here:

app.get('/', (req, res, next) => {
  res.render('index');
});

// app.post('/artists', (req, res, next) => {
//   let artist = req.body.artist
//   res.send(artist)
// })

app.post('/artists', (req, res, next) => {
  let artist = req.body.artist
  spotifyApi.searchArtists(artist)
  // .then(data => {
  //   const art = data.body.artists.items;
  //   //name = .name
  //   //image = .images.url
  //   //link = .uri
  //   res.send(art);
  // })
  .then(data => {
    const artists = data.body.artists.items;
    res.render('artist', { artists });
    console.log("The received data from the API: ", data.body);
  })
  .catch(error => {
    console.log("The error while searching artist occurred: ", error);
  });
});

app.get('/albums/:artistId', (req, res, next) => {
  let album = req.params.artistId;
  
  spotifyApi.getArtistAlbums(album)
    .then(data => {
      let albumData = data.body.items;
      res.render('albums', { albumData });
    })
    // .then(data => {
    //   res.send(data.body.items);
    // })
    .catch(error => {
      console.log("error with albums")
    })
})

app.get('/tracks/:tracksId', (req, res, next) => {
  let tracks = req.params.tracksId;

  spotifyApi.getAlbumTracks(tracks)
    // .then(data => {
    //   let tracksData = data.body.items;
    //   res.send(tracksData);
    // })
    .then(data => {
      let tracksData = data.body.items;
      res.render('tracks', { tracksData });
    })
    .catch(error => {
      console.log("error with tracks")
    })
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
