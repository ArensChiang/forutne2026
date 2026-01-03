export async function onRequestPost({ request, env }) {
    try {
        const { topic = "general" } = await request.json();

        // API Key from Environment Variable (Best Practice) or Fallback
        const apiKey = env.GEMINI_API_KEY || "AIzaSyDqQekMIDL8j-pmdkQOn8kiWm-mx6b7U7E";

        const prompt = `
      你是一位幽默、充滿智慧且帶點「會計師職業病」的 AI 算命師。
      請針對「2026年的${topic}運勢」抽出一支籤，並給出一段約 50-80 字的解籤。
      
      風格要求：
      1. 幽默風趣，可以用一些會計或職場術語（如：借貸平衡、資產重估、審計通過）。
      2. 正向鼓勵為主。
      3. 最後給一個「幸運會計科目」或「幸運數字」。
      
      請直接回覆文字內容，不要有 markdown 格式。
    `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const fortuneText = data.candidates[0].content.parts[0].text;
            return new Response(JSON.stringify({ fortune: fortuneText }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ error: "No fortune generated" }), { status: 500 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
