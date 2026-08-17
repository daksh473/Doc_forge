const https = require('https');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PRIMARY_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const FALLBACK_MODELS = ["openai/gpt-oss-120b", "qwen/qwen3.6-27b", "groq/compound"];

/**
 * Executes an HTTP POST request to Groq API endpoint
 */
function makeGroqRequest(model, messages, jsonMode = true) {
  return new Promise((resolve, reject) => {
    const payload = {
      model: model,
      messages: messages,
      temperature: 0.1
    };
    if (jsonMode) {
      payload.response_format = { type: "json_object" };
    }

    const data = JSON.stringify(payload);
    const req = https.request({
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(body);
            const content = parsed.choices?.[0]?.message?.content;
            resolve({ content, raw: parsed });
          } catch (e) {
            reject(new Error(`Failed to parse Groq response JSON: ${e.message}`));
          }
        } else {
          try {
            const errObj = JSON.parse(body);
            const msg = errObj.error?.message || `HTTP ${res.statusCode}`;
            const err = new Error(`Groq API Error (${res.statusCode}): ${msg}`);
            err.statusCode = res.statusCode;
            err.code = errObj.error?.code;
            reject(err);
          } catch (e) {
            reject(new Error(`Groq API Error HTTP ${res.statusCode}: ${body.slice(0, 200)}`));
          }
        }
      });
    });

    req.on('error', err => reject(err));
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Groq API request timed out after 30 seconds'));
    });

    req.write(data);
    req.end();
  });
}

/**
 * Main reusable LLM caller with model fallback and retry logic.
 */
async function callLLM({ prompt, systemPrompt, jsonMode = true, maxRetries = 1 }) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is not configured');
  }

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await makeGroqRequest(model, messages, jsonMode);
        if (jsonMode) {
          try {
            const json = JSON.parse(result.content);
            return json;
          } catch (err) {
            if (attempt < maxRetries) continue;
            throw new Error(`Groq returned invalid JSON format: ${err.message}`);
          }
        }
        return result.content;
      } catch (err) {
        lastError = err;
        if (err.statusCode === 404 || (err.message && err.message.includes('model_not_found'))) {
          break; // Try next model immediately
        }
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
  }

  throw lastError || new Error('Failed to obtain LLM response after retries');
}

module.exports = {
  callLLM,
  completeJSON: (opts) => callLLM({ ...opts, jsonMode: true }),
  completeText: (opts) => callLLM({ ...opts, jsonMode: false })
};
