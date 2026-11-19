export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Only POST requests are allowed."
    });
  }

  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  if (!key) {
    return res.status(500).json({
      error: "Vercel settings mein GEMINI_API_KEY missing hai."
    });
  }

  let body;

  try {
    body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;
  } catch {
    return res.status(400).json({
      error: "Invalid request JSON."
    });
  }

  const prompt = body?.prompt;

  if (
    typeof prompt !== "string" ||
    !prompt.trim() ||
    prompt.length > 12000
  ) {
    return res.status(400).json({
      error: "Prompt missing hai ya bohat lamba hai."
    });
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        }),
        signal: AbortSignal.timeout(45000)
      }
    );

    const raw = await upstream.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(502).json({
        error: `Google returned an invalid response (HTTP ${upstream.status}).`
      });
    }

    if (!upstream.ok) {
      const message = String(
        data.error?.message ||
        `Google request failed (HTTP ${upstream.status}).`
      ).split(key).join("[REDACTED]");

      return res.status(upstream.status).json({
        error: message
      });
    }

    const candidate = data.candidates?.[0];

    const text = (candidate?.content?.parts || [])
      .filter(part => typeof part.text === "string" && !part.thought)
      .map(part => part.text)
      .join("")
      .trim();

    if (!text) {
      return res.status(502).json({
        error: "Google ne usable answer nahi diya. Dobara try karo."
      });
    }

    let result;

    try {
      result = JSON.parse(
        text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
      );
    } catch {
      return res.status(502).json({
        error: "AI ka answer valid JSON nahi tha. Dobara try karo."
      });
    }

    if (!result || typeof result !== "object" || Array.isArray(result)) {
      return res.status(502).json({
        error: "AI response ka format invalid tha."
      });
    }

    if (typeof result.correct === "boolean") {
      return res.status(200).json({
        correct: result.correct,
        errorMessage: String(result.errorMessage || ""),
        hint: String(result.hint || "")
      });
    }

    const validQuestion =
      typeof result.question === "string" &&
      result.question.trim() &&
      typeof result.fullSolution === "string" &&
      Array.isArray(result.steps) &&
      result.steps.length > 0 &&
      result.steps.every(step =>
        step &&
        typeof step.label === "string" &&
        typeof step.task === "string" &&
        typeof step.answer === "string" &&
        typeof step.hint === "string"
      );

    if (!validQuestion) {
      return res.status(502).json({
        error: "AI question ka format incomplete tha. Dobara try karo."
      });
    }

    return res.status(200).json({
      ...result,
      parts: Array.isArray(result.parts) ? result.parts : [],
      hasParts: Boolean(result.hasParts)
    });
  } catch (error) {
    const timedOut =
      error?.name === "TimeoutError" ||
      error?.name === "AbortError";

    return res.status(timedOut ? 504 : 502).json({
      error: timedOut
        ? "AI request timeout ho gayi. Dobara try karo."
        : "AI service se connection nahi hua. Dobara try karo."
    });
  }
}
