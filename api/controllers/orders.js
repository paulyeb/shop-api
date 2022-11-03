const { default: mongoose } = require('mongoose');

const Order = require("../models/order");
const Product = require("../models/product");

exports.index = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then(orders => {
        const response = {
            count: orders.length,
            orders: orders.map(order => {
                return {
                    id: order._id, 
                    product: order.product, 
                    quantity: order.quantity, 
                    request: {
                        type: 'GET', 
                        url: `https://localhost:3000/orders/${order._id}`
                    }

                }
            })
        }
        if(!orders) {
            return res.status(200).json({
                message: 'No orders available',
            })
        } 
        res.status(200).json({
            message: 'Here are all your orders',
            orders: response
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    })
}

exports.create = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(product) {
            const newOrder = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId,
            })
            return newOrder.save()
        } else {
            return res.status(404).json({
                message: 'Cannot create an order for a non-existent product'
            })
        }
    })
    .then(order => {
        res.status(201).json({
            message: 'Your order created successfully',
            order: order,
            request: {
                type: 'GET',
                url:  `https://localhost:3000/orders/${order._id}`
            }
        })
    })
    .catch(error => {
        res.status(500).json({
            error: error.message
        })
    })
}

exports.show = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id) 
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then(order => {
        if(order) {
            res.status(200).json({
                message:   'Here is your order',
                order: order,
                request: {
                    type: 'GET', 
                    url: `https://localhost:3000/${order._id}`

                }
            })
        } else {
            res.status(404).json({
                message: 'No such order found.'
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            error: error.message
        })
    })
}

exports.delete = (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
    .exec()
    .then(order => {
        if(!order) {
            return res.status(404).json({
                message: 'Order Not found',
            })
        } 
        res.status(204).json({
            message: 'Your order deleted successfully'
        })
    })
    .catch(error => {
        res.status(500).json({
            error: error.message
        })
    })
}