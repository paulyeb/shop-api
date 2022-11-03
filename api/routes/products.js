const express = require('express');
const router = express.Router();
const multer = require('multer');

const ProductsController = require('../controllers/products');

// FILE STORAGE CONFIGURATION
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

// FILE TYPE MIDDLEWARE
const fileFilter = (req, file, cb) => {
    // reject file
    if(file.mimetype === 'image/jpeg' || 'image/png') {
        cb(null, true)
    }
    cb(null, false)
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5 //5MB
    }, 
    fileFilter: fileFilter
});

// READ ALL
router.get('/', ProductsController.index);

// CREATE
router.post('/', upload.single('productImage') , ProductsController.create);

// READ ONE
router.get('/:productId', ProductsController.show);

// UPDATE
router.patch('/:productId', ProductsController.update);

// DELETE
router.delete('/:productId', ProductsController.delete);

module.exports = router;