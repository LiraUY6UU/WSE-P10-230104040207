const express = require('express');
const { 
    getPublicProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');

const validateApiKey = require('../middleware/validateApiKey');
const validateToken = require('../middleware/validateToken');

const router = express.Router();

// Route Publik (Pakai API Key)
router.get('/public', validateApiKey, getPublicProducts);

// Route Private (Pakai JWT + Role Admin check di controller)
router.post('/private', validateToken, createProduct);
router.put('/private/:id', validateToken, updateProduct);
router.delete('/private/:id', validateToken, deleteProduct);

module.exports = router;