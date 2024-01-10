const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


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

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                message: 'All products',
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    const correctedPath = req.file.path.replace(/\\/, '/');
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: correctedPath
    });
    product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created product succesfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .slect('name price _id productImage')
        .exec()
        .then(doc => {
            if (doc) {
                console.log(doc);
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: "No data found on the Id"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.patch('/:param', (req, res, next) => {
    const param = req.params.param;
    const updateOps = {};
    const idRegex = /^[0-9a-fA-F]{24}$/;

    if (idRegex.test(param)) {
        for (const ops of req.body.updates) {
            updateOps[ops.propName] = ops.value;
        }
        Product.updateOne({ _id: param }, { $set: updateOps })
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
    } else {
        const productName = param;
        const newPrice = req.body ? req.body.newPrice : undefined;

        if (newPrice === undefined) {
            return res.status(400).json({
                error: {
                    message: "Invalid request format. Please provide 'newPrice' in the request body."
                }
            });
        }

        Product.updateMany({ name: productName }, { $set: { price: newPrice } })
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.delete({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/', (req, res, next) => {
    Product.deleteMany({})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

module.exports = router;