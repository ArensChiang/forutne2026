export async function onRequestPost({ request, env }) {
    try {
        let topic = "general";
        try {
            const body = await request.json();
            topic = body.topic || "general";
        } catch (e) {
            console.warn("Failed to parse request body, using default topic", e);
        }

        // Read API key from Cloudflare environment variable
        const apiKey = env.GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({
                error: "API Key not configured",
                details: "Please set GEMINI_API_KEY in Cloudflare environment variables."
            }), { status: 500 });
        }

        const prompt = `
      你是一位幽默、充滿智慧且帶點「會計師職業病」的 AI 算命師。
      請針對「2026年的${topic}運勢」抽出一支籤，並給出一段約 50-80 字的解籤。
      
      風格要求：
      1. 幽默風趣，可以用一些會計或職場術語（如：借貸平衡、資產重估、審計通過）。
      2. 正向鼓勵為主。
      3. 最後給一個「幸運會計科目」或「幸運數字」。
      
      請直接回覆文字內容，不要有 markdown 格式。
    `;

        // Ollama API Configuration
        const OLLAMA_API_URL = "https://ollama.chienchen.net.tw/api/generate";
        const OLLAMA_MODEL = "qwen3:8b";

        const ollamaPayload = {
            model: OLLAMA_MODEL,
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.7,
                num_predict: 200
            }
        };

        try {
            console.log(`Calling Ollama at ${OLLAMA_API_URL} with model ${OLLAMA_MODEL}`);

            const response = await fetch(OLLAMA_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'FortuneApp/2.0 (Cloudflare)'
                },
                body: JSON.stringify(ollamaPayload)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.response) {
                    return new Response(JSON.stringify({ fortune: data.response }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                } else {
                    throw new Error("Invalid response format from Ollama");
                }
            } else {
                const errText = await response.text();
                throw new Error(`Ollama API Failed: ${response.status} - ${errText.substring(0, 100)}`);
            }

        } catch (e) {
            console.error("[Ollama Error]", e);
            return new Response(JSON.stringify({
                error: "Fortune Generation Failed",
                details: e.message,
                suggestion: "Please check if your Cloudflare Tunnel is pointing to http://192.168.8.9:11434"
            }), { status: 502 });
        }

    } catch (err) {
        console.error("[Function Error]", err);
        return new Response(JSON.stringify({
            error: "Function Logic Error",
            details: err.message,
            stack: err.stack
        }), { status: 500 });
    }
}
