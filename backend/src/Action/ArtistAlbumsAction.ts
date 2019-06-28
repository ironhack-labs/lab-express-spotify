"use strict";

import {Response} from "express";
import SendRespuestaError from "../Routes/SendResponseError";
import SpotifiCX from "../Servicios/SpotifiCX";


const ArtistAlbumsAction = {

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
             res.json({id_artista: idArtista, data, success, msg});
          })
          .catch((error: Error) => {
             SendRespuestaError(res, error.message);
          })
      ;

   }
};


export default ArtistAlbumsAction;
