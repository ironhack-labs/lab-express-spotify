const SpotifyWebApi = require('spotify-web-api-node');
const spotify = new SpotifyWebApi();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan     = require('morgan');
// ...
function myFakeMiddleware(req, res, next){
  console.log("myFakeMiddleware was called!");
  next();
}


let app = express();

app.use(morgan(`dev`));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));



// spotify.searchArtists("The Beatles", {}, (err, data) => {
//   if (err) throw err;
//
//   let artists = data.body.artists.items;
//   console.log(artists);
// });


app.get('/', (req, res, next) => {

  res.render("index");

});

app.get('/artists', (req, res, next)=>{
  console.log(req.query.artist);

  spotify.searchArtists(req.query.artist, {}, (err, data) => {

    if (err) throw err;
      let artists = data.body.artists.items;

      res.render("artists", {artists: artists});


  });

});

app.get('/albums/:artistId', (req, res, next) => {
  console.log(req.url.substring(req.url.lastIndexOf('/')+1));
  spotify.getArtistAlbums(req.url.substring(req.url.lastIndexOf('/')+1), {}, (err, data)=> {
    if (err) throw err;
      let albums = data.body.items;
      res.render("albums", {albums: albums});

  });
});

app.get('/tracks/:tracksId', (req, res, next) => {
  console.log(req.url.substring(req.url.lastIndexOf('/')+1));
  spotify.getAlbumTracks(req.url.substring(req.url.lastIndexOf('/')+1), {}, (err, data)=> {
    if (err) throw err;
      let tracks = data.body.items;

      res.render("tracks", {tracks: tracks});

  });
});



app.listen(3000, () => {
  console.log("My first app listening on port 3000!");
});
