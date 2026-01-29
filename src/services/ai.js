/**
 * AI Service for English Learning App
 * Proxies requests to the internal /api/generate endpoint to allow server-side key usage.
 */

async function callInternalApi(type, topic, apiKey, id = null) {
  try {
    const payload = JSON.stringify({ type, topic, apiKey, id });
    console.log("Client Payload:", payload);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });

    const text = await response.text();

    if (!response.ok) {
      let errorMsg = "Failed to generate content";
      try {
        const errorData = JSON.parse(text);
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        console.error("Non-JSON API response:", text);
        errorMsg = `Server Error (${response.status}): ${text.substring(0, 100)}`;
      }
      throw new Error(errorMsg);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error(`AI Service Error (${type}):`, error);
    throw error;
  }
}

export async function generateGrammarLesson(topic, apiKey, id) {
  return callInternalApi("grammar", topic, apiKey, id);
}

export async function generateSpeakingDrill(topic, apiKey, id) {
  return callInternalApi("speaking", topic, apiKey, id);
}

export async function generateShadowingSession(topic, apiKey, id) {
  return callInternalApi("shadowing", topic, apiKey, id);
}

export async function generateRoleplayScenario(topic, apiKey, id) {
  return callInternalApi("roleplay", topic, apiKey, id);
}

export async function generateWritingFeedback(topic, text, apiKey) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "writing_feedback", topic, text, apiKey }),
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(JSON.parse(bodyText).error || "Failed to get feedback");
  }
  return JSON.parse(bodyText);
}

export async function suggestTopics(level, activityType, apiKey) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "suggest_topics",
      level,
      activityType,
      apiKey,
    }),
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(JSON.parse(bodyText).error || "Failed to suggest topics");
  }
  return JSON.parse(bodyText).topics;
}
