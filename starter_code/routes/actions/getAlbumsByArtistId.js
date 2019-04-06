const { apiSpotify } = require(`../../config`);

const getAlbumsByArtistId = (request, response) => {
  const { artistId } = request.params;
  apiSpotify.getAlbums(artistId)
    .then( data => {
      response.render('album', { data });
    })
    .catch(error =>{
      console.log(error)
    });
}

module.exports = getAlbumsByArtistId;