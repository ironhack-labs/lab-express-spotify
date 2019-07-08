"use strict";

const clavesSpotify = require('../../../../../apps/credenciales-spotify.json');

const SpotifyWebApi = require('spotify-web-api-node');

//confirmar que se len las claves desde el path
//console.log(clavesSpotify);


const spotifyApi = new SpotifyWebApi(clavesSpotify);


//Paso 1 solicitar token de autoriacion, ponerlo como function proque se puede volver a necesitar

let isTokenSet = false;
let numIntentoReconexion = 0;


// Retrieve an access token
const solicitarToken = async (callback: any) => {

   return spotifyApi.clientCredentialsGrant()
       .then((data: any) => {
          numIntentoReconexion = 0;
          console.log("Token Recibido");
          spotifyApi.setAccessToken(data.body['access_token']);

          if (callback) {
             callback();
          }

       }).catch((error: Error) => {
          console.log('Error al solicitar token');
          throw error;
       })
};

let setTokenSet = () => {
   isTokenSet = true;
};

const buscarArtista = async (texto: string, numPagina: number): Promise<any> => {


   const numItemsXPagina: number = 20;
   const offset: number = (numPagina - 1) * numItemsXPagina;

   if (!isTokenSet) {
      await solicitarToken(setTokenSet);
   }

   return spotifyApi.searchArtists(texto, {limit: numItemsXPagina, offset})
       .then((data: any) => {
          return data.body;
       })
       .catch((error: Error) => {

          if (error.message === "X") {
             isTokenSet = false;
             return buscarArtista(texto, numPagina);
          }

          console.log("The error while searching artists occurred: ", error);
          throw error;
       })
};


const artistAlbums = async (idArtista: string, numPagina: number): Promise<any> => {


   const numItemsXPagina: number = 10;
   const offset: number = (numPagina - 1) * numItemsXPagina;

   if (!isTokenSet) {
      await solicitarToken(setTokenSet);
   }

   return spotifyApi.getArtistAlbums(idArtista, {limit: numItemsXPagina, offset})
       .then((data: any) => {
          return data.body;
       })
       .catch((error: Error) => {

          if (error.message === "X") {
             isTokenSet = false;
             return artistAlbums(idArtista, numPagina);
          }

          console.log("The error while searching artists occurred: ", error);
          throw error;
       })
};


const tracks = async (idAlbum: string, numPagina: number): Promise<any> => {


   const numItemsXPagina: number = 10;
   const offset = (numPagina - 1) * numItemsXPagina;

   if (!isTokenSet) {
      await solicitarToken(setTokenSet);
   }

   return spotifyApi.getAlbumTracks(idAlbum, {limit: numItemsXPagina, offset: offset})
       .then((data: any) => {
          return data.body;
       })
       .catch((error: Error) => {

          if (error.message === "X") {
             isTokenSet = false;
             return tracks(idAlbum, numPagina);
          }

          console.log("The error while searching artists occurred: ", error);
          throw error;
       })
};


export default {
   solicitarToken,
   buscarArtista,
   artistAlbums,
   tracks
}
