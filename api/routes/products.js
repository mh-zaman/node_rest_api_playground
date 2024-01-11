const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check_auth');
const productController = require('../controllers/products');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});



/*
attributes of images sent
{
    fieldname: 'productImage',
    originalname: 'picture.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'uploads/',
    filename: 'af72c4a21777787a563a8d55d00efc49',
    path: 'uploads\\af72c4a21777787a563a8d55d00efc49',
    size: 116327
}
*/

router.get('/', productController.get_all_products);

router.get('/:productId', productController.get_a_product);

router.post('/', checkAuth, upload.single('productImage'), productController.create_product);

router.patch('/:param', checkAuth, productController.edit_product);

router.delete('/:productId', checkAuth, productController.delete_product);

router.delete('/', checkAuth, productController.delete_all_products);

module.exports = router;