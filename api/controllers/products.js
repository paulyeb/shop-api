const Product = require("../models/product");

const mongoose = require('mongoose');

exports.index  = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: `https://localhost:3000/products/${doc._id}`
                    }
                }
            })
        }

        if(docs.length < 1) {
            res.status(200).json({
                message: "No products found in  ARATATOYE BEADS COLLECTION"
            });
        } else {
            res.status(200).json(response);
        }
    })
    .catch(err => {
        
        res.status(500).json({
            error: err.message
        });
    })
}

exports.create  = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save()
    .then(result => { 
        if(result) {
            res.status(201).json({
               message: 'New product added to ARATATOYE BEADS COLLECTION successfully' ,
               product: product
            });
        }
     })
    .catch(err => { 
        
        res.status(500).json({
            error: err.message
        });
    })
}

exports.update  = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, {
        $set: updateOps 
    })
    res.status(200).json({
       message: 'Updated product' 
    });
}

exports.show  = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        const response = {
            name: doc.name,
            price: doc.price,
            request: {
                type: 'GET',
                url:  `https://localhost:3000/products/${doc._id}`
            }
        }
        if (doc) {
            res.status(200).json(response);
        } else {
            res.status(404).json({
                message: 'No Valid Entry Found For Provided Entry'
            }); 
        }
    })
    .catch(err => {
        
        res.status(500).json({
            error: err
        })
    });
}

exports.delete  = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id})   
    .exec()
    .then(result => {
        res.status(200).json({
           message: 'Deleted product successfully' 
        });
    })
    .catch(err => {
        
        res.status(500).json({
            error: err.message
        });
    });
}