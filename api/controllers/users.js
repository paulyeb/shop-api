const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');


exports.index = (req, res, next) => {
    User.find()
    .select('email password')
    .exec()
    .then(users => {
        if(users.length < 1) {
            return res.status(404).json({
                message: 'No users found',
            })
        }
        res.status(200).json({
            message: 'List of all users',
            users: users
        })
    })
    .catch(error => {
        res.status(500).json({
            error: error.message
        })
    }) 
}


exports.create = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: 'Sorry, this email is already assigned to another user.'
            })
        }
        bcrypt.hash(req.body.password, 10,  (err, hash) => {
            if(err) {
                return res.status(500).json({
                    error: err
                })
            }
            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            })
            newUser.save()
            .then(user => {
                res.status(201).json({
                    message: 'You have successfullly created an account.',
                    user: user,
                    request: {
                        type: 'GET',
                        url: `https://localhost:3000/users/${user._id}`
                    }
                })
            })
            .catch(error => {
                res.status(500).json({
                    error: error.message
                })
            })
        })
    })
}

exports.show = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .select('email password')
    .exec()
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'No user found',
                user: user
            })
        }
        res.status(200).json({
            message: 'User found',
            user: user
        })
    })
    .catch(error => {
        res.status(500).json({
            error: error.message
        })
    })
}

exports.delete = (req, res, next) => {
    const id = req.params.userId;
    User.deleteOne({_id: id})
    .exec()
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        res.status(200).json({
            message: 'User successfully deleted'
        })
    })
    .catch(error => {
        res.status(500).json({
            error: error.message
        })
    })
}