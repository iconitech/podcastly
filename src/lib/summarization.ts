import { openai } from './openai';
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

export interface SummarizationOptions {
  text: string;
  isPremium: boolean;
  maxLength?: number;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

function getSystemPrompt(isPremium: boolean): string {
  return isPremium
    ? `You are an expert podcast analyst. Create a detailed summary that includes:
       1. Main topics and key points discussed
       2. Important quotes or statements
       3. Key takeaways and insights
       4. Context and background information where relevant
       Keep the tone professional but engaging.`
    : `You are a podcast summarizer. Create a concise summary that includes:
       1. Main topic or theme
       2. 2-3 key points
       3. One notable takeaway
       Keep it brief and to the point.`;
}

export async function* createSummaryStream(text: string, isPremium: boolean) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: getSystemPrompt(isPremium) },
      { role: 'user', content: text }
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: isPremium ? 1000 : 400
  });

  for await (const chunk of response) {
    if (chunk.choices[0]?.delta?.content) {
      yield chunk.choices[0].delta.content;
    }
  }
}

export async function streamSummary(
  text: string,
  isPremium: boolean,
  callbacks: StreamCallbacks
): Promise<void> {
  try {
    const stream = createSummaryStream(text, isPremium);
    
    for await (const chunk of stream) {
      callbacks.onToken(chunk);
    }
    
    callbacks.onComplete();
  } catch (error) {
    console.error('Streaming error:', error);
    callbacks.onError(error instanceof Error ? error : new Error('Unknown error occurred'));
  }
}

export async function generateSummary({ text, isPremium, maxLength }: SummarizationOptions): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: getSystemPrompt(isPremium) },
        { role: 'user', content: text }
      ],
      temperature: 0.7,
      max_tokens: maxLength || (isPremium ? 1000 : 400)
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Summarization error:', error);
    throw new Error('Failed to generate summary');
  }
}