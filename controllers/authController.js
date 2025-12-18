const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const authUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        // Validasi password menggunakan method matchPassword di model User
        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id, user.role);

            res.status(200).json({
                token_type: 'Bearer',
                access_token: token,
                expires_in: '7d',
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ message: 'Otentikasi Gagal: Username atau Password tidak valid.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { authUser };