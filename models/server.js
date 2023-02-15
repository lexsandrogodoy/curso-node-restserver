import express from 'express';
import cors from 'cors';
import {router} from '../routes/usuarios.js';

class Server{
    constructor(){
        this.app  = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares(intercambio de información entre aplicaciones)
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    middlewares(){
        //cors
        this.app.use(cors());

        //Parseo y lectura del body
        this.app.use(express.json());

        //Directorio público
        this.app.use( express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosPath,router);
    }

    listen(){
        this.app.listen(this.port , () => {
            console.log('Servidor en puerto', this.port)
        })
    }
}

export {Server}