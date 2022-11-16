require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// register partials 
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:

// --------------------------- globa variables --------------------------- //
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, // process get me the environment variables 
    clientSecret: process.env.CLIENT_SECRET

});



// promise then catch
// spotifyApi
//     .clientCredentialsGrant()
//     .then(data => {spotifyApi.setAccessToken(data.body['access_token'])})
//     .catch(error => console.log('Something went wrong when retrieving an access token', error));


// -------- THE SAME -------
// with async await as self calling function
(async () => {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token'])

    } catch (error) {
        console.log('Something went wrong when retrieving an access token', error)
    }
})();
// Our routes go here:

// ------------------------------ main route ------------------------------ //
app.get('/', (req, res) => {

    // const data = {
    //     layout: false
    // }
    res.render('index')
})


// ------------------------------ artist-search route ------------------------------ //
app.get('/artist-search', async (req, res) => {

    // ------------------------------------ with then catch ------------------------------------ //
    // spotifyApi
    //     .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
    //     .then(data => {
    //         console.log('The received data from the API: ', data.body);
    //         // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    //     })
    //     .catch(err => console.log('The error while searching artists occurred: ', err));


    // ------------------------------------ OR ASYNC AWAIT ------------------------------------ //

    try {

        const data = await spotifyApi.searchArtists(req.query.artist)// artist is the name of the input tag
        // console.log('The received data from the API: ', data.body);

        const artistArray = data.body.artists.items

        // console.log(artistArray[0])


        res.render('artist-search-results', { artistArray })

    } catch (error) {
        console.log('The error while searching artists occurred: ', error);
    }

})


// ------------------------------ ablums route ------------------------------ //


app.get('/albums/:artistId', async (req, res, next) => {



    const artistID = req.params.artistId

    const artist = await spotifyApi.getArtist(artistID)

    const artistName = artist.body.name;
    // console.log(artistName)

    // console.log(artistID)

    // ------------------------------------ with then catch ------------------------------------ //

    // spotifyApi.getArtistAlbums('artistID').then(
    //     function (data) {
    //         console.log('Artist albums', data.body);
    //     },
    //     function (err) {
    //         console.error(err);
    //     }
    // );

    // ------------------------------------ OR ASYNC AWAIT ------------------------------------ //

    try {

        const data = await spotifyApi.getArtistAlbums(artistID)

        const albumArray = data.body.items

        // console.log(albumArray[0])

        res.render('albums', { albumArray, artistName })


    } catch (error) {
        console.error('An error occurer while geting the album ', error);
    }

});


// ------------------------------ track route ------------------------------ //


app.get('/tracks/:albumID', async (req, res) => {

    const albumID = req.params.albumID
    // ------------------------------------ with then catch ------------------------------------ //

    // Get tracks in an album
    // spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit: 5, offset: 1 })
    //     .then(function (data) {
    //         console.log(data.body);
    //     }, function (err) {
    //         console.log('Something went wrong!', err);
    //     });

    // ------------------------------------ OR ASYNC AWAIT ------------------------------------ //

    try {
        const data = await spotifyApi.getAlbumTracks(albumID, { limit: 6, offset: 0 }) // only 6 songs starting in the first 0

        const trackArray = data.body.items

        // console.log(trackArray[0])
        res.render('tracks', { trackArray })



    } catch (error) {
        console.log('Something went wrong!', error);
    }
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
