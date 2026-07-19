const fs = require('fs');
const path = require('path');

// Utility to calculate cosine similarity (dot product of normalized vectors)
function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
    }
    return dotProduct;
}

// Simple keyword search fallback when running offline/without API keys
function keywordSearch(query, chunks) {
    const stopWords = new Set(['the', 'and', 'for', 'are', 'you', 'with', 'about', 'from', 'this', 'that', 'your']);
    const queryWords = query.toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 2 && !stopWords.has(w));

    if (queryWords.length === 0) {
        return chunks.slice(0, 3); // Return first 3 chunks if query is too short
    }

    const scored = chunks.map(chunk => {
        const text = (chunk.title + " " + chunk.content).toLowerCase();
        let score = 0;
        queryWords.forEach(word => {
            if (text.includes(word)) {
                score += 1;
            }
        });
        return { ...chunk, score };
    });

    // Sort by score descending
    const filtered = scored.filter(c => c.score > 0);
    if (filtered.length === 0) {
        return chunks.slice(0, 2); // Default fallback
    }
    return filtered.sort((a, b) => b.score - a.score).slice(0, 3);
}

module.exports = async (req, res) => {
    // Enable CORS for frontend requests
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message } = req.body;
        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Load resume data
        const dataPath = path.join(process.cwd(), 'api/resume_data.json');
        if (!fs.existsSync(dataPath)) {
            return res.status(500).json({ error: 'Resume database not generated. Run npm run generate-embeddings first.' });
        }

        const resumeChunks = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        let retrievedChunks = [];

        // Check if API keys are set
        const geminiKey = process.env.GEMINI_API_KEY;
        const openAIKey = process.env.OPENAI_API_KEY;

        if (geminiKey) {
            // 1. Get embedding for user query via Gemini Embedding API
            const embedUrl = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`;
            const embedResponse = await fetch(embedUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "models/text-embedding-004",
                    content: { parts: [{ text: message }] }
                })
            });

            if (embedResponse.ok) {
                const embedData = await embedResponse.json();
                const queryEmbedding = embedData.embedding.values;

                // 2. Score chunks by cosine similarity
                const scored = resumeChunks.map(chunk => {
                    const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
                    return { ...chunk, similarity };
                });

                // Sort and get top 3
                retrievedChunks = scored.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
            } else {
                console.warn("Gemini embedding failed, falling back to keyword search.");
                retrievedChunks = keywordSearch(message, resumeChunks);
            }
        } else if (openAIKey) {
            // OpenAI RAG Flow
            const embedResponse = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openAIKey}`
                },
                body: JSON.stringify({
                    input: message,
                    model: 'text-embedding-3-small'
                })
            });

            if (embedResponse.ok) {
                const embedData = await embedResponse.json();
                const queryEmbedding = embedData.data[0].embedding;

                const scored = resumeChunks.map(chunk => {
                    const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
                    return { ...chunk, similarity };
                });

                retrievedChunks = scored.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
            } else {
                console.warn("OpenAI embedding failed, falling back to keyword search.");
                retrievedChunks = keywordSearch(message, resumeChunks);
            }
        } else {
            // No API key set, use offline keyword search
            retrievedChunks = keywordSearch(message, resumeChunks);
        }

        // Construct System Context and User Prompt
        const contextText = retrievedChunks.map(c => `[${c.title}]:\n${c.content}`).join('\n\n');

        const systemPrompt = `You are Maricon Jane G. Laguting's AI Portfolio Assistant.
Use the following relevant parts of her resume to answer the user's question accurately, professionally, and concisely:

---
${contextText}
---

INSTRUCTIONS:
1. Answer the user's question in a professional, warm, and helpful tone. Speak in the first person ("I" or "Maricon has...") or as a helper representation of Maricon.
2. Rely ONLY on the provided context. If the answer is not in the resume context, politely say that you don't have that information and suggest contacting Maricon directly via email (lagutingmaricon@gmail.com) or phone (09923033890).
3. Keep the response concise (2-4 sentences max) so it fits nicely in a small chat window. Use simple markdown for spacing.`;

        // 3. Generation Step
        if (geminiKey) {
            const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
            const genResponse = await fetch(genUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }
                    ],
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 250
                    }
                })
            });

            if (genResponse.ok) {
                const genData = await genResponse.json();
                const reply = genData.candidates[0].content.parts[0].text;
                return res.status(200).json({ reply });
            } else {
                throw new Error(`Gemini Chat Generation failed: ${await genResponse.text()}`);
            }
        } else if (openAIKey) {
            const genResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openAIKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message }
                    ],
                    max_tokens: 250,
                    temperature: 0.5
                })
            });

            if (genResponse.ok) {
                const genData = await genResponse.json();
                const reply = genData.choices[0].message.content;
                return res.status(200).json({ reply });
            } else {
                throw new Error(`OpenAI Chat Generation failed: ${await genResponse.text()}`);
            }
        } else {
            // Demo/Offline Mode response template
            const topChunk = retrievedChunks[0];
            const offlineReply = `*(Demo Mode)* Based on your question, I found this relevant information from Maricon's resume:\n\n**${topChunk.title}**\n${topChunk.content.split('\n')[0]}\n\n*Please set GEMINI_API_KEY or OPENAI_API_KEY environment variables to enable full AI conversational responses.*`;
            return res.status(200).json({ reply: offlineReply });
        }

    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
