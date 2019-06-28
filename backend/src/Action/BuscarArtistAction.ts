"use strict";

import {Response} from "express";
import SpotifiCX from "./PromiseFactory/SpotifiCX";
import SendRespuestaError from "./Routes/SendResponseError";


const BuscarArtistAction = {


   validarParamTexto: function (texto: string): boolean {


      // existe el parametro
      let isValid = !(texto === undefined || texto.trim() === '' || texto === null);

      if (isValid) {
         //tiene longitud correcta
         isValid = texto.length < 30;
      }

      //TODO agrgar mensaje que describa el error de validacion
      return isValid;

   },
   execute: function (res: Response, texto: string) {


      if (!this.validarParamTexto(texto)) {
         SendRespuestaError(res, "Parámetro texto inválido");
         return;
      }

      texto = texto.toLowerCase();


      SpotifiCX.buscarArtista(texto)
          .then((data: any) => {
             const success: boolean = true;
             const msg = "";
             res.json({texto, data, success, msg});
          })
          .catch((error: Error) => {
             SendRespuestaError(res, error.message);
          })
      ;


   }
};


export default BuscarArtistAction;
