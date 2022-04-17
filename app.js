require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      // console.log('The received data from the API: ', data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const artist = data.body.artists.items;

      // console.log(artist);
      res.render('artist-search-results', { artist });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      // console.log(data.body);

      const album = data.body.items[0];
      const images = data.body.items[0].images[0];
      console.log(images);
      res.render('albums', { album, images });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);

// // router.get('/books/:bookId', (req, res, next) => {
//   const { bookId } = req.params;

//   Book.findById(bookId)
//     .then((theBook) => res.render('books/book-details.hbs', { book: theBook }))
//     .catch((error) => {
//       console.log('Error while retrieving book details: ', error);

//       // Call the error-middleware to display the error page to the user
//       next(error);
//     });
