// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
spotifyApi
.clientCredentialsGrant()
.then(data => {
spotifyApi.setAccessToken(data.body["access_token"]);
})
.catch(error => {
console.log("Something went wrong when retrieving an access token", error);
});

exports.home = (req, res) => { 
    res.render("index");
};

exports.artists = (req, res) => { 
    const { name } = req.query;
    console.log(name)
    spotifyApi
    .searchArtists(name)
    .then(data => {
        // console.log("The received data from the API: ", data.body.artists.items);
        const artists = data.body.artists.items
        res.render("artists", {artists});
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
        // console.log("The error while searching artists occurred: ", err);
    });
};

exports.albums = (req, res) => { 
    const { artistId } = req.params;
    spotifyApi.getArtistAlbums(artistId, {limit: 6, offset: 10})
    .then(function(data) {
        console.log('Album information', data);
        const albums = data.body.items
        res.render("albums", {albums});
      }, function(err) {
        // console.error(err);
      });
};


exports.tracks = (req, res) => { 
    const { trackIds } = req.params;
    spotifyApi.getAlbumTracks(trackIds, { limit : 5, offset : 1 })
    .then(function(data) {
        
    console.log(data.body.items);
    const tracks = data.body.items
    res.render("tracks", {tracks});
    }, function(err) {
    console.log('Something went wrong!', err);
    });
};


