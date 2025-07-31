const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const MINT_API_URL = "https://gerrit.wikimedia.org/r/mediawiki/services/machinetranslation"; // Replace with actual MinT API URL
const MINT_API_KEY = "MinT"; // Replace with your actual MinT API key

async function fetchWikiText(pageUrl) {
  const match = pageUrl.match(/\/wiki\/([^?#]+)/);
  if (!match) throw new Error("Invalid Wikipedia URL");
  const pageName = decodeURIComponent(match[1]);
  try {
    const resp = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/plain/${pageName}`
    );
    return resp.data;
  } catch {
    const resp = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${pageName}`
    );
    return resp.data.extract;
  }
}

app.post("/translate", async (req, res) => {
  const { wikipediaUrl } = req.body;
  if (!wikipediaUrl) return res.status(400).json({ error: "Missing wikipediaUrl" });

  try {
    const wikiText = await fetchWikiText(wikipediaUrl);
    const mintResp = await axios.post(
      MINT_API_URL,
      {
        source: wikiText,
        source_lang: "en",
        target_lang: "mni_Mtei"
      },
      {
        headers: {
          Authorization: `Bearer ${MINT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const translatedText =
      mintResp.data.translatedText ||
      mintResp.data.result ||
      mintResp.data.translation;
    res.json({ translatedText });
  } catch (err) {
    res.status(500).json({ error: "Translation failed", details: err.message });
  }
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
