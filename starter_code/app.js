const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}))
hbs.registerPartials(__dirname + '/views/partials');

const clientId = '473d2e93fd804e769b8aa69617dca573';
const clientSecret = '5a2875581fcd4b579cab707fd1f30132';

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


app.get('/', (req, res) => {
    res.render('homepage')
});

app.get('/artists', (req, res) => {
    const artist = req.query.artist;

    spotifyApi.searchArtists(artist)
    .then(data => {
        const items = data.body.artists.items;
        res.render('artists', {items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
      res.redirect('/');
    })
});

app.get('/albums/:id', (req, res) => {
  const id = req.params.id;

  spotifyApi.getArtistAlbums(id)
    .then(data => {
      const items = data.body.items
      console.log(items)
      res.render('albums', {items})
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
})

app.get('/albums/tracks/:id', (req, res) => {
  const id = req.params.id;
  console.log(id)
  spotifyApi.getAlbumTracks(id)
    .then(data => {
      const tracks = data.body.items;
      console.log(data.body)
      res.render('tracks', {tracks})
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
