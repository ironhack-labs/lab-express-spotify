import {Application, Request, Response} from "express";
import HomeAction from "../HomeAction";
import XArtistAction from "../XArtistAction";


function routerBuilder(app : Application ){

    app.get("/debug", function (req: Request, res: Response) {
        res.send('yea baby');
    });


    app.get("/", function (req: Request, res: Response) {
        HomeAction.execute(req,res);
    });

    app.get("/home", function (req: Request, res: Response) {
        HomeAction.execute(req,res);
    });

    app.get("/xartist", function (req: Request, res: Response) {
        XArtistAction.execute(req,res);
    });

}


export default routerBuilder;
