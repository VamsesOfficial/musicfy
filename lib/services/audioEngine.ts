import { Track } from '@/lib/types';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private mediaElementAudio: HTMLAudioElement | null = null;
  private mediaElementSource: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isCrossfading = false;
  private crossfadeGainNode: GainNode | null = null;
  private nextSource: AudioBufferSourceNode | null = null;
  private playbackSpeed = 1;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.analyser = this.audioContext.createAnalyser();
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        // Setup media element for streaming
        this.mediaElementAudio = new Audio();
        if (this.audioContext && this.mediaElementAudio) {
          try {
            this.mediaElementSource = this.audioContext.createMediaElementSource(this.mediaElementAudio);
            if (this.mediaElementSource && this.gainNode) {
              this.mediaElementSource.connect(this.gainNode);
            }
          } catch (error) {
            console.warn('Failed to create media element source:', error);
            // Fallback: audio will play but without Web Audio API processing
          }
        }
      } catch (error) {
        console.warn('Failed to initialize AudioEngine:', error);
        // Fallback: create simple audio element
        this.mediaElementAudio = new Audio();
      }
    }
  }

  // Set volume (0 to 1)
  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.audioContext?.currentTime || 0
      );
    }
  }

  // Get current volume
  getVolume(): number {
    return this.gainNode?.gain.value || 1;
  }

  // Play audio from URL (streaming)
  async playStream(url: string) {
    if (!this.mediaElementAudio) return;
    
    try {
      this.mediaElementAudio.src = url;
      await this.mediaElementAudio.play();
      this.setupMediaSession();
    } catch (error) {
      console.error('Playback error:', error);
    }
  }

  // Pause playback
  pause() {
    if (this.mediaElementAudio) {
      this.mediaElementAudio.pause();
    }
  }

  // Resume playback
  resume() {
    if (this.mediaElementAudio) {
      this.mediaElementAudio.play();
    }
  }

  // Stop playback
  stop() {
    if (this.mediaElementAudio) {
      this.mediaElementAudio.pause();
      this.mediaElementAudio.currentTime = 0;
    }
  }

  // Set playback position
  seek(time: number) {
    if (this.mediaElementAudio) {
      this.mediaElementAudio.currentTime = time;
    }
  }

  // Get current playback position
  getCurrentTime(): number {
    return this.mediaElementAudio?.currentTime || 0;
  }

  // Get total duration
  getDuration(): number {
    return this.mediaElementAudio?.duration || 0;
  }

  // Set playback speed
  setPlaybackSpeed(speed: number) {
    this.playbackSpeed = Math.max(0.5, Math.min(2, speed));
    if (this.mediaElementAudio) {
      this.mediaElementAudio.playbackRate = this.playbackSpeed;
    }
  }

  // Get playback speed
  getPlaybackSpeed(): number {
    return this.playbackSpeed;
  }

  // Crossfade between tracks (smooth transition)
  async crossfadeToTrack(newUrl: string, duration: number = 2) {
    if (!this.audioContext || !this.mediaElementAudio) return;

    try {
      this.isCrossfading = true;

      // Create a new audio element for the next track
      const nextAudio = new Audio();
      nextAudio.src = newUrl;
      const nextSource = this.audioContext.createMediaElementSource(nextAudio);
      
      if (!this.crossfadeGainNode) {
        this.crossfadeGainNode = this.audioContext.createGain();
        this.crossfadeGainNode.connect(this.gainNode!);
      }

      nextSource.connect(this.crossfadeGainNode);

      // Fade out current track
      if (this.mediaElementSource) {
        const currentGain = this.audioContext.createGain();
        currentGain.connect(this.gainNode!);
        this.mediaElementSource.disconnect();
        this.mediaElementSource.connect(currentGain);

        currentGain.gain.setValueAtTime(1, this.audioContext.currentTime);
        currentGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
      }

      // Fade in next track
      this.crossfadeGainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.crossfadeGainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + duration);

      // Start playing next track
      await nextAudio.play();

      // After crossfade, switch to next audio as primary
      setTimeout(() => {
        this.mediaElementAudio = nextAudio;
        this.mediaElementSource = nextSource;
        this.isCrossfading = false;
      }, duration * 1000);
    } catch (error) {
      console.error('Crossfade error:', error);
      this.isCrossfading = false;
    }
  }

  // Gapless playback - queue next track
  queueNextTrack(url: string) {
    if (!this.mediaElementAudio) return;
    
    // Use HTML5 audio queue capability
    this.mediaElementAudio.addEventListener('ended', () => {
      this.playStream(url);
    }, { once: true });
  }

  // Prefetch next track for smooth playback
  prefetchTrack(url: string) {
    const preloadAudio = new Audio();
    preloadAudio.src = url;
    preloadAudio.load();
  }

  // Get audio frequency data for visualizers
  getFrequencyData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  // Get time domain data for waveform visualizers
  getWaveformData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  // Setup Media Session API for native controls
  setupMediaSession(track?: Track) {
    if (!('mediaSession' in navigator)) return;

    if (track) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [
          {
            src: track.coverUrl || '/default-album-art.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: track.coverUrl || '/default-album-art.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: track.coverUrl || '/default-album-art.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: track.coverUrl || '/default-album-art.png',
            sizes: '256x256',
            type: 'image/png',
          },
        ],
      });
    }

    // Handle media session action handlers
    navigator.mediaSession.setActionHandler('play', () => this.resume());
    navigator.mediaSession.setActionHandler('pause', () => this.pause());
    navigator.mediaSession.setActionHandler('stop', () => this.stop());
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      // Handled by player component
      window.dispatchEvent(new CustomEvent('media-previous'));
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      // Handled by player component
      window.dispatchEvent(new CustomEvent('media-next'));
    });
    navigator.mediaSession.setActionHandler('seekto', (event: any) => {
      if (event.seekTime) {
        this.seek(event.seekTime);
      }
    });
  }

  // Get audio context for advanced manipulation
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  // Get analyser node for frequency analysis
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  // Check if audio is currently playing
  isPlaying(): boolean {
    return this.mediaElementAudio ? !this.mediaElementAudio.paused : false;
  }

  // Get audio element for event listeners
  getAudioElement(): HTMLAudioElement | null {
    return this.mediaElementAudio;
  }

  // Clean up resources
  destroy() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Export singleton instance
let audioEngineInstance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (!audioEngineInstance) {
    audioEngineInstance = new AudioEngine();
  }
  return audioEngineInstance;
}
