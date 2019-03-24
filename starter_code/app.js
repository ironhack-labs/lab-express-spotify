const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const clientId = '6b39444455224f89a8d97127cc3d66ca',
    clientSecret = 'c56642af6f1847509e53e73e5eb74e40';

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

app.get("/",(req,res)=>{
    console.log('get')
    res.render("index");
});

app.get('/artist', (req, res, next) => {
  const {artist} = req.query;
  spotifyApi.searchArtists(artist)
      .then(data => {
        const items = data.body.artists.items;
        res.render('artist',{items});
        console.log({items});
      })
      .catch(err => {
     console.log("fail" + err);
      });
});

// ver la info de los albumes del artista

app.get('/artist/:Id', (req, res) => {
  const Id = req.params.Id;
  spotifyApi.getArtistAlbums(Id)
      .then(data => {
          const albums = data.body.items;
          console.log(albums);
          res.render('albums', {albums});
      })
      .catch(err => {
        console.error(err);
      });
});

// para obtener la lista de canciones:

app.get('/albums/:ID', (req,res) =>{
  const ID = req.params.ID;
  console.log(ID);
  spotifyApi.getAlbumTracks(ID)
      .then(data =>{
          const tracks = data.body.items;
          console.log(tracks)
          res.render('tracks', {tracks});
      })
      .catch(err =>{
          console.log(err);
      });
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
