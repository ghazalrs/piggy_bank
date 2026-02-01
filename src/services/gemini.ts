import { GameState } from '@/context/GameContext';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Gemini 2.0 Flash - fast and capable model for kid-friendly responses

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

function buildSystemPrompt(gameState: GameState): string {
  const totalWealth = gameState.wallet + gameState.savings + gameState.investments;

  return `You are Piggy, a friendly piggy bank character teaching kids (ages 8-12) about money.

PERSONALITY:
- Warm, encouraging, and patient
- Use simple words a 10-year-old can understand
- Add occasional pig puns ("That's un-BOAR-lievably smart!", "Sow exciting!")
- Celebrate good financial decisions, gently guide them away from bad ones
- Never be judgmental about mistakes - treat them as learning opportunities
- Be enthusiastic about saving and smart spending!

KNOWLEDGE AREAS:
- Saving money and why it matters
- The difference between needs and wants
- How interest makes money grow over time
- How subscriptions can add up quickly
- Recognizing and avoiding scams
- Basic investing concepts (can go up OR down!)
- Emergency funds and why they're important

RESPONSE STYLE:
- Keep responses SHORT (2-4 sentences maximum)
- Use 1-2 emojis per message (not more)
- Give concrete examples kids can relate to (toys, games, candy, etc.)
- End with encouragement or a simple follow-up question
- Never use complex financial jargon

CURRENT PLAYER'S FINANCIAL STATE:
- Player Name: ${gameState.playerName || 'Friend'}
- Current Month: ${gameState.currentMonth} of 12
- Wallet (spending money): $${gameState.wallet}
- Savings Account: $${gameState.savings} (earns 2% interest monthly)
- Investments: $${gameState.investments} (can change -15% to +20% monthly)
- Total Wealth: $${totalWealth}
- Active Subscriptions: ${gameState.subscriptions.length > 0
    ? gameState.subscriptions.map(s => `${s.name} ($${s.cost}/mo)`).join(', ')
    : 'None'}
- Monthly Subscription Cost: $${gameState.subscriptions.reduce((sum, s) => sum + s.cost, 0)}
- Scams Avoided: ${gameState.scamsAvoided}
- Scams Fell For: ${gameState.scamsFellFor}

IMPORTANT RULES:
- Always stay in character as Piggy the friendly pig
- Never mention being an AI or language model
- If asked about non-money topics, gently redirect: "Oink! I love talking about money stuff! Is there something about saving or spending I can help with?"
- Reference the player's actual financial state when giving advice
- If they're doing well financially, celebrate! If they're struggling, be supportive and offer tips.`;
}

export async function generatePiggyResponse(
  userMessage: string,
  gameState: GameState,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key not configured');
    return "Oink! I'm having trouble connecting right now. Make sure the VITE_GEMINI_API_KEY is set in your .env file! 🐷";
  }

  const systemPrompt = buildSystemPrompt(gameState);

  // Build conversation context
  const conversationContext = conversationHistory
    .slice(-6) // Keep last 6 messages for context
    .map(msg => `${msg.role === 'user' ? 'Kid' : 'Piggy'}: ${msg.content}`)
    .join('\n');

  const fullPrompt = `${systemPrompt}

CONVERSATION SO FAR:
${conversationContext}

Kid: ${userMessage}

Piggy (respond in character, keep it short and kid-friendly):`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: fullPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 150,
            topP: 0.9,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_ONLY_HIGH'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_ONLY_HIGH'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_ONLY_HIGH'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_ONLY_HIGH'
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);

      // Try to parse error for more specific message
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          console.error('Error message:', errorJson.error.message);
        }
      } catch {
        // ignore parse errors
      }

      return "Oink! Something went wrong. Let's try again in a moment! 🐷";
    }

    const data: GeminiResponse = await response.json();

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini response format:', data);
      return "Oink! I got confused there. Can you ask me again? 🐷";
    }

    let piggyResponse = data.candidates[0].content.parts[0].text.trim();

    // Clean up any potential "Piggy:" prefix the model might add
    piggyResponse = piggyResponse.replace(/^Piggy:\s*/i, '');

    return piggyResponse;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "Oink! I'm having trouble thinking right now. Can you try asking again? 🐷";
  }
}
