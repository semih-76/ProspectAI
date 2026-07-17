const bcrypt = require('bcrypt');
const pool = require('../config/db');

const register = async (req, res) => {
    const { email, password, nom, prenom, entreprise } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }
        const [ rows ] = await pool.query('SELECT id FROM users  WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ error: 'L\'email existe déjà ! '})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password, nom, prenom, entreprise) VALUES (?, ?, ?, ?, ?)',  [email, hashedPassword, nom, prenom, entreprise]);
        res.status(201).json({ message: 'L\'inscription à été créée avec succès'});
    } catch (error) {
        console.error('L\'inscription a échouée', error.message);
        res.status(500).json({ error: 'Inscription échouée' });
    }
};

module.exports = { register };