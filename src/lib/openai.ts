import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OpenAI API key');
}

export const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

interface GenerateSummaryOptions {
  title: string;
  content: string;
  isPremium: boolean;
}

export async function generateSummary({ title, content, isPremium }: GenerateSummaryOptions) {
  const prompt = isPremium
    ? `Create a detailed summary of this podcast episode titled "${title}". Include:
       1. Main topics and key points discussed
       2. Important quotes or statements
       3. Key takeaways and insights
       4. Context and background information where relevant
       
       Episode content: ${content}`
    : `Create a concise summary of this podcast episode titled "${title}". Focus on:
       1. Main topic or theme
       2. 2-3 key points
       3. One notable takeaway
       
       Episode content: ${content}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: isPremium
          ? "You are an expert podcast analyst providing detailed, insightful summaries."
          : "You are a podcast summarizer providing clear, concise overviews."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: isPremium ? 1000 : 400
  });

  return {
    summary: response.choices[0].message.content,
    tokens_used: response.usage?.total_tokens || 0
  };
}