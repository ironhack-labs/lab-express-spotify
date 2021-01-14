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

module.exports.home = (req, res, next) => {
    res.render('common/home')
}

module.exports.search = (req, res, next) => {
spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', { items: data.body.artists.items })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
}

module.exports.showAlbums = (req, res, next) => {
    const { id } = req.params;
    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            console.log(data.body);
            res.render('albums', { items: data.body.items })
        })
        .catch(err => err)
}

module.exports.showTracks = (req, res, next) => {
    const { id } = req.params;
    spotifyApi
        .getAlbumTracks(id)
        .then(data => {
            console.log(data.body.items);
            res.render('tracks', { items: data.body.items })
        })   
        .catch(err => err)
}