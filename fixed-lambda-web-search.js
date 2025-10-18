const https = require("https");

exports.handler = async (event) => {
  console.log("Event received:", JSON.stringify(event, null, 2));

  try {
    // Extract query from Bedrock Agent event format
    let query = "";

    // Try different ways to extract the query parameter
    if (event.parameters && Array.isArray(event.parameters)) {
      const queryParam = event.parameters.find((p) => p.name === "query");
      query = queryParam ? queryParam.value : "";
    } else if (event.inputText) {
      query = event.inputText;
    } else if (event.query) {
      query = event.query;
    } else if (event.requestBody && event.requestBody.content) {
      // Parse the content for parameters
      const content = event.requestBody.content;
      if (
        content["application/json"] &&
        content["application/json"].properties
      ) {
        query = content["application/json"].properties.query || "";
      }
    }

    if (!query) {
      console.error("No query parameter found in event");
      return {
        messageVersion: "1.0",
        response: {
          actionGroup: event.actionGroup || "ExternalSearch",
          function: event.function || "webSearch",
          functionResponse: {
            responseBody: {
              TEXT: {
                body: "Error: Missing required parameter: query",
              },
            },
          },
        },
      };
    }

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

    // Return in Bedrock Agent expected format
    return {
      messageVersion: "1.0",
      response: {
        actionGroup: event.actionGroup || "ExternalSearch",
        function: event.function || "webSearch",
        functionResponse: {
          responseBody: {
            TEXT: {
              body: formattedResults,
            },
          },
        },
      },
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      messageVersion: "1.0",
      response: {
        actionGroup: event.actionGroup || "ExternalSearch",
        function: event.function || "webSearch",
        functionResponse: {
          responseBody: {
            TEXT: {
              body: `Error performing web search: ${error.message}`,
            },
          },
        },
      },
    };
  }
};
