import './App.css'
import { useState } from 'react';

function App() {

    const [url, setUrl] = useState(''); // valeur initiale : chaîne vide
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const handleInputChange = (event) => {
        setUrl(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      setLoading(true);

          const res = await fetch('http://localhost:3001/api/generate-email', {
              method: 'POST',
              body: JSON.stringify({ url: url }),
              headers: {
                  "Content-Type": "application/json",
              }
          });

            const data = await res.json();
            setResponse(data);
            setLoading(false);

    };

    return(
        <>
            <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={url}
                        onChange={handleInputChange}
                        placeholder="https://exemple-prospect.com"
                    />
            <button type="submit">Envoyer</button>
                {response && (
                   <p>{response.content}</p>
                )}
        </form>

            </>
  )
}
export default App
