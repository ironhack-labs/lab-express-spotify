require('dotenv').config()
const express = require('express');
const hbs = require('hbs');
//const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
// const spotifyApi = new SpotifyWebApi({
//     clientId: process.env.IH_SE_CLIENT_ID,
//     clientSecret: process.env.IH_SE_CLIENT_SECRET
// });


// spotifyApi
//     .clientCredentialsGrant()
//     .then(data => {
//         //console.log(data)
//         spotifyApi.setAccessToken(data.body["access_token"]);
//     })
//     .catch(error => {
//         console.log("Something went wrong when retrieving an access token", error);
//     });

// // the routes go here:

console.log(Math.random(), "+_+", )

app.get('/hi', (req, res, next) => {
    console.log('wtf????')
    res.end()
})
app.get('/artists', (req, res, next) => {
    console.log(req.query)
        // spotifyApi
        //     .searchArtists(req.query.artistName)
        //     .then(data => {
        //         console.log("The received data from the API: ", data.body);
        //         // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        //         res.status(300).json(data)
        //             //res.render('artists', { items: data.body.artists.items })
        //             // res.render('artists', data.artists)
        //     })
        //     .catch(err => {
        //         console.log("The error while searching artists occurred: ", err);
        //         res.status(404).send(err)
        //     });
})

//app.get('')

// app.get('/', (req, res, next) => {
//     res.render('artist')
// })
app.listen(3000, () => console.log("My Ssfdgsg potify project running on port 3000 🎧 🥁 🎸 🔊"));