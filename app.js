require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
app.get("/", (req, res) => {
    res.render("index")
})
//res.render(data.body.artists.items[0].images)
app.get("/artist-search", (req, res) => {
    console.log("Artist came from browser - request")
    console.log(req.query.artist)

    //creating an object


    spotifyApi.searchArtists(req.query.artist)
        //.then(data => {console.log(data.body.artists.items)})
        .then((data) => {

            const artistImage = data.body.artists.items[0].images[0].url;
            const artistName = data.body.artists.items[0].name;
            const artistId = data.body.artists.items[0].id;
            // console.log(artistObject)
            res.render("artist-search-result", { artistImage: artistImage, artistName: artistName, artistId: artistId })
        })

        //res.render("artist-search-result",{artist:data.body.artists.items})})
        .catch(err => console.log(err))
})



app.get("/albums/:artistId/", (req, res, next) => {
    // .getArtistAlbums() code goes here

    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then((data) => {
            const albumItems = data.body.items
            let arrayDisc = [];
            albumItems.forEach(itemArray => {
                let albumComplete = {
                  albumName: itemArray.name,
                  albumImg: itemArray.images[0].url,
                  albumId: itemArray.id
                };
                //push na array que criei
                arrayDisc.push(albumComplete);
              });

            //console.log(arrayDisc)
            res.render("albums", { arrayDisc });
        })
        .catch(err => console.log(err))
})
// Our routes go here:

//
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
