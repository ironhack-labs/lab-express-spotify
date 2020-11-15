require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', (req, res) => {
  res.render('index')
});

app.get('/artist-search-results', (req, res) => {
  // res.send(req.query.q)
  const searchedArtist = req.query.q.toLowerCase()
  spotifyApi
    // .searchArtists('Love') // Ex. from docs
    .searchArtists(searchedArtist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items[0].images[0].url)
      res.render('artist-search-results', {
        artist: data.body.artists.items
      })

      // res.json(artist.body); // to see json in browser
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  const artistID = req.params.artistId;
  // const artistName = req.params.artistName;
  spotifyApi
    // .searchArtists('Love') // Ex. from docs
    .getArtistAlbums(artistID)
    .then (data => {
      console.log("Albumdaten",data.body.items)
      res.render('albums', {albums:data.body.items})
    })
    
    // .then(data => {
    //   console.log('The received data from the API: ', data)
    //   res.render('/albums/:artistId', {
    //     albums: data
    //   })

      // res.json(artist.body); // to see json in browser
    // })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});

// const searchedMovies = movies.filter(movie => movie
//     .title
//     .toLowerCase()
//     .includes(req.query.q.toLowerCase())
// );
// console.log(searchedMovies);
// res.render('movies', { moviesList: searchedMovies })





/* Direkt von Spotifys Doku */
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
//     function(data) {
//       console.log('Artist albums', data.body);
//     },
//     function(err) {
//       console.error(err);
//     }
//   );



// app.get('/movies', (req, res) => {
//     // res.send(req.query.q)
//     const searchedMovies = movies.filter(movie => movie
//         .title
//         .toLowerCase()
//         .includes(req.query.q.toLowerCase())
//     );
//     console.log(searchedMovies);
//     res.render('movies', { moviesList: searchedMovies })
// })

// Ende Routes
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));