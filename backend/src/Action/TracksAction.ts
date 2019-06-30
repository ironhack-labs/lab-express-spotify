"use strict";

import {Response} from "express";
import SendRespuestaError from "../Routes/SendResponseError";
import SpotifiCX from "../Servicios/SpotifiCX";
import ServerConfig from "../Config";
import UrlApi from "../Routes/UrlApi";


const urlApi = ServerConfig.urlApi;
const urlRel: string = UrlApi.Tracks;



const TracksAction = {

   getUrl: function (texto: string, pagina: string): string {
      return ServerConfig.urlApi + urlRel + `/${texto}/${pagina}`;
   },

   validarParams: function (idAlbum: string, pagina: string): boolean {

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
   execute: function (res: Response, idAlbum: string, pagina: string) {


      if (!this.validarParams(idAlbum, pagina)) {
         SendRespuestaError(res, "Parámetros inválido");
         return;
      }

      const numPagina = parseInt(pagina);

      SpotifiCX.tracks(idAlbum, numPagina)
          .then((data: any) => {
             const success: boolean = true;
             const msg = "";

             const total: number = data.total;

             const paginaSiguiente: number = numPagina + 1;
             const next: string = data.next === "" ? "" : urlApi +'/' + urlRel + `/${idAlbum}/${paginaSiguiente}`;

             let d = {
                idAlbum,
                next,
                total: data.total,
                items: data.items
             };


             res.json({idAlbum, data :d , success, msg});
          })
          .catch((error: Error) => {
             SendRespuestaError(res, error.message);
          })
      ;

   }
};


export default TracksAction;
