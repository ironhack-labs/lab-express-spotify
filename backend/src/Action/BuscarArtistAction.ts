"use strict";

import {Response} from "express";
import SendRespuestaError from "../Routes/SendResponseError";
import SpotifiCX from "../Servicios/SpotifiCX";
import ServerConfig from "../Config";
import UrlApi from "../Routes/UrlApi";


const urlRel: string = UrlApi.BuscarArtista;
const urlApi = ServerConfig.urlApi;

const BuscarArtistAction = {

        getUrl: function (texto: string, pagina: string): string {
            return ServerConfig.urlApi + urlRel + `/${texto}/${pagina}`;
        },
        validarParams: function (texto: string, pagina: string): boolean {

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

        }
        ,
        execute: function (res: Response, texto: string, pagina: string) {


            if (!this.validarParams(texto, pagina)) {
                SendRespuestaError(res, "Parámetro texto inválido");
                return;
            }

            texto = texto.toLowerCase();

            const numPagina = parseInt(pagina);

            SpotifiCX.buscarArtista(texto, numPagina)
                .then((data: any) => {
                    const success: boolean = true;
                    const msg = "";


                    const total: number = data.artists.total;

                    const paginaSiguiente: number = numPagina + 1;
                    const next: string = data.artists.next === "" ? "" : urlApi + "/"+urlRel + `/${texto}/${paginaSiguiente}`;

                    let d = {
                        texto,
                        next,
                        total: data.artists.total,
                        items: data.artists.items
                    };


                    res.json({data: d, success, msg});
                })
                .catch((error: Error) => {
                    SendRespuestaError(res, error.message);
                })
            ;

        }
    }
;


export default BuscarArtistAction;
