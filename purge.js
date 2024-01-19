const axios = require("axios");
const cheerio = require("cheerio");
const { PurgeCSS } = require("purgecss");

async function fetchHtmlAndCss(externalHtmlUrl) {
  try {
    // Fetch the external HTML page
    const response = await axios.get(externalHtmlUrl);

    // Parse HTML content using Cheerio
    const $ = cheerio.load(response.data);

    // Extract CSS links from the HTML
    const cssLinks = [];
    $('link[rel="stylesheet"]').each((index, element) => {
      const href = $(element).attr("href");
      if (href) {
        cssLinks.push(href);
      }
    });

    let cssContent = "";

    // Fetch and add CSS content to PurgeCSS configuration
    const cssPromises = cssLinks.map(async (cssUrl) => {
      const cssResponse = await axios.get(cssUrl);
      cssContent += cssResponse.data;
      return {
        raw: cssResponse.data,
        extension: "css",
      };
    });

    const cssFiles = await Promise.all(cssPromises);

    // Create PurgeCSS configuration
    const purgecssConfig = {
      content: [
        {
          raw: response.data,
          extension: "html",
        },
      ],
      // css: cssFiles,
      css: [
        {
          raw: cssContent,
          extension: "css",
        },
      ],
      rejected: true,
      rejectedCss: true,
      // Add other configuration options as needed
    };

    // Run PurgeCSS to get the result
    const result = await new PurgeCSS().purge(purgecssConfig);

    console.log(result);

    // Output the purged CSS
    result.forEach(({ file, css }) => {
      console.log(`Purged CSS from ${file}:\n${css}`);
    });
  } catch (error) {
    console.error("Error fetching or running PurgeCSS:", error);
  }
}

// URL of the HTML page
const externalHtmlUrl = "https://example.com/";

// Call the function
fetchHtmlAndCss(externalHtmlUrl);
