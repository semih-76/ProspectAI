require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);


app.post('/api/generate-email', async (req,res) => {
    const { url } = req.body;
    console.log('URL reçue:', url);

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const title = $('title').text();
        const paragraphs = $('p').text();

        let content = `${title} ${paragraphs}`;
        const cleanContent = content.replace( /\s+/g, ' ').trim();
        const prompt = `Tu es un copywriter B2B d'élite, expert en cold emailing. Ton objectif est de rédiger un email de prospection ultra-personnalisé, court et percutant en te basant exclusivement sur le texte brut extrait du site internet d'un prospect.
Voici le texte extrait de leur site web : ${cleanContent}.
Voici tes consignes strictes pour la rédaction :
1. L'ACCROCHE (Le Hook) : Trouve un détail précis dans le texte (une mission, un produit, un service spécifique ou un positionnement fort) et commence directement par ça. INTERDICTION absolue d'utiliser des phrases de robot comme "J'espère que vous allez bien", "En me baladant sur votre site" ou "Je me permets de vous contacter". Le prospect doit capter dès la première seconde que l'email a été écrit pour lui.
2. LA VALEUR : Fais un lien logique et subtil entre ce qu'ils font et la valeur que notre agence apporte (ex: optimiser la conversion de leur site, accélérer leur vitesse, capter plus de clients sur mobile). Ne vends pas tes services directement, vends une solution à un problème qu'ils ont probablement.
3. L'APPEL À L'ACTION (Le CTA) : Propose une question ouverte, simple et sans engagement (ex: "Est-ce que c'est un sujet qui vous parle en ce moment ?" ou "Est-ce que vous seriez ouvert à ce qu'on jette un œil à [Problème] ensemble mardi prochain ?"). Évite les demandes trop lourdes.
4. LE TON : Parle comme un humain s'adresse à un autre humain. Sois direct, chaleureux mais professionnel. Supprime tout le jargon marketing bidon ("solution révolutionnaire", "synergie", "leader du marché").
5. LE FORMAT : L'email doit faire moins de 100 mots au total. Sauts de lignes obligatoires entre chaque phrase pour que ce soit ultra-lisible sur un écran d'iPhone.
Génère uniquement :
Objet : [Un objet court de 3 à 5 mots max, intrigant, sans majuscules agressives]
Corps de l'email : [Le texte de l'email]`;
        const geminiResponse = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
            contents: [{
                    parts: [{ text: prompt }]
                }]
            }
        );
        const emailGenere = geminiResponse.data.candidates[0].content.parts[0].text;
        res.json({ content: emailGenere });
    } catch (error) {
        console.error('Erreur Scrapping:', error.message);
        res.status(500).json({ error: 'Impossible de scraper cette url' });
    }
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})