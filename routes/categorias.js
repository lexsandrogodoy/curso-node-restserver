import { Router } from 'express';
import { check } from 'express-validator';
import { categoriaDelete, categoriaPut, categoriasPost } from '../controllers/categorias.js';
import { validarCampos } from '../middlewares/validar_campos.js';
import { validarJWT } from '../middlewares/validar_jwt.js';
import { Categoria } from '../models/categoria.js';
import { existeCategoria } from '../helpers/db_validators.js';
import { categoriasGet, categoriaGet} from '../controllers/categorias.js';
import { esAdminRole } from '../middlewares/validar_roles.js';

const router = Router();

/*
*{{url}}/api/categorias
*/

//obtener todas las categorias, publico
router.get('/', categoriasGet );

//obtener una categoria por id, publico, validar el id una vez, middleware personalizado
router.get('/:id', 
    [
        check('id','No es un id de mongo').isMongoId(),
        check('id','No es un id de mongo').custom(existeCategoria),
        validarCampos
    ], 
    categoriaGet );

//crear categoria, privado con cualquier rol, token valido
router.post('/', 
    [validarJWT, 
    check('nombre','El nombre es obligatorio!!').notEmpty(),
    validarCampos],
    categoriasPost);


//actualizar, privado, con tken valido
router.put('/:id', 
    [
        validarJWT,
        check('nombre','El nombre es obligatorio').notEmpty(),
        check('id','No es un id de mongo').custom(existeCategoria),
        validarCampos
    ],
    categoriaPut);

//borrar una categoria, solo si es admin, cambiar estado
router.delete('/:id',
[
    validarJWT,
    esAdminRole,
    check('id','No es un id de mongo').isMongoId(),
    check('id','No existe categoria').custom(existeCategoria),
    validarCampos
], 
categoriaDelete);

export{ router }