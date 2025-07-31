import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    setLoading(true);
    setTranslatedText("");
    setError("");
    try {
      const res = await fetch("http://localhost:4000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wikipediaUrl: url }),
      });
      const data = await res.json();
      if (data.translatedText) setTranslatedText(data.translatedText);
      else setError(data.error || "Translation failed.");
    } catch (e) {
      setError("Network or server error.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Wikipedia → Meetei Mayek Translator</h2>
      <input
        type="text"
        placeholder="Wikipedia English Article URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <button onClick={handleTranslate} disabled={loading || !url}>
        {loading ? "Translating..." : "Translate"}
      </button>
      <div style={{ marginTop: 24 }}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {translatedText && (
          <div
            style={{
              whiteSpace: "pre-wrap",
              fontSize: 18,
              lineHeight: 1.8,
              border: "1px solid #ddd",
              padding: 16,
              background: "#f9f9f9",
            }}
          >
            {translatedText}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
