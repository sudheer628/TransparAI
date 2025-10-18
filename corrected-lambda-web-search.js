const https = require("https");

exports.handler = async (event) => {
  console.log("🔹 Event received from Bedrock:", JSON.stringify(event));

  try {
    // Extract query from Bedrock Agent event format
    let query = "";

    // Debug: Log the parameters array
    console.log("🔍 Parameters array:", event.parameters);

    // Bedrock Agents send parameters in this format:
    // event.parameters = [{"name": "query", "type": "string", "value": "Amazon Nova Pro"}]
    if (event.parameters && Array.isArray(event.parameters)) {
      console.log(
        "✅ Parameters is an array with length:",
        event.parameters.length
      );

      const queryParam = event.parameters.find((p) => p.name === "query");
      console.log("🔍 Found query parameter:", queryParam);

      if (queryParam && queryParam.value) {
        query = queryParam.value;
        console.log("✅ Extracted query:", query);
      }
    }

    // Fallback methods for different event formats
    if (!query && event.inputText) {
      query = event.inputText;
      console.log("✅ Using inputText as query:", query);
    }
    if (!query && event.query) {
      query = event.query;
      console.log("✅ Using event.query as query:", query);
    }

    if (!query) {
      console.error("❌ No query parameter found in event");
      console.error("📋 Full event structure:", JSON.stringify(event, null, 2));
      return {
        messageVersion: "1.0",
        response: {
          actionGroup: event.actionGroup || "action_group_web_search",
          function: event.function || "webSearch",
          functionResponse: {
            responseBody: {
              TEXT: {
                body: "Error: No query parameter found. Please provide a search query.",
              },
            },
          },
        },
      };
    }

    console.log("🚀 Starting web search for query:", query);

    // Serper API configuration
    const serperApiKey = process.env.SERPER_API_KEY;
    if (!serperApiKey) {
      console.error("❌ SERPER_API_KEY environment variable not set");
      return {
        messageVersion: "1.0",
        response: {
          actionGroup: event.actionGroup || "action_group_web_search",
          function: event.function || "webSearch",
          functionResponse: {
            responseBody: {
              TEXT: {
                body: "Error: SERPER_API_KEY environment variable not set",
              },
            },
          },
        },
      };
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

    console.log("🌐 Making Serper API call...");

    // Make the API call
    const searchResults = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          console.log("📡 Serper API response status:", res.statusCode);

          try {
            const result = JSON.parse(data);
            console.log("✅ Serper API response parsed successfully");
            resolve(result);
          } catch (error) {
            console.error("❌ Failed to parse search results:", error);
            reject(new Error("Failed to parse search results"));
          }
        });
      });

      req.on("error", (error) => {
        console.error("❌ Request error:", error);
        reject(error);
      });

      req.write(searchData);
      req.end();
    });

    // Format results for the agent
    let formattedResults = `Search results for "${query}":\n\n`;

    if (searchResults.organic && searchResults.organic.length > 0) {
      console.log("✅ Found", searchResults.organic.length, "search results");
      searchResults.organic.slice(0, 5).forEach((result, index) => {
        formattedResults += `${index + 1}. ${result.title}\n`;
        formattedResults += `   ${result.snippet}\n`;
        formattedResults += `   Source: ${result.link}\n\n`;
      });
    } else if (searchResults.error) {
      console.error("❌ Search API error:", searchResults.error);
      formattedResults = `Search error: ${searchResults.error}`;
    } else {
      console.log("⚠️ No search results found");
      formattedResults += "No search results found.";
    }

    console.log("📝 Formatted results length:", formattedResults.length);

    // Return in Bedrock Agent expected format
    const response = {
      messageVersion: "1.0",
      response: {
        actionGroup: event.actionGroup || "action_group_web_search",
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

    console.log("✅ Returning response to Bedrock Agent");
    return response;
  } catch (error) {
    console.error("❌ Lambda execution error:", error);

    return {
      messageVersion: "1.0",
      response: {
        actionGroup: event.actionGroup || "action_group_web_search",
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
