export const POST = async ({ request }) => {
  try {
    const text = await request.text();
    if (!text) {
      throw new Error("Empty request body");
    }
    const body = JSON.parse(text);
    const { type, topic, apiKey: clientKey } = body;

    const apiKey = import.meta.env.OPENAI_API_KEY || clientKey;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Missing API Key. Please provide one in .env or via the UI.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    const SYSTEM_PROMPT =
      "You are an expert English teacher. Your content must be 100% grammatically correct. Return ONLY valid JSON.";
    let userPrompt = "";

    if (type === "grammar") {
      userPrompt = `
                Create a comprehensive English grammar lesson about "${topic}" for A1/A2 level students.
                ENSURE ALL EXAMPLES AND QUIZZES ARE GRAMMATICALLY CORRECT.
                Return ONLY valid JSON with this structure:
                {
                    "id": "generated-${Date.now()}",
                    "title": "${topic}",
                    "level": "A1-A2",
                    "description": "Learn about ${topic}",
                    "theory": "Markdown string explaining the concept with simple words + tables",
                    "examples": [ {"en": "English sentence", "es": "Spanish translation"} ],
                    "quizzes": [
                        {
                            "question": "Quiz question with blank like ___",
                            "options": ["Option A", "Option B", "Option C"],
                            "correct": "Option A",
                            "explanation": "Why it is correct"
                        }
                    ]
                }
            `;
    } else if (type === "speaking") {
      userPrompt = `
                Create 5 speaking drills for the topic "${topic}" (A1/A2 level).
                ENSURE PHONETIC TRANSCRIPTIONS ARE ACCURATE.
                Return ONLY valid JSON with this structure:
                {
                    "id": "generated-speak-${Date.now()}",
                    "title": "${topic} Practice",
                    "level": "A1-A2",
                    "description": "Practice phrases for ${topic}",
                    "drills": [
                        {
                            "id": "d1",
                            "phrase": "English phrase",
                            "phonetic": "/IPA transcription/",
                            "translation": "Spanish translation",
                            "audioUrl": "" 
                        }
                    ]
                }
            `;
    } else if (type === "shadowing") {
      userPrompt = `
                Create a shadowing session for "${topic}" (A1-B2 level appropriate).
                Return ONLY valid JSON:
                {
                    "id": "shadow-${Date.now()}",
                    "title": "${topic}",
                    "level": "Mixed",
                    "description": "Listen and repeat to master intonation.",
                    "segments": [
                        {
                            "text": "Short sentence 1.",
                            "ipa": "/IPA transcription/",
                            "translation": "Spanish translation",
                            "audioUrl": "" 
                        },
                        {
                            "text": "Short sentence 2.",
                            "ipa": "/IPA/",
                            "translation": "Spanish",
                            "audioUrl": ""
                        }
                    ]
                }
            `;
    } else if (type === "roleplay") {
      userPrompt = `
                Create a roleplay scenario strictly about "${topic}".
                Return ONLY valid JSON:
                {
                    "id": "roleplay-${Date.now()}",
                    "title": "${topic}",
                    "level": "Intermediate",
                    "description": "Roleplay scenario description.",
                    "system_instruction": "You are a [Persona, e.g. Doctor]. The user is [User Persona]. Keep responses short (max 20 words). Goal: [Goal].",
                    "initial_message": "Hello, how can I help you today?"
                }
            `;
    } else if (type === "writing_feedback") {
      userPrompt = `
                Analyze the following text written by an English learner (Topic: "${topic}").
                Provide detailed feedback.
                Text to analyze: "${body.text}"
                
                Return ONLY valid JSON with this structure:
                {
                    "score": 8, // 1-10 based on grammar/vocabulary appropriate for level
                    "corrections": [
                        { "original": "text with error", "correction": "corrected text", "explanation": "why it was wrong" }
                    ],
                    "general_feedback": "Overall feedback paragraph.",
                    "better_vocabulary": [
                        { "original": "simple word", "suggestion": "better word", "context": "usage example" }
                    ]
                }
            `;
    } else if (type === "suggest_topics") {
      userPrompt = `
                Suggest 5 engaging topic ideas for a "${body.activityType}" lesson (English Level: ${body.level}).
                Return ONLY valid JSON:
                {
                    "topics": [
                        "Topic Idea 1",
                        "Topic Idea 2",
                        "Topic Idea 3",
                        "Topic Idea 4",
                        "Topic Idea 5"
                    ]
                }
            `;
    } else {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
      });
    }

    const model = import.meta.env.OPENAI_MODEL || "gpt-3.5-turbo";
    console.log(`Using Model: ${model}`);

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API Error: ${err}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    if (body.id) {
      content.id = body.id;
    }

    if (
      ["grammar", "speaking", "shadowing", "roleplay"].includes(type) &&
      content.id
    ) {
      try {
        const { db, Lesson } = await import("astro:db");

        const { eq } = await import("astro:db");
        const existing = await db
          .select()
          .from(Lesson)
          .where(eq(Lesson.id, content.id));

        if (existing.length > 0) {
          await db
            .update(Lesson)
            .set({ content: content, title: content.title })
            .where(eq(Lesson.id, content.id));
          console.log(`Updated lesson ${content.id} in DB`);
        } else {
          await db.insert(Lesson).values({
            id: content.id,
            title: content.title || topic,
            type: type,
            content: content,
          });
          console.log(`Inserted lesson ${content.id} into DB`);
        }
      } catch (dbError) {
        console.error("Failed to save to DB:", dbError);
      }
    }

    return new Response(JSON.stringify(content), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
