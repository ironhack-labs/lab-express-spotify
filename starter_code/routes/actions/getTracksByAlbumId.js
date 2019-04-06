const { apiSpotify } = require(`../../config`);

const getTracksByAlbumId = (request, response) => {
  const {albumId} = request.params;
  apiSpotify.tracks(albumId)
    .then(data => {
      response.render('tracks', { data });
    })
    .catch(error => {
      console.log(error);
    });
}


module.exports = getTracksByAlbumId;