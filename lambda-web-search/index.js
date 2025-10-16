const https = require("https");
const querystring = require("querystring");

/**
 * Web Search Lambda Function for Bedrock Agent
 * Uses Bing Search API for web searches
 */

exports.handler = async (event) => {
  console.log("🔍 Web Search Lambda invoked:", JSON.stringify(event, null, 2));

  try {
    // Parse the Bedrock Agent event
    const { agent, actionGroup, function: functionName, parameters } = event;

    // Extract search query from parameters - handle multiple formats
    console.log("📥 Received parameters:", JSON.stringify(parameters, null, 2));

    let searchQuery = null;

    // Try different parameter formats that Bedrock might send
    if (parameters) {
      searchQuery =
        parameters.query ||
        parameters.search_query ||
        parameters.q ||
        parameters.searchQuery ||
        parameters.text ||
        parameters.input;

      // If parameters is an array, get the first item
      if (Array.isArray(parameters) && parameters.length > 0) {
        searchQuery =
          parameters[0].query || parameters[0].value || parameters[0];
      }
    }

    if (!searchQuery) {
      console.log("❌ No search query found in parameters:", parameters);
      return {
        statusCode: 400,
        body: {
          TEXT: {
            body:
              "Error: No search query provided. Received parameters: " +
              JSON.stringify(parameters),
          },
        },
      };
    }

    console.log(`🔎 Searching for: "${searchQuery}"`);

    // Perform web search
    const searchResults = await performWebSearch(searchQuery);

    // Format results for Bedrock Agent
    const formattedResults = formatSearchResults(searchResults, searchQuery);

    return {
      statusCode: 200,
      body: {
        TEXT: {
          body: formattedResults,
        },
      },
    };
  } catch (error) {
    console.error("❌ Web search error:", error);

    return {
      statusCode: 500,
      body: {
        TEXT: {
          body: `Web search failed: ${error.message}`,
        },
      },
    };
  }
};

/**
 * Perform web search using Bing Search API
 * Falls back to DuckDuckGo if Bing API key not available
 */
async function performWebSearch(query) {
  const bingApiKey = process.env.BING_SEARCH_API_KEY;

  if (bingApiKey) {
    return await searchWithBing(query, bingApiKey);
  } else {
    // Fallback to a simple web search simulation
    console.log("⚠️ No Bing API key found, using fallback search");
    return await fallbackSearch(query);
  }
}

/**
 * Search using Bing Search API
 */
async function searchWithBing(query, apiKey) {
  const endpoint = "https://api.bing.microsoft.com/v7.0/search";
  const params = querystring.stringify({
    q: query,
    count: 5,
    offset: 0,
    mkt: "en-US",
    safesearch: "Moderate",
  });

  const options = {
    hostname: "api.bing.microsoft.com",
    path: `/v7.0/search?${params}`,
    method: "GET",
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey,
      "User-Agent": "TransparAI-WebSearch/1.0",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);

          if (response.webPages && response.webPages.value) {
            resolve(response.webPages.value);
          } else {
            resolve([]);
          }
        } catch (error) {
          reject(new Error(`Failed to parse Bing response: ${error.message}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Bing API request failed: ${error.message}`));
    });

    req.end();
  });
}

/**
 * Fallback search for demonstration (returns simulated results)
 */
async function fallbackSearch(query) {
  console.log("🔄 Using fallback search simulation");

  // Simulate search results based on query
  const simulatedResults = [];

  if (query.toLowerCase().includes("nova pro")) {
    simulatedResults.push({
      name: "Amazon Nova Pro - AWS Foundation Model",
      url: "https://aws.amazon.com/bedrock/nova/",
      snippet:
        "Amazon Nova Pro is a multimodal foundation model that can process text, images, and videos. It offers high performance for complex reasoning tasks and is available through Amazon Bedrock.",
    });

    simulatedResults.push({
      name: "AWS Announces Amazon Nova Models",
      url: "https://aws.amazon.com/blogs/aws/amazon-nova-models/",
      snippet:
        "Amazon Nova Pro provides advanced capabilities for text generation, image understanding, and video analysis. It features improved reasoning and can handle complex multi-step tasks.",
    });
  } else if (
    query.toLowerCase().includes("machine learning") ||
    query.toLowerCase().includes("ai")
  ) {
    simulatedResults.push({
      name: "Machine Learning Fundamentals",
      url: "https://example.com/ml-fundamentals",
      snippet:
        "Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.",
    });
  } else {
    simulatedResults.push({
      name: `Search Results for: ${query}`,
      url: "https://example.com/search",
      snippet: `Here are the search results for "${query}". This is a simulated result since no Bing API key is configured.`,
    });
  }

  return simulatedResults;
}

/**
 * Format search results for Bedrock Agent consumption
 */
function formatSearchResults(results, query) {
  if (!results || results.length === 0) {
    return `No web search results found for "${query}".`;
  }

  let formattedText = `Web search results for "${query}":\n\n`;

  results.forEach((result, index) => {
    formattedText += `${index + 1}. **${result.name}**\n`;
    formattedText += `   URL: ${result.url}\n`;
    formattedText += `   Summary: ${result.snippet}\n\n`;
  });

  formattedText += `\nBased on these search results, I can provide you with current information about "${query}".`;

  return formattedText;
}
