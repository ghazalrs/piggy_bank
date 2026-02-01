const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// ElevenLabs Text-to-Speech for Piggy's voice

// Rachel voice - friendly and warm, good for kids content
// You can change this to any ElevenLabs voice ID
const PIGGY_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

// Alternative voice options:
// 'EXAVITQu4vr4xnSDxMaL' - Bella (young female)
// 'MF3mGyEYCl7XYWbV9V6O' - Elli (young female)
// 'jBpfuIE2acCO8z3wKNLl' - Gigi (young, animated)

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

// Audio player instance for managing playback
let currentAudio: HTMLAudioElement | null = null;

/**
 * Speaks the given text using ElevenLabs text-to-speech
 * Returns a promise that resolves when speech is complete
 */
export async function speakText(text: string): Promise<void> {
  if (!ELEVENLABS_API_KEY) {
    console.error('ElevenLabs API key not configured');
    throw new Error('VITE_ELEVENLABS_API_KEY is not set in .env file');
  }

  // Stop any currently playing audio
  stopSpeaking();

  // Clean up the text for better speech
  const cleanedText = text
    .replace(/[*_~`]/g, '') // Remove markdown formatting
    .replace(/:\w+:/g, '')  // Remove emoji codes like :smile:
    .trim();

  const voiceSettings: VoiceSettings = {
    stability: 0.5,        // Lower = more expressive, higher = more consistent
    similarity_boost: 0.75, // How closely to match the original voice
    style: 0.3,            // Expressiveness (only for some models)
    use_speaker_boost: true
  };

  try {
    console.log('Calling ElevenLabs API with text:', cleanedText.substring(0, 50) + '...');

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${PIGGY_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: cleanedText,
          model_id: 'eleven_turbo_v2_5', // Fast, high-quality model (free tier compatible)
          voice_settings: voiceSettings,
        }),
      }
    );

    console.log('ElevenLabs response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // Get the audio blob
    const audioBlob = await response.blob();
    console.log('Audio blob size:', audioBlob.size, 'bytes');

    // Create object URL and play
    const audioUrl = URL.createObjectURL(audioBlob);

    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onended = () => {
        console.log('Audio finished playing');
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        resolve();
      };

      audio.onerror = (error) => {
        console.error('Audio error:', error);
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        reject(error);
      };

      // Wait for metadata to load to get duration
      audio.onloadedmetadata = () => {
        console.log('Audio duration:', audio.duration, 'seconds');
      };

      // Play the audio
      audio.play()
        .then(() => {
          console.log('Audio started playing, duration:', audio.duration);
        })
        .catch((error) => {
          console.error('Play failed:', error);
          URL.revokeObjectURL(audioUrl);
          currentAudio = null;
          reject(error);
        });
    });
  } catch (error) {
    console.error('Error with ElevenLabs TTS:', error);
    throw error;
  }
}

/**
 * Stops any currently playing speech
 */
export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Checks if audio is currently playing
 */
export function isSpeaking(): boolean {
  return currentAudio !== null && !currentAudio.paused;
}

/**
 * Gets available voices from ElevenLabs (for future voice selection feature)
 */
export async function getAvailableVoices(): Promise<Array<{ voice_id: string; name: string }>> {
  if (!ELEVENLABS_API_KEY) {
    console.error('ElevenLabs API key not configured');
    return [];
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }

    const data = await response.json();
    return data.voices.map((voice: { voice_id: string; name: string }) => ({
      voice_id: voice.voice_id,
      name: voice.name,
    }));
  } catch (error) {
    console.error('Error fetching voices:', error);
    return [];
  }
}
