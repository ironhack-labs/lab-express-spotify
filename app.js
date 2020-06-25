require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials")


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
/*

const Dog = require('./models/Dog.model')

app.get('/', (req, res) => res.render('index'))
app.get('/perrinos', (req, res) => {
    Dog.find({ name: 'Popino' })
        .then(dogs => res.render('dogs-list', { dogs }))
        .catch(err => console.log(err))
})
*/


app.get('/', (req, res) => res.render('index'))
app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            const dataArtist = data.body.artists.items

            dataArtist.forEach(e => console.log(e.name, e.id, e.images[1]));

            console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

            res.render(`artist-search-results`, { dataArtist })

        })

        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:id', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            res.render('albums', { data }))
}
           
        .catch (err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3042, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
