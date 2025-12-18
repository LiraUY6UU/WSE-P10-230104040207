const Product = require('../models/Product');

// 1. PUBLIC: Get All Products (API Key required)
const getPublicProducts = async (req, res) => {
    try {
        const products = await Product.find().select('-__v'); // Hilangkan field versi
        const keyOwner = req.apiKey ? req.apiKey.owner : 'Unknown';

        res.status(200).json({
            message: `Daftar Produk berhasil diambil. Diakses oleh: ${keyOwner}`,
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data produk.' });
    }
};

// 2. PRIVATE: Create Product (Admin Only)
const createProduct = async (req, res) => {
    const { role, id } = req.user;
    
    if (role !== 'admin') {
        return res.status(403).json({ message: `Akses Ditolak: User (${role}) tidak boleh membuat produk.` });
    }

    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({
            message: `Produk berhasil dibuat oleh Admin (ID: ${id})`,
            data: newProduct
        });
    } catch (error) {
        res.status(400).json({ message: 'Gagal membuat produk.', details: error.message });
    }
};

// 3. PRIVATE: Update Product (Admin Only)
const updateProduct = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses Ditolak: Hanya Admin yang boleh mengedit produk.' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        ).select('-__v');

        if (!updatedProduct) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

        res.status(200).json({
            message: 'Produk berhasil diperbarui.',
            data: updatedProduct
        });
    } catch (error) {
        res.status(400).json({ message: 'Gagal memperbarui produk.', details: error.message });
    }
};

// 4. PRIVATE: Delete Product (Admin Only)
const deleteProduct = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses Ditolak: Hanya Admin yang boleh menghapus produk.' });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

        res.status(200).json({ message: 'Produk berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus produk.' });
    }
};

module.exports = {
    getPublicProducts,
    createProduct,
    updateProduct,
    deleteProduct
};