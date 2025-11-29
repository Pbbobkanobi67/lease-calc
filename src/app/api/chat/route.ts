import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert car lease and finance negotiation assistant. You help users understand their car deals and negotiate better terms.

Your expertise includes:
- Lease calculations (money factor, residual value, cap cost, etc.)
- Loan/finance calculations (APR, amortization, etc.)
- Negotiation strategies and tactics
- Common dealer tricks and how to avoid them
- Current market conditions and incentives

When helping users:
1. Be concise and direct - they're likely at a dealership
2. Explain complex terms in simple language
3. If they share numbers, analyze if it's a good deal
4. Suggest specific negotiation tactics when appropriate
5. Flag any red flags or suspicious charges

Common dealer fees to watch for:
- Excessive doc fees (reasonable: $300-500 in most states)
- "Market adjustment" or ADM (usually negotiable)
- Unnecessary add-ons (nitrogen in tires, paint protection, etc.)
- Dealer-installed accessories at inflated prices

Keep responses brief and actionable since the user may be on their phone at a dealership.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Return a helpful mock response if no API key is configured
      return NextResponse.json({
        content: "I'm not connected to an AI service yet. To enable the assistant:\n\n1. Get an API key from Anthropic (claude.ai) or OpenAI\n2. Add it to your .env.local file:\n   ANTHROPIC_API_KEY=your_key_here\n3. Restart the dev server\n\nIn the meantime, here are some tips:\n• Money Factor × 2400 = APR equivalent\n• Aim for selling price at or below invoice\n• Residual values are usually non-negotiable\n• Always negotiate the selling price first, then discuss lease terms",
      });
    }

    // Build the messages array with context
    const systemMessage = context 
      ? `${SYSTEM_PROMPT}\n\nCurrent calculator values:\n${context}`
      : SYSTEM_PROMPT;

    if (process.env.ANTHROPIC_API_KEY) {
      // Use Anthropic/Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemMessage,
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({
        content: data.content[0].text,
      });

    } else if (process.env.OPENAI_API_KEY) {
      // Use OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemMessage },
            ...messages,
          ],
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({
        content: data.choices[0].message.content,
      });
    }

    return NextResponse.json(
      { error: 'No API key configured' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
