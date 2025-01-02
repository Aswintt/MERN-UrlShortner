import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const handleSub = () => {
    axios.post('http://localhost:3002/api/short', {originalUrl})
    .then((res) => {
      setShortUrl(res.data.url.shortUrl);
      // console.log("API response", res.data.url.shortUrl );
    })
    .catch((err) => {
      console.log(err);
    });
    console.log(originalUrl)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`http://localhost:3002/${shortUrl}`);
      setCopyStatus("Link copied!");
    } catch (err) {
      setCopyStatus("Failed to copy!");
      console.error("Error copying to clipboard: ", err);
    }

    // Reset the status after a few seconds
    setTimeout(() => setCopyStatus(""), 2000);
  };

  return (
    <div className="App">
      <input
      value={originalUrl}
      onChange={(e) => setOriginalUrl(e.target.value)} type='text' name='originalUrl' id=''/>
      <button onClick={handleSub} className='btn'>Shorten</button>
      {
        shortUrl && (
          <>
          <p>Shorten Url : </p>
          <a href={`http://localhost:3002/${shortUrl}`} target='_blank'>http://localhost:3002/{shortUrl}</a>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={handleCopy} style={{ padding: "10px 20px", fontSize: "16px" }}>
            Copy Link
          </button>
          {copyStatus && <p>{copyStatus}</p>}
        </div>
          </>
        )
      }
    </div>
  );
}

export default App;
