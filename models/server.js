import express from 'express';
import cors from 'cors';
import {router} from '../routes/usuarios.js';
import {router as routerAuth} from '../routes/auth.js';
import {router as routerCategorias} from '../routes/categorias.js';
import {router as routerProductos} from '../routes/productos.js';
import {router as routerBuscar} from '../routes/buscar.js';
import { dbConnection } from '../database/config.js';


class Server{
    constructor(){
        this.app  = express();
        this.port = process.env.PORT;

        //this.usuariosPath = '/api/usuarios';
        //this.authPath = '/api/auth';

        this.path = {
            usuarios:   '/api/usuarios',
            auth:       '/api/auth',
            productos:  '/api/productos',
            categorias: '/api/categorias',
            buscar:     '/api/buscar',
        }

        //Middlewares(intercambio de información entre aplicaciones)
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //cors
        this.app.use(cors());

        //Conectar a base de datos
        this.conectarDB();

        //Parseo y lectura del body
        this.app.use(express.json());

        //Directorio público
        this.app.use( express.static('public'));
    }

    routes(){
        //this.app.use(this.authPath,routerAuth);
        //this.app.use(this.usuariosPath,router);
        this.app.use(this.path.auth,routerAuth);
        this.app.use(this.path.usuarios,router);
        this.app.use(this.path.productos,routerProductos);
        this.app.use(this.path.categorias,routerCategorias);
        this.app.use(this.path.buscar,routerBuscar);
    }

    listen(){
        this.app.listen(this.port , () => {
            console.log('Servidor en puerto', this.port)
        })
    }
}

export {Server}