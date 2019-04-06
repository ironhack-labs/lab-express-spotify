const { apiSpotify } = require(`../../config`);

const getArtists = (request, response) => {
  const { artist } = request.query;
  apiSpotify.getArtists(artist)
    .then(data =>{
      response.render('artists', { data });
    })
    .catch(error =>{
      console.log(error);
   });
}

module.exports = getArtists;