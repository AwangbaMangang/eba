const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const MINT_API_URL = "https://gerrit.wikimedia.org/r/mediawiki/services/machinetranslation"; // Replace with actual MinT API URL
const MINT_API_KEY = "MinT"; // Replace with your actual MinT API key
async function fetchWikiText(pageUrl) {
  if (typeof pageUrl !== "string" || !pageUrl.trim()) {
    throw new Error("Wikipedia URL must be a non-empty string");
  }

  // Extract page name from Wikipedia URL
  const match = pageUrl.match(/\/wiki\/([^?#]+)/);
  if (!match) throw new Error("Invalid Wikipedia URL format");
  const pageName = decodeURIComponent(match[1]);

  // Try fetching plain text, fallback to summary extract if needed
  try {
    const resp = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/plain/${pageName}`
    );
    return resp.data;
  } catch (plainErr) {
    try {
      const resp = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${pageName}`
      );
      return resp.data.extract;
    } catch (summaryErr) {
      // Log both errors for debugging
      console.error("Failed to fetch plain and summary:", plainErr, summaryErr);
      throw new Error(
        `Failed to fetch Wikipedia text for page: ${pageName}. Errors: ${plainErr.message}, ${summaryErr.message}`
      );
    }
  }
}

