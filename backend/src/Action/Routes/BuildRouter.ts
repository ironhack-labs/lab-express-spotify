import {Application, Request, Response} from "express";

import BuscarArtistAction from "../BuscarArtistAction";


function routerBuilder(app : Application ){

    app.get("/debug", function (req: Request, res: Response) {
        res.send('yea baby');
    });


    app.get("/", function (req: Request, res: Response) {
       res.send('i´m backend :)')
    });



    app.get("/buscar-artista/:texto", function (req: Request, res: Response) {

        let texto: string = req.params.texto || null;

        BuscarArtistAction.execute(res, texto);
    });

}


export default routerBuilder;
