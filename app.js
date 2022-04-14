require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
})

app.get('/artist-search', (req, res) => {
    const { artistName } = req.query

    spotifyApi
        .searchArtists(artistName)
        .then(data => {

            const artist = data.body.artists.items
            res.render('artist-search-results', { artist })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            const album = data.body.items
            console.log(album.images)
            res.render('albums', { album })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/tracks/:albumId', (req, res, next) => {
    const { albumId } = req.params

    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            const tracks = data.body.items
            res.render('tracks', { tracks })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})






// spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit: 5, offset: 1 })
//     .then(function (data) {
//         console.log(data.body);
//     }, function (err) {
//         console.log('Something went wrong!', err);
//     });



//
// router.get('/libros/detalles/:book_id', (req, res) => {

//     const { book_id } = req.params
//     Book
//         .findById(book_id)
//         .then(book => {
//             res.render('books/book-details', book)
//         })
//         .catch(err => console.log(err))
// })



// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
//     function (data) {
//         console.log('Artist albums', data.body);
//     },
//     function (err) {
//         console.error(err);
//     }
// );
//



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
