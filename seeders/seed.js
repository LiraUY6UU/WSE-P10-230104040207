require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const Product = require('../models/Product');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Koneksi MongoDB Berhasil untuk Seeding');

        // PERBAIKAN: Menggunakan .collection.drop() untuk menghapus bersih index lama (seperti email_1)
        console.log('🧹 Membersihkan database lama...');
        try { await User.collection.drop(); } catch (e) { /* Abaikan jika collection belum ada */ }
        try { await ApiKey.collection.drop(); } catch (e) { /* Abaikan jika collection belum ada */ }
        try { await Product.collection.drop(); } catch (e) { /* Abaikan jika collection belum ada */ }
        
        console.log('✨ Database bersih. Memulai input data baru...');

        // Data Produk
        const products = [
            { name: 'Laptop Gaming Pro', price: 15000000, stock: 10, description: 'Laptop performa tinggi.' },
            { name: 'Monitor 4K Ultra', price: 5000000, stock: 25, description: 'Monitor resolusi tinggi.' },
            { name: 'Keyboard Mekanik', price: 1500000, stock: 50, description: 'Switch tactile.' }
        ];
        await Product.insertMany(products);
        console.log('📦 Produk berhasil ditambahkan.');

        // Data User
        const users = [
            { username: 'admin', password: 'password123', role: 'admin' },
            { username: 'userbiasa', password: 'userpass', role: 'user' }
        ];
        
        // Loop manual agar trigger pre-save hook berjalan (untuk hashing password)
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
        }
        console.log('👤 Users berhasil ditambahkan.');

        // Data API Key
        const apiKeys = [
            { key: 'PRACTICUM_API_KEY_A_1234567890', owner: 'Public App Client A', status: 'active' },
            { key: 'PUBLIC_VIEW_ONLY_KEY_B_ABCDEFG', owner: 'Public App Client B', status: 'active' }
        ];
        await ApiKey.insertMany(apiKeys);
        console.log('🔑 API Keys berhasil ditambahkan.');

        console.log('🚀 SEEDING SELESAI!');
        process.exit();

    } catch (error) {
        console.error('❌ Gagal Seeding:', error);
        process.exit(1);
    }
};

seedDB();