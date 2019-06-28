import {Response} from "express";

const SendRespuestaError = function (res: Response, msg: string) {
   const success: boolean = false;

   res.json({success, msg});
};


export default SendRespuestaError;

