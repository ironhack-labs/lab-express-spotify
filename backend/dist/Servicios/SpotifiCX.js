"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const clavesSpotify = require('../../../../../apps/credenciales-spotify.json');
const SpotifyWebApi = require('spotify-web-api-node');
//confirmar que se len las claves desde el path
//console.log(clavesSpotify);
const spotifyApi = new SpotifyWebApi(clavesSpotify);
//Paso 1 solicitar token de autoriacion, ponerlo como function proque se puede volver a necesitar
let isTokenSet = false;
let numIntentoReconexion = 0;
let tsToken = 0;
let lapso = 1000 * 60 * 30;
// Retrieve an access token
const solicitarToken = (callback) => __awaiter(this, void 0, void 0, function* () {
    return spotifyApi.clientCredentialsGrant()
        .then((data) => {
        numIntentoReconexion = 0;
        console.log("Token Recibido");
        spotifyApi.setAccessToken(data.body['access_token']);
        if (callback) {
            callback();
        }
    }).catch((error) => {
        console.log('Error al solicitar token');
        throw error;
    });
});
let setTokenSet = () => {
    isTokenSet = true;
};
const buscarArtista = (texto, numPagina) => __awaiter(this, void 0, void 0, function* () {
    const numItemsXPagina = 20;
    const offset = (numPagina - 1) * numItemsXPagina;
    let tsNow = (new Date).getTime();
    if ((tsNow - tsToken) > lapso) {
        yield solicitarToken(setTokenSet);
    }
    tsToken = tsNow;
    return spotifyApi.searchArtists(texto, { limit: numItemsXPagina, offset })
        .then((data) => {
        return data.body;
    })
        .catch((error) => {
        if (error.message === "Unauthorized") {
            isTokenSet = false;
            return buscarArtista(texto, numPagina);
        }
        else {
            console.log("The error while searching artists occurred: ", error);
            throw error;
        }
    });
});
const artistAlbums = (idArtista, numPagina) => __awaiter(this, void 0, void 0, function* () {
    const numItemsXPagina = 10;
    const offset = (numPagina - 1) * numItemsXPagina;
    let tsNow = (new Date).getTime();
    if ((tsNow - tsToken) > lapso) {
        yield solicitarToken(setTokenSet);
    }
    tsToken = tsNow;
    return spotifyApi.getArtistAlbums(idArtista, { limit: numItemsXPagina, offset })
        .then((data) => {
        return data.body;
    })
        .catch((error) => {
        if (error.message === "Unauthorized") {
            isTokenSet = false;
            return artistAlbums(idArtista, numPagina);
        }
        else {
            console.log("The error while searching artists occurred: ", error);
            throw error;
        }
    });
});
const tracks = (idAlbum, numPagina) => __awaiter(this, void 0, void 0, function* () {
    const numItemsXPagina = 10;
    const offset = (numPagina - 1) * numItemsXPagina;
    let tsNow = (new Date).getTime();
    if ((tsNow - tsToken) > lapso) {
        yield solicitarToken(setTokenSet);
    }
    tsToken = tsNow;
    return spotifyApi.getAlbumTracks(idAlbum, { limit: numItemsXPagina, offset: offset })
        .then((data) => {
        return data.body;
    })
        .catch((error) => {
        if (error.message === "Unauthorized") {
            isTokenSet = false;
            return tracks(idAlbum, numPagina);
        }
        else {
            console.log("The error while searching artists occurred: ", error);
            throw error;
        }
    });
});
exports.default = {
    solicitarToken,
    buscarArtista,
    artistAlbums,
    tracks
};
//# sourceMappingURL=SpotifiCX.js.map