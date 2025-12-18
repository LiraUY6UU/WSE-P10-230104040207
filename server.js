require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Import Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Body Parser
app.use(express.json());

// Koneksi Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Koneksi ke MongoDB Atlas Berhasil!');
    } catch (err) {
        console.error('❌ Gagal Koneksi ke MongoDB:', err.message);
        process.exit(1);
    }
};

// Route Dasar
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API Server Berjalan!',
        praktikum: 'P10: Simulasi API Key & OAuth 2.0 - Lira Anggraini (230104040207)'
    });
});

// Integrasi Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/auth', authRoutes);

// Jalankan Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
});