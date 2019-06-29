"use strict";

import {Response} from "express";
import SendRespuestaError from "../Routes/SendResponseError";
import SpotifiCX from "../Servicios/SpotifiCX";


const BuscarArtistAction = {


   validarParams: function (texto: string, pagina :string ): boolean {

      // existe el parametro
      let isValid = !(texto === undefined || texto.trim() === '' || texto === null);

      if (isValid) {
         //tiene longitud correcta
         isValid = texto.length < 30;
      }


      if (isValid) {
         isValid = parseInt(pagina) > 0;
      }


      //TODO agrgar mensaje que describa el error de validacion
      return isValid;

   },
   execute: function (res: Response, texto: string, pagina:string) {


      if (!this.validarParams(texto,pagina)) {
         SendRespuestaError(res, "Parámetro texto inválido");
         return;
      }

      texto = texto.toLowerCase();

      const numPagina = parseInt(pagina);

      SpotifiCX.buscarArtista(texto, numPagina)
          .then((data: any) => {
             const success: boolean = true;
             const msg = "";


             const total :number = data.artists.total;


             let d = {
                total: data.artists.total,
                items: data.artists.items
             };


             res.json({texto, data: d, success, msg});
          })
          .catch((error: Error) => {
             SendRespuestaError(res, error.message);
          })
      ;

   }
};


export default BuscarArtistAction;
