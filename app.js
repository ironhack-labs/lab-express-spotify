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
app.get('/', (req, res, next) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => { /* req.query, la query que le hago a traves del browser */
    /*console.log(req.query)*/ /* { artist: 'U2' } */
    spotifyApi
        .searchArtists(req.query.artist) /* I get to know it is artist because of line 33 */
        .then(data => {
            /* console.log(data) = { body: { artists { href, items: [Array], limit, next, offset, previous, total } }, headers, statusCode }*/
            /* console.log(data.body) = { artists { href, items: [[Object]], limit, next, offset, previous, total } } */
            /* console.log('The received data from the API: ', data.body.artists.items); */

            /*if (data.body.artists.items[0].images.length !== 0)
                console.log('The received data from the API: ', data.body.artists.items[0].images[0].url); items are the different results for one artist */

            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            /*const albums =*/
            res.render('artist-search-results', {
                artistResults: data.body.artists.items
            }) /* el data que entra por el then, es el resultado de la promesa, no es un objeto, no es el objeto que creaba yo, por eso lo creo en esta linea  */
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => { /* req.params */
    /*console.log(req.params);*/ /* { artistId: '51Blml2LZPmy7TTiAg47vQ' } */
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            /*console.log('Artist albums', data.body.items[0].images[0]);*/
            /*console.log('Logged in the terminal', data.body.items);*/
            res.render('albums', {
                albumsResults: data.body.items
            })
        })
        .catch(err => console.error(err));
})

app.get('/trucks/:albumId', (req, res) => { /* req.params */
    console.log(req.params); /* { albumId: '3TbG4ZvwHmzkU9JGltkxnf' } */
    spotifyApi.getAlbumTracks( req.params.albumId, { limit : 5 } )
  .then(data => {
    console.log(data.body.items[0].external_urls.spotify);

    /*fetch()

    const trucksResults = {
        names: data.body.items.name,
        href: data.body.items.href 
    }
    
    res.render('trucks', { trucksResults })*/
    res.render('trucks', { trucksResults: data.body.items })
  })
  .catch(err => console.log('Something went wrong!', err))
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));