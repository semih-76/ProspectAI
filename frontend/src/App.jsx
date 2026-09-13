import './App.css'
import { useState, useEffect } from 'react';

function App() {

    const [url, setUrl] = useState(''); // valeur initiale : chaîne vide
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [customInstructions, setCustomInstructions] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [token, setToken] = useState(null);

    const handleInputChange = (event) => {
        setUrl(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      setLoading(true);

          const res = await fetch('http://localhost:3001/api/generate-email', {
              method: 'POST',
              body: JSON.stringify({ url: url, customInstructions: customInstructions }),
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              }
          });

            const data = await res.json();
            setResponse(data);
            setLoading(false);

    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            body: JSON.stringify({ email: loginEmail, password: loginPassword}),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('token', data.token);
    }

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    return(
        <>
            {!token && (
            <form onSubmit={handleLogin}>
    <input
        type="email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        placeholder="Email"
    />
    <input
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        placeholder="Mot de passe"
    />
    <button type="submit">Se connecter</button>
</form>
)}
            {token && (
            <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        value={url}
                        onChange={handleInputChange}
                        placeholder="https://exemple-prospect.com"
                    />
                    <textarea
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        placeholder="Instructions personnalsées (optionnel)"
                    />
            <button type="submit" disabled={loading}>
                {loading ? 'Génération...' : 'Envoyer'}
            </button>
                {response && (
                   <p>{response.content}</p>
                )}
        </form>
        )}
            </>
  )
}
export default App
