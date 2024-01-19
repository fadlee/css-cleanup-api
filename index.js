const express = require("express");
const bodyParser = require("body-parser");
const purifyCSS = require("purify-css");
const { PurgeCSS } = require("purgecss");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/cleanup", async (req, res) => {
  try {
    const { url, htmlCode, engine } = req.body;

    // Extract CSS from URLs and HTML code
    const { htmlContent, cssContent } = await extractCSSFromHTMLs(
      url,
      htmlCode
    );

    // Clean up CSS using PurifyCSS
    console.log("Purifying CSS...");
    let cleanedCSS;
    if (typeof engine == "undefined" || engine == "purify") {
      cleanedCSS = purifyCSS(htmlContent, cssContent, { minify: true });
    } else {
      const purgeResult = await new PurgeCSS().purge({
        content: [{ raw: htmlContent, extension: "html" }],
        css: [{ raw: cssContent, extension: "css" }],
      });
      cleanedCSS = purgeResult[0]["css"];
    }

    res.json({ cleanedCSS });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function extractCSSFromHTMLs(urls, htmlCode) {
  let cssContent = "";
  let htmlContent = "";

  // Load all URLs
  console.log("Loading all page URLs...");
  const responses = await Promise.all(urls.map((url) => axios.get(url)));

  console.log("Extracting CSS...");
  const cssResponses = await Promise.all(
    responses.map(({ data }) => {
      htmlContent += data;
      return extractCSSFromHTML(data);
    })
  );

  cssResponses.forEach(async (response) => {
    console.log(response.data);
    cssContent += response;
  });

  // Extract CSS from HTML code
  if (htmlCode) {
    cssContent += await extractCSSFromHTML(htmlCode);
  }

  htmlContent += htmlCode;

  return { htmlContent, cssContent };
}

async function extractCSSFromHTML(html) {
  const $ = cheerio.load(html);
  const cssUrls = [];
  let cssContent = "";

  // Extract linked CSS from <link> tags
  $('link[rel="stylesheet"]').each(async (index, element) => {
    const href = $(element).attr("href");
    if (href) {
      cssUrls.push(href);
    }
  });

  const responses = await Promise.all(cssUrls.map((url) => axios.get(url)));

  responses.forEach((response, index) => {
    cssContent += response.data;
  });

  // Extract inline styles from <style> tags
  $("style").each((index, element) => {
    cssContent += $(element).html() + "\n";
  });

  return cssContent;
}

async function fetchCSSContent(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching CSS from ${url}: ${error.message}`);
    return "";
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
