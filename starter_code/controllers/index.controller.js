const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });



exports.home = async (req, res)=> {
    res.render("index");
}

exports.artists = async(req, res)=> {
    const {body: { artists: {items}}} = await spotifyApi.searchArtists(req.query.q).catch()

    //console.log(items)
    res.render("artists", {items});
}

exports.albums = (req, res) => {
    const { id } = req.params;

    spotifyApi.getArtistAlbums(id)
    .then(data => {

        const albums = data.body.items;
        res.render("albums", {albums});
        console.log('Artist albums', data);
      })
    .catch(err => {
        console.log(err)
    })     
}


exports.songs = (req, res) => {
    const { id } = req.params;

    spotifyApi.getAlbumTracks(id, { limit : 5, offset : 1 })
    .then(data => {

        const songs = data.body.items;
        res.render("songs", { songs });
        console.log(data.body);
  }) 
  .catch(err => {
    console.log('Something went wrong!', err);
  });

} 