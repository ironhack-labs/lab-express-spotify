import {Application, Request, Response} from "express";
import HomeAction from "../HomeAction";
import BuscarArtistAction from "../BuscarArtistAction";


function routerBuilder(app : Application ){

    app.get("/debug", function (req: Request, res: Response) {
        res.send('yea baby');
    });


    app.get("/", function (req: Request, res: Response) {
       res.send('im backend :)')
    });



    app.get("/buscar-artista/:texto", function (req: Request, res: Response) {
        BuscarArtistAction.execute(req,res);
    });

}


export default routerBuilder;
