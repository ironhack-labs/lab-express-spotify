"use strict";

import {Response} from "express";
import SendRespuestaError from "../Routes/SendResponseError";
import SpotifiCX from "../Servicios/SpotifiCX";


import ServerConfig from "../Config";
import UrlApi from "../Routes/UrlApi";


const urlRel: string = UrlApi.Albums;
const urlApi = ServerConfig.urlApi;

const ArtistAlbumsAction = {

   getUrl: function (idArtista: string, pagina: string): string {
      return ServerConfig.urlApi + urlRel + `/${idArtista}/${pagina}`;
   },
   validarParams: function (idArtista: string, pagina: string): boolean {

      // existe el parametro
      let isValid = !(idArtista === undefined || idArtista.trim() === '' || idArtista === null);

      if (isValid) {
         //tiene longitud correcta
         isValid = idArtista.length < 30;
      }

      if (isValid) {
         isValid = parseInt(pagina) > 0;
      }


      //TODO agrgar mensaje que describa el error de validacion
      return isValid;

   },
   execute: function (res: Response, idArtista: string, pagina: string) {

      if (!this.validarParams(idArtista, pagina)) {
         SendRespuestaError(res, "Parámetros inválidos");
         return;
      }

      const numPagina = parseInt(pagina);

      SpotifiCX.artistAlbums(idArtista, numPagina)
          .then((data: any) => {
              const success: boolean = true;
              const msg = "";

              const total: number = data.total;

              const paginaSiguiente: number = numPagina + 1;
              const next: string = data.next === "" ? "" : urlApi +"/"+ urlRel + `/${idArtista}/${paginaSiguiente}`;

              let d = {
                  idArtista,
                  next,
                  total: data.total,
                  items: data.items
              };


              res.json({data: d, success, msg});

          })
          .catch((error: Error) => {
             SendRespuestaError(res, error.message);
          })
      ;

   }
};


export default ArtistAlbumsAction;
