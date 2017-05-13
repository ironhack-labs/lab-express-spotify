const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const express         = require('express');
const app             = express();





app.get('/', (req, res, next) => {
  res.render('index.ejs');
});
app.get('/artists', (req, res, next) => {
  let artist = req.query.artist;
  spotify.searchArtists(artist, {}, (err, data) => {
    if (err) throw err;

    let artists = data.body.artists.items;
    res.render('artist.ejs', { artists });
  });
});

app.get('/albums/:artistId', (req, res, next) => {
  res.render('album.ejs');
});

app.listen(3000, () => {
  console.log("contectado")
})
