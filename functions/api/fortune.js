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

        const models = [
            "gemini-pro", // Try legacy model
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-8b"
        ];

        let lastError = null;
        let connectivityCheck = "pending";
        let permissionCheck = "skipped";
        const debugInfo = [];

        // 1. Connectivity Check & POST Method Test
        try {
            const test = await fetch("https://httpbin.org/post", {
                method: 'POST',
                headers: { 'User-Agent': 'FortuneApp/2.0' },
                body: JSON.stringify({ test: 'data' })
            });
            if (test.ok) {
                const binData = await test.json();
                connectivityCheck = `ok. method: ${binData.method || 'UNKNOWN'}`;
            } else {
                connectivityCheck = `failed: ${test.status}`;
            }
        } catch (e) {
            connectivityCheck = `error: ${e.message}`;
        }

        // 2. Try POST generation
        for (const model of models) {
            // Use v1 for stable/legacy, v1beta for others
            const version = (model.includes('1.5') || model === 'gemini-pro') ? 'v1' : 'v1beta';
            const targetUrl = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;

            const reqBody = JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            });

            try {
                const response = await fetch(targetUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': new TextEncoder().encode(reqBody).length.toString(),
                        'User-Agent': 'FortuneApp/2.0 (Cloudflare)',
                        'Referer': 'https://fortune2026-pro.pages.dev/'
                    },
                    body: reqBody
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates && data.candidates[0].content) {
                        const fortuneText = data.candidates[0].content.parts[0].text;
                        return new Response(JSON.stringify({ fortune: fortuneText }), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                } else {
                    const errText = await response.text();
                    debugInfo.push(`POST ${model} Failed: (${version}) ${response.status} - ${errText.substring(0, 100)}`);
                    lastError = errText;
                }
            } catch (e) {
                debugInfo.push(`POST ${model} Error: ${e.message}`);
                lastError = e.message;
            }
        }

        // 3. Deep Debug: If all failed, check GET models permissions
        try {
            const permRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
                headers: { 'User-Agent': 'FortuneApp/2.0 (Cloudflare)' }
            });
            if (permRes.ok) {
                const permData = await permRes.json();
                permissionCheck = `Success, found ${permData.models?.length || 0} models`;
            } else {
                permissionCheck = `Failed: ${permRes.status} - ${await permRes.text()}`;
            }
        } catch (e) {
            permissionCheck = `Error: ${e.message}`;
        }

        return new Response(JSON.stringify({
            error: "All models failed",
            details: lastError,
            connectivity: connectivityCheck,
            permissionCheck: permissionCheck,
            debugLog: debugInfo
        }), { status: 502 });

    } catch (err) {
        console.error("[Function Error]", err);
        return new Response(JSON.stringify({
            error: "Function Logic Error",
            details: err.message,
            stack: err.stack
        }), { status: 500 });
    }
}
