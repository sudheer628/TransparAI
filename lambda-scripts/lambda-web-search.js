const https = require("https");

exports.handler = async (event) => {
  console.log("Event received:", JSON.stringify(event, null, 2));

  try {
    // Extract query from the event
    const query = event.parameters?.[0]?.value || event.query || "AI news";

    console.log("Search query:", query);

    // Serper API configuration
    const serperApiKey = process.env.SERPER_API_KEY;
    if (!serperApiKey) {
      throw new Error("SERPER_API_KEY environment variable not set");
    }

    const searchData = JSON.stringify({
      q: query,
      num: 5,
    });

    const options = {
      hostname: "google.serper.dev",
      path: "/search",
      method: "POST",
      headers: {
        "X-API-KEY": serperApiKey,
        "Content-Type": "application/json",
        "Content-Length": searchData.length,
      },
    };

    // Make the API call
    const searchResults = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            reject(new Error("Failed to parse search results"));
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(searchData);
      req.end();
    });

    // Format results for the agent
    let formattedResults = `Search results for "${query}":\n\n`;

    if (searchResults.organic && searchResults.organic.length > 0) {
      searchResults.organic.slice(0, 5).forEach((result, index) => {
        formattedResults += `${index + 1}. ${result.title}\n`;
        formattedResults += `   ${result.snippet}\n`;
        formattedResults += `   Source: ${result.link}\n\n`;
      });
    } else {
      formattedResults += "No search results found.";
    }

    console.log("Formatted results:", formattedResults);

    return {
      statusCode: 200,
      body: {
        "application/json": {
          body: formattedResults,
        },
      },
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: {
        "application/json": {
          body: `Error performing web search: ${error.message}`,
        },
      },
    };
  }
};
