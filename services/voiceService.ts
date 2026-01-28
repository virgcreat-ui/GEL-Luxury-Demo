
export type VoiceStatus = "idle" | "thinking" | "speaking" | "error";

// DEV flag for voice debugging (set to true for console logs)
const DEV_VOICE_LOG = false;

// Fallback voice messages when audio is missing (prevents EN fallback for non-EN languages)
const MISSING_VOICE_FALLBACK: Record<string, string> = {
  en: "I don't have this audio yet — but here's the info on screen.",
  fr: "Je n'ai pas encore cette phrase en audio — mais voici l'info à l'écran.",
  de: "Ich habe diesen Ton noch nicht — aber hier sind die Informationen auf dem Bildschirm.",
  es: "No tengo este audio aún — pero aquí está la info en pantalla.",
  it: "Non ho ancora questo audio — ma ecco le info sullo schermo.",
  pt: "Ainda não tenho este áudio — mas aqui está a info no ecrã."
};

// Blacklist of known corrupted/problematic MP3 files (use browser TTS fallback for these)
const CORRUPTED_MP3_BLACKLIST: Set<string> = new Set([
  'guest_topic_facilities_fr', // French "Installations" has garbled audio
]);

export class VoiceService {
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private nextStartTime: number = 0;
  private currentAudio: HTMLAudioElement | null = null;
  private abortController: AbortController | null = null;

  /**
   * Browser fallback for instant greetings.
   * Configured for female voice with warm, natural tone.
   */
  public speakInstant(text: string, lang: string = 'en-GB') {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel any pending/playing speech
    window.speechSynthesis.cancel();

    if (DEV_VOICE_LOG) {
      console.log(`[Voice] TTS: ${lang} - "${text.substring(0, 60)}..."`);
    }

    // Small delay helps avoid stuttering/overlapping issues in some browsers
    setTimeout(() => {
      const ut = new SpeechSynthesisUtterance(text);
      ut.lang = lang;
      ut.rate = 0.95;  // Slightly slower for natural warmth
      ut.pitch = 1.1;  // Slightly higher for female voice
      ut.volume = 1.0; // Full volume

      // Prefer female voice if available
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v =>
        v.lang.startsWith(lang.split('-')[0]) &&
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))
      );
      if (femaleVoice) {
        ut.voice = femaleVoice;
      }

      window.speechSynthesis.speak(ut);
    }, 10);
  }

  /**
   * Play pre-generated ElevenLabs MP3 audio file.
   * Falls back to browser TTS if file doesn't exist or is blacklisted.
   * @param scriptId - ID of the voice script (e.g., 'welcome', 'student_welcome')
   * @param lang - Language code (en, fr, de, es, it, pt)
   * @param fallbackText - Text to speak if MP3 file not found
   */
  public async playPreGenerated(scriptId: string, lang: string, fallbackText?: string) {
    if (typeof window === 'undefined') return;

    this.stopAllAudio();

    const audioKey = `${scriptId}_${lang}`;

    // Check if this specific MP3 is blacklisted (known to be corrupted)
    if (CORRUPTED_MP3_BLACKLIST.has(audioKey) && fallbackText) {
      if (DEV_VOICE_LOG) {
        console.log(`[Voice] Blacklisted MP3 detected (${audioKey}) - using browser TTS: "${fallbackText.substring(0, 60)}..."`);
      }
      const langCode = this.getSpeechLangCode(lang);
      this.speakInstant(fallbackText, langCode);
      return;
    }

    const audioPath = `/voice/${scriptId}_${lang}.mp3`;

    // Create new AbortController for this playback
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    if (DEV_VOICE_LOG) {
      console.log(`[Voice] Playing: ${scriptId} (${lang}) - "${fallbackText?.substring(0, 60)}..."`);
    }

    try {
      // Try to load and play pre-generated MP3
      const audio = new Audio(audioPath);
      this.currentAudio = audio;

      // Abort listener
      signal.addEventListener('abort', () => {
        if (DEV_VOICE_LOG) {
          console.log(`[Voice] Cancelled: ${scriptId} (${lang})`);
        }
        audio.pause();
        audio.src = '';
      });

      await new Promise((resolve, reject) => {
        if (signal.aborted) {
          reject(new Error('Aborted'));
          return;
        }

        audio.oncanplay = () => {
          if (signal.aborted) {
            reject(new Error('Aborted'));
            return;
          }
          audio.play()
            .then(resolve)
            .catch(reject);
        };
        audio.onerror = () => {
          reject(new Error(`Failed to load audio: ${audioPath}`));
        };
      });

    } catch (error) {
      if (signal.aborted) {
        // Expected abort, don't fallback to TTS
        return;
      }

      console.warn(`[Voice] Pre-generated audio not found: ${audioPath}`);

      // Fallback to browser TTS if MP3 not available
      if (fallbackText) {
        // Use provided fallbackText (should be in correct language)
        const langCode = this.getSpeechLangCode(lang);
        this.speakInstant(fallbackText, langCode);
      } else {
        // If no fallbackText provided, use language-specific "missing audio" message
        const missingMessage = MISSING_VOICE_FALLBACK[lang] || MISSING_VOICE_FALLBACK['en'];
        const langCode = this.getSpeechLangCode(lang);
        console.warn(`[Voice] No fallbackText provided for ${scriptId}, using missing audio message in ${lang}`);
        this.speakInstant(missingMessage, langCode);
      }
    }
  }

  /**
   * Convert lang code to speech synthesis lang code
   */
  private getSpeechLangCode(lang: string): string {
    const map: Record<string, string> = {
      en: 'en-GB',
      fr: 'fr-FR',
      de: 'de-DE',
      es: 'es-ES',
      it: 'it-IT',
      pt: 'pt-PT'
    };
    return map[lang] || 'en-GB';
  }

  /**
   * Decodes raw PCM data (Int16) from Gemini TTS into AudioBuffer.
   */
  private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        // Normalize 16-bit integer to float range [-1, 1]
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  /**
   * Play PCM audio with strict queue management.
   */
  public async playPcm(base64Data: string) {
    this.stopAllAudio(); // Stop any currently playing audio

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    // Manual base64 decode to bytes
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const audioBuffer = await this.decodeAudioData(bytes, this.audioContext, 24000, 1);
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    this.currentSource = source;
    // Schedule play
    const startTime = Math.max(this.nextStartTime, this.audioContext.currentTime);
    source.start(startTime);
    this.nextStartTime = startTime + audioBuffer.duration;

    return new Promise((resolve) => {
      source.onended = () => {
        if (this.currentSource === source) {
          this.currentSource = null;
        }
        resolve(true);
      };
    });
  }

  /**
   * Force stop all current audio outputs.
   * Immediately stops playback and aborts any pending loads.
   */
  public stopAllAudio() {
    if (DEV_VOICE_LOG && (this.currentAudio || this.abortController || this.currentSource)) {
      console.log('[Voice] stopAllAudio() called');
    }

    // Stop browser TTS
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Abort pending MP3 load/playback
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    // Stop current HTML5 audio
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.src = '';
      } catch (e) { }
      this.currentAudio = null;
    }

    // Stop PCM audio buffer
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) { }
      this.currentSource = null;
    }

    if (this.audioContext) {
      this.nextStartTime = 0;
    }
  }
}

export const voiceService = new VoiceService();
