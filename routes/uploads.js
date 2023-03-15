import { Router } from 'express';
import { check } from 'express-validator';
import { actualizarImagen, actualizarImagenCloudinary, cargarArchivo, mostrarImagen } from '../controllers/uploads.js';
import { coleccionesPermitidas } from '../helpers/db_validators.js';
import { validarCampos } from '../middlewares/validar_campos.js';
import { validarArchivoSubir } from '../middlewares/validar_archivo.js';


const router = Router();
router.post('/', validarArchivoSubir, cargarArchivo)

router.put('/:coleccion/:id',
[
    validarArchivoSubir,
    check('id','Debe ser un id de mongo válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],
actualizarImagenCloudinary)
//actualizarImagen) <-localmente

router.get('/:coleccion/:id',
[
    check('id','Debe ser un id de mongo válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],
mostrarImagen)

export{ router }