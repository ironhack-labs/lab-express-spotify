const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '53cf15d38928468abac8157c59700804',
    clientSecret = 'a385458d662143eb977a1207d405cc18';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

  
    function getArtists(params) {

       return spotifyApi.searchArtists(params)

            .then(data => {
            
                return data.body
                
            })
            .catch(err => {
                console.log("The error while searching artists occurred: ", err);
            })
        }
     
  function getAlbums(params){
       
     return spotifyApi.getArtistAlbums(params)

        .then(data => {

            return data.body
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
        
    }

    module.exports = {getAlbums,getArtists}
