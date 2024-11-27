import { transcribeAudio } from './transcription';
import { streamSummary, generateSummary } from './summarization';
import type { StreamCallbacks } from './summarization';

export interface ProcessOptions {
  audioUrl: string;
  isPremium: boolean;
  language?: string;
  maxLength?: number;
  stream?: boolean;
  callbacks?: StreamCallbacks;
}

export async function processPodcastEpisode({
  audioUrl,
  isPremium,
  language,
  maxLength,
  stream = false,
  callbacks
}: ProcessOptions): Promise<string | void> {
  try {
    // Step 1: Transcribe the audio
    const { text: transcription } = await transcribeAudio({
      audioUrl,
      language
    });

    // Step 2: Generate summary
    if (stream && callbacks) {
      // Stream the summary with callbacks
      return streamSummary(transcription, isPremium, callbacks);
    } else {
      // Generate complete summary
      return generateSummary({
        text: transcription,
        isPremium,
        maxLength
      });
    }
  } catch (error) {
    console.error('Podcast processing error:', error);
    throw new Error('Failed to process podcast episode');
  }
}