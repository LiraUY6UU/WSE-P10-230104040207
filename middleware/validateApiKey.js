const ApiKey = require('../models/ApiKey');

const validateApiKey = async (req, res, next) => {
    try {
        // 1. Ekstrak key dari header 'x-api-key'
        const apiKey = req.header('x-api-key');

        // 2. Jika key tidak ada
        if (!apiKey) {
            return res.status(401).json({
                message: 'Akses Ditolak: API Key tidak ditemukan di header "x-api-key".'
            });
        }

        // 3. Cari key di database
        const existingKey = await ApiKey.findOne({ key: apiKey, status: 'active' });

        if (!existingKey) {
            return res.status(401).json({
                message: 'Akses Ditolak: API Key tidak valid atau sudah dicabut.'
            });
        }

        // 4. Sematkan data key ke request
        req.apiKey = existingKey;
        next();

    } catch (error) {
        console.error('API Key Validation Error:', error);
        res.status(500).json({ message: 'Internal Server Error selama validasi API Key.' });
    }
};

module.exports = validateApiKey;