"use strict";

const clavesSpotify = require('../../../../../../app/credenciales-spotify.json');
const SpotifyWebApi = require('spotify-web-api-node');

//confirmar que se len las claves desde el path
//console.log(clavesSpotify);


const spotifyApi = new SpotifyWebApi(clavesSpotify);

//Paso 1 solicitar token de autoriacion, ponerlo como function proque se puede volver a necesitar


// Retrieve an access token
const solicitarToken = async () => {

   return spotifyApi.clientCredentialsGrant()
       .then((data: any) => {
          spotifyApi.setAccessToken(data.body['access_token']);
       }).catch((error: Error) => {
          console.log('Error al solicitar token');
          throw error;
       })
};

const buscarArtista = async (texto: string): Promise<any> => {

   return spotifyApi.searchArtists(texto)
       .then((data: any) => {
          return data.body;
       })
       .catch((error: Error) => {
          console.log("The error while searching artists occurred: ", error);
          throw error;
       })
};

const artistAlbums = async (idArtista: string, numPagina : number): Promise<any> => {

   const offset = numPagina-1;

   return spotifyApi.getArtistAlbums(idArtista, {limit:10, offset})
       .then((data: any) => {
          return data.body;
       })
       .catch((error: Error) => {
          console.log("The error while searching artists occurred: ", error);
          throw error;
       })
};

export default {
   solicitarToken,
   buscarArtista,
   artistAlbums
}
