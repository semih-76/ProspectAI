const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/generate-email', async (req,res) => {
    const { url } = req.body;
    console.log('URL reçue:', url);

    try {
        const { data } = await axios.get(url);
        console.log(data);
        const $ = cheerio.load(data);
        const title = $('title').text();
        const paragraphs = $('p').text();

        console.log('Titre:', title);
        console.log('Paragraphes:', paragraphs);
        res.json({ message: 'Salut !' });
    } catch (error) {
        console.error('Erreur Scrapping:', error.message);
        res.status(500).json({ error: 'Impossible de scraper cette url' });
    }
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})