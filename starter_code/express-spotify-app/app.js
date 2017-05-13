const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const express         = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  let artistlist = req.query.artist;
  spotify.searchArtists(artistlist, {}, (err, data) => {
    if (err) throw err;
    let artists = data.body.artists.items;
    // Render after the data from spotify has returned
    res.render('artists',  {artists} );
  });
});


app.get('/albums/:artistId', (req, res) => {
  // code
    let artistId =req.query.artists.items.
  res.render('');
});



app.listen(3000, () => {
  console.log('My first app listening on port 3000!')
});
