import { Router } from 'express';
import { check } from 'express-validator';
import { productosGet, productoPost, productoDelete, productoGet, productoPut } from '../controllers/productos.js';
import { existeCategoria, existeProducto } from '../helpers/db_validators.js';
import { validarCampos } from '../middlewares/validar_campos.js';
import { validarJWT } from '../middlewares/validar_jwt.js';
import { esAdminRole } from '../middlewares/validar_roles.js';

const router = Router();

//Obtener todos los productos
router.get('/',
    [
        validarJWT,
        validarCampos
    ], 
    productosGet );

//crear producto
router.post('/',
    [
        validarJWT,
        check('nombre','El nombre es obligatorio').notEmpty(),
        check('precio','Debe ser un número').isNumeric(),
        check('categoria','La categoria es obligatoria').notEmpty(),
        check('categoria','No es un id de Mongo').custom(existeCategoria),
        check('descripcion','La descripcion es obligatoria').notEmpty(),
        validarCampos
    ],
    productoPost);

//eliminar producto
router.delete('/:id',
    [
        validarJWT,
        esAdminRole,
        check('id','No es un id de mongo').isMongoId(),
        check('id','No existe producto').custom(existeProducto),
        validarCampos
    ],
    productoDelete
);

//obtener un producto
router.get('/:id',
    [
        check('id','No es un id de mongo').isMongoId(),
        check('id','No existe producto').custom(existeProducto),
        validarCampos 
    ],
    productoGet
)

//actualizar un producto
//podría eliminas las validaciones de los elementos que podrían no venir
router.put('/:id',
    [
        //validarJWT,
        //esAdminRole,
        check('id','No es un id de mongo').isMongoId(),
        check('id','No existe el producto').custom(existeProducto),
        //check('nombre','El nombre es obligatorio').notEmpty(),
        check('precio','Debe ser un número').isNumeric(),
        check('categoria','No es un id de Mongo').custom(existeCategoria),
        //check('descripcion','La descripcion es obligatoria').notEmpty(),
        validarCampos
    ],
    productoPut
)

export{ router }
