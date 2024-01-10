const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
// const product = require('../models/product');
//const { default: mongoose } = require('mongoose');

router.get('/', (req, res, next) => {
    Order.find()
        .select('product, quantity _id')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Order placed successfully',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Somthing wrong',
                error: err
            });
        });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                res.status(404).json({
                    message: 'Order not found'
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'
                }
            })

        })
        .catch(err => {
            res.status(500).json({
                message: 'Somthing wrong',
                error: err
            });
        });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/',
                    body: {productId: 'Product ID', quantity: 'Number'}
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Opps',
                error: err
            });
        });
});


module.exports = router;