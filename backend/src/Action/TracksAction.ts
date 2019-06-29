"use strict";

import {Response} from "express";
import SendRespuestaError from "../Routes/SendResponseError";
import SpotifiCX from "../Servicios/SpotifiCX";



const TracksAction = {


   validarParams: function (idAlbum: string, pagina:string): boolean {

      // existe el parametro
      let isValid = !(idAlbum === undefined || idAlbum.trim() === '' || idAlbum === null);

      if (isValid) {
         //tiene longitud correcta
         isValid = idAlbum.length < 30;
      }


      if (isValid) {
         isValid = parseInt(pagina) > 0;
      }

      //TODO agrgar mensaje que describa el error de validacion
      return isValid;



   },
   execute: function (res: Response, idAlbum: string, pagina:string) {


      if (!this.validarParams(idAlbum, pagina)) {
         SendRespuestaError(res, "Parámetros inválido");
         return;
      }

      const numPagina = parseInt(pagina);

      SpotifiCX.tracks(idAlbum,numPagina)
          .then((data: any) => {
             const success: boolean = true;
             const msg = "";
             res.json({idAlbum, data, success, msg});
          })
          .catch((error: Error) => {
             SendRespuestaError(res, error.message);
          })
      ;

   }
};


export default TracksAction;
