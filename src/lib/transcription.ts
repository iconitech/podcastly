import { openai } from './openai';

export interface TranscriptionOptions {
  audioUrl: string;
  language?: string;
  prompt?: string;
}

export interface TranscriptionResult {
  text: string;
  language: string;
}

export async function transcribeAudio({ audioUrl, language, prompt }: TranscriptionOptions): Promise<TranscriptionResult> {
  try {
    // Use CORS proxy for audio fetch
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(audioUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch audio file');
    }

    // Get the audio data as a blob
    const audioBlob = await response.blob();

    // Create a File object from the blob
    const file = new File([audioBlob], 'audio.mp3', { type: 'audio/mpeg' });

    // Send to OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language,
      prompt,
      response_format: 'verbose_json'
    });

    return {
      text: transcription.text,
      language: transcription.language
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}