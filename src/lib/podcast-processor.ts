import { transcribeAudio } from './transcription';
import { streamSummary, generateSummary } from './summarization';
import type { StreamCallbacks } from './summarization';

export interface ProcessCallbacks extends StreamCallbacks {
  onProgress: (percent: number) => void;
}

export interface ProcessOptions {
  audioUrl: string;
  isPremium: boolean;
  language?: string;
  maxLength?: number;
  stream?: boolean;
  callbacks?: ProcessCallbacks;
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
    if (callbacks) {
      callbacks.onProgress(10); // Started transcription
    }

    // Step 1: Transcribe the audio
    const { text: transcription } = await transcribeAudio({
      audioUrl,
      language
    });

    if (callbacks) {
      callbacks.onProgress(50); // Transcription complete
    }

    // Step 2: Generate summary
    if (stream && callbacks) {
      // Stream the summary with callbacks and progress updates
      let tokensGenerated = 0;
      const estimatedTokens = isPremium ? 1000 : 400;
      
      return streamSummary(transcription, isPremium, {
        onToken: (token) => {
          tokensGenerated++;
          callbacks.onToken(token);
          // Update progress from 50% to 100% based on tokens generated
          const summaryProgress = (tokensGenerated / estimatedTokens) * 50;
          callbacks.onProgress(Math.min(50 + summaryProgress, 99));
        },
        onComplete: () => {
          callbacks.onProgress(100);
          callbacks.onComplete();
        },
        onError: callbacks.onError
      });
    } else {
      // Generate complete summary
      const summary = await generateSummary({
        text: transcription,
        isPremium,
        maxLength
      });
      
      if (callbacks) {
        callbacks.onProgress(100);
      }
      
      return summary;
    }
  } catch (error) {
    console.error('Podcast processing error:', error);
    if (callbacks) {
      callbacks.onError(error instanceof Error ? error : new Error('Failed to process podcast episode'));
    }
    throw new Error('Failed to process podcast episode');
  }
}