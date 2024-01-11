const mongoose = require('mongoose');
const Product = require('../models/product');

exports.get_all_products = (req, res, next) => {
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
}

exports.get_a_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
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
}

exports.create_product = (req, res, next) => {
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
}

exports.edit_product = (req, res, next) => {
    const param = req.params.param;
    const updateOps = {};
    const idRegex = /^[0-9a-fA-F]{24}/;

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
        const newPrice = req.body.newPrice;

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
}

exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
}

exports.delete_all_products = (req, res, next) => {
    Product.deleteMany({})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
}