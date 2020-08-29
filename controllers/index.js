const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

exports.index = (req, res, next) => {
    res.render('index', {layout: false})
};

exports.artistSearch = async (req, res, next) => {
    let { search } = req.query;
    let serachURI = encodeURI(search);//Case need to save searched string

    let data = await spotifyApi
    .searchArtists(search)
    .catch(err => console.log('The error while searching artists occurred: ', err));

    let {body: {artists: {items: itemsSearched }}} = data;

    res.render("artist-search-results", {itemsSearched, search})
};

exports.albumsId = async (req, res, next) => {
    let { id } = req.params;

    let data = await spotifyApi
    .getArtistAlbums(id)
    .catch(err => console.log(`The error while searching artist's albums`, err));

    let {items: itemsAlbums} = data.body;
    let {name: artistName} = itemsAlbums[0].artists[0]

    res.render("albums", {itemsAlbums, artistName})
};

exports.tracksId = async (req, res, next) => {
    let { trackId } = req.params;

    let dataAlbum = await spotifyApi
    .getAlbum(trackId)
    .catch(err => console.log(`The error while searching artist's albums`, err));

    let data = await spotifyApi
    .getAlbumTracks(trackId, { limit: 50 })
    .catch(err => console.log(`The error while searching tracks's album`, err));

    let {name: albumName} = dataAlbum.body
    let {name: artistName, id: artistId} = dataAlbum.body.artists[0];
    let {items: itemsTracks} = data.body;
    //itemTracks[??].preview_url | may be null because of country restriction
    res.render("tracks", {itemsTracks, albumName, artistName, artistId})
};