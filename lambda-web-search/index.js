import fetch from "node-fetch";

export const handler = async (event) => {
  console.log("🔹 Event received from Bedrock:", JSON.stringify(event, null, 2));

  try {
    const query = event?.parameters?.query?.trim();
    if (!query) throw new Error("Missing required parameter: query");

    const SERPER_API_KEY = process.env.SERPER_API_KEY;
    if (!SERPER_API_KEY) throw new Error("SERPER_API_KEY not configured");

    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Serper API error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    const topResults = data.organic?.slice(0, 5) || [];

    const formattedResults = topResults
      .map((r, i) => `🔹 ${r.title}\n${r.link}\n${r.snippet}`)
      .join("\n\n");

    const bodyText =
      formattedResults ||
      "No relevant web search results found for your query.";

    const bedrockResponse = {
      messageVersion: "1.0",
      response: {
        actionGroup: event.actionGroup,
        function: event.function ?? "webSearch",
        functionResponse: {
          responseBody: {
            TEXT: {
              body: `Here are the top search results for "${query}":\n\n${bodyText}`,
            },
          },
        },
      },
    };

    console.log("✅ Returning Bedrock-compatible response:", bedrockResponse);
    return bedrockResponse;
  } catch (err) {
    console.error("❌ Lambda execution error:", err);

    return {
      messageVersion: "1.0",
      response: {
        actionGroup: event.actionGroup ?? "ExternalSearch",
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
