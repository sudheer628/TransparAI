import fetch from "node-fetch";

export const handler = async (event) => {
  console.log(
    "🔹 Event received from Bedrock:",
    JSON.stringify(event, null, 2)
  );

  try {
    // Extract query from Bedrock Agent event format
    // Parameters come as: [{"name": "query", "type": "string", "value": "Amazon Nova Pro"}]
    let query = "";

    if (event?.parameters && Array.isArray(event.parameters)) {
      console.log("🔍 Parameters array:", event.parameters);
      const queryParam = event.parameters.find((p) => p.name === "query");
      query = queryParam?.value?.trim();
      console.log("✅ Extracted query from parameters array:", query);
    }

    // Fallback methods
    if (!query && event?.inputText) {
      query = event.inputText.trim();
      console.log("✅ Using inputText as query:", query);
    }

    if (!query) {
      throw new Error("Missing required parameter: query");
    }

    const SERPER_API_KEY = process.env.SERPER_API_KEY;
    if (!SERPER_API_KEY) {
      throw new Error("SERPER_API_KEY not configured");
    }

    console.log("🚀 Starting web search for query:", query);

    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num: 5 }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Serper API error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    console.log(
      "📡 Serper API response received, organic results:",
      data.organic?.length || 0
    );

    const topResults = data.organic?.slice(0, 5) || [];
    const formattedResults = topResults
      .map(
        (r, i) => `${i + 1}. ${r.title}\n   ${r.snippet}\n   Source: ${r.link}`
      )
      .join("\n\n");

    const bodyText =
      formattedResults ||
      "No relevant web search results found for your query.";

    const bedrockResponse = {
      messageVersion: "1.0",
      response: {
        actionGroup: event.actionGroup || "action_group_web_search",
        function: event.function ?? "webSearch",
        functionResponse: {
          responseBody: {
            TEXT: {
              body: `Search results for "${query}":\n\n${bodyText}`,
            },
          },
        },
      },
    };

    console.log("✅ Returning Bedrock-compatible response");
    return bedrockResponse;
  } catch (err) {
    console.error("❌ Lambda execution error:", err);

    return {
      messageVersion: "1.0",
      response: {
        actionGroup: event.actionGroup ?? "action_group_web_search",
        function: event.function ?? "webSearch",
        functionResponse: {
          responseBody: {
            TEXT: {
              body: `Error: ${err.message}`,
            },
          },
        },
      },
    };
  }
};
