const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
    // 1. Cek header Authorization
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Ambil token setelah kata 'Bearer '
            token = req.headers.authorization.split(' ')[1];

            // 3. Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Sematkan data user ke req
            req.user = {
                id: decoded.id,
                role: decoded.role
            };

            next();
        } catch (error) {
            console.error('Token Verification Error:', error.message);
            return res.status(403).json({
                message: 'Akses Ditolak: Token tidak valid atau kedaluwarsa.'
            });
        }
    } else {
        return res.status(403).json({
            message: 'Akses Ditolak: Tidak ada Token Bearer yang ditemukan.'
        });
    }
};

module.exports = validateToken;