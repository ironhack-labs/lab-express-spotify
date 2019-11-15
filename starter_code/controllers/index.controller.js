require("dotenv").config();

const SpotifyWebApi = require("spotify-web-api-node")

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"])
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error)
    })


exports.home = (req, res) => {
    res.render("index");
};

exports.artists = (req, res) => {
    const {
        q
    } = req.query;
    spotifyApi.searchArtists(q)
        .then(data => {
            const artists = data.body.artists.items
            res.render('artists', {
                artists
            })
        })
};


exports.albums = (req, res) => {
    const {
        artistId
    } = req.params;
    console.log(artistId)
    spotifyApi.getArtistAlbums(artistId, {
            limit: 10,
            offset: 20
        })
        .then(function (data) {
            // console.log('Album information', data);
            const albums = data.body.items
            res.render("albums", {
                albums
            });
        }, function (err) {
            // console.error(err);
        });
};




exports.tracks = (req, res) => {
    const {
        trackIds
    } = req.params;
    // console.log(req.params)
    spotifyApi.getAlbumTracks(trackIds, {
            limit: 5,
            offset: 1
        })
        .then(function (data) {
            console.log(data.body.items);
            const tracks = data.body.items
            res.render("tracks", {
                tracks
            });
        }, function (err) {
            console.log('Something went wrong!', err);
        });

};