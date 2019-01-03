const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const app = express();




app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));


app.get('/',(req, res, next) => {
  res.render('index')
})

app.get('/artists', (req, res, next) => {
  // const term = req.query.term;
  const { term } = req.query
  spotifyApi.searchArtists(term)
    .then(data => {
      //res.send(data.body.artists.items[0].name)
      console.log(data.body.artists.items);
      res.render('artists', {
        artists: data.body.artists.items
      });
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {console.log('Artist albums', data.body.items[0])
      res.render('albums', { 
      albums: data.body.items
    })  
    })
    .catch(err => {console.log(err)
    });
    // res.send("holi")
})

app.get('/playlist/:albumId', (req, res, next) => {
spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
    console.log(data.body.items);
    res.render("audio", {
    audios: data.body.items});
  })
  .catch(err => {
    console.log('Something went wrong!', err);
  });

})


// Remember to paste your credentials here
const clientId = '3067aa82c0e14e46ab1f9b22e10c26a0',
    clientSecret = 'cc7c7e101af64b139255f7f180cbecaa';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.listen(PORT, () => {
  console.info(`App listen at ${PORT} port`);
});