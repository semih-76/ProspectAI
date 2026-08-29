const bcrypt = require('bcrypt');
const pool = require('../config/db');

const jwt = require('jsonwebtoken');

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

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis'});
        }
        const [ rows ] = await pool.query('SELECT id, password FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'L\'email ou mot de passe incorrect'});
        }

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (isMatch == false) {

            return res.status(401).json({ error: 'L\'email ou mot de passe incorrect'});
        }

        const token = jwt.sign ({ userId: rows[0].id },
        process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
        res.json({ token });

    } catch (error) {
        console.error('Erreur connexion', error.message);
        res.status(500).json({ error: 'Erreur lors de la connexion '});
    }
};

module.exports = { register, login };