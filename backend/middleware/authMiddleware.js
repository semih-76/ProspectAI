const jwt = require('jsonwebtoken');

const verifytoken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide'});
        }

        req.userId = decoded.userId;
        next();
    });
}

module.exports = verifytoken;