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
      this.mediaElementAudio = new Audio();
      this.mediaElementAudio.crossOrigin = 'anonymous';
    }
  }

  private initAudioContext(): void {
    if (this.audioContext) return;
    if (typeof window === 'undefined') return;

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)() as AudioContext;
      const gainNode = ctx.createGain();
      const analyser = ctx.createAnalyser();
      gainNode.connect(analyser);
      analyser.connect(ctx.destination);

      this.audioContext = ctx;
      this.gainNode = gainNode;
      this.analyser = analyser;

      if (this.mediaElementAudio) {
        try {
          this.mediaElementSource = ctx.createMediaElementSource(this.mediaElementAudio);
          this.mediaElementSource.connect(gainNode);
        } catch (error) {
          console.warn('[AudioEngine] createMediaElementAudioSource failed:', error);
        }
      }
    } catch (error) {
      console.warn('[AudioEngine] Failed to initialize AudioContext:', error);
    }
  }

  private async ensureContextRunning(): Promise<void> {
    if (!this.audioContext) return;
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('[AudioEngine] Failed to resume AudioContext:', error);
      }
    }
  }

  setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(clamped, this.audioContext.currentTime);
    } else if (this.mediaElementAudio) {
      this.mediaElementAudio.volume = clamped;
    }
  }

  getVolume(): number {
    return this.gainNode?.gain.value ?? this.mediaElementAudio?.volume ?? 1;
  }

  async playStream(url: string) {
    if (!this.mediaElementAudio) return;
    this.initAudioContext();
    await this.ensureContextRunning();
    try {
      this.mediaElementAudio.src = url;
      this.mediaElementAudio.playbackRate = this.playbackSpeed;
      await this.mediaElementAudio.play();
      this.setupMediaSession();
    } catch (error) {
      console.error('[AudioEngine] Playback error:', error);
    }
  }

  pause() {
    this.mediaElementAudio?.pause();
  }

  resume() {
    this.ensureContextRunning().then(() => {
      this.mediaElementAudio?.play();
    });
  }

  stop() {
    if (this.mediaElementAudio) {
      this.mediaElementAudio.pause();
      this.mediaElementAudio.currentTime = 0;
    }
  }

  seek(time: number) {
    if (this.mediaElementAudio) {
      this.mediaElementAudio.currentTime = time;
    }
  }

  getCurrentTime(): number {
    return this.mediaElementAudio?.currentTime || 0;
  }

  getDuration(): number {
    return this.mediaElementAudio?.duration || 0;
  }

  setPlaybackSpeed(speed: number) {
    this.playbackSpeed = Math.max(0.5, Math.min(2, speed));
    if (this.mediaElementAudio) {
      this.mediaElementAudio.playbackRate = this.playbackSpeed;
    }
  }

  getPlaybackSpeed(): number {
    return this.playbackSpeed;
  }

  async crossfadeToTrack(newUrl: string, duration: number = 2) {
    if (!this.mediaElementAudio) return;
    this.initAudioContext();
    await this.ensureContextRunning();

    const ctx = this.audioContext;
    const gainNode = this.gainNode;
    if (!ctx || !gainNode) {
      await this.playStream(newUrl);
      return;
    }

    try {
      this.isCrossfading = true;
      const nextAudio = new Audio();
      nextAudio.crossOrigin = 'anonymous';
      nextAudio.src = newUrl;
      const nextSource = ctx.createMediaElementSource(nextAudio);

      if (!this.crossfadeGainNode) {
        this.crossfadeGainNode = ctx.createGain();
        this.crossfadeGainNode.connect(gainNode);
      }
      nextSource.connect(this.crossfadeGainNode);

      if (this.mediaElementSource) {
        const currentGain = ctx.createGain();
        currentGain.connect(gainNode);
        this.mediaElementSource.disconnect();
        this.mediaElementSource.connect(currentGain);
        currentGain.gain.setValueAtTime(1, ctx.currentTime);
        currentGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      }

      this.crossfadeGainNode.gain.setValueAtTime(0, ctx.currentTime);
      this.crossfadeGainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + duration);
      await nextAudio.play();

      setTimeout(() => {
        this.mediaElementAudio = nextAudio;
        this.mediaElementSource = nextSource;
        this.isCrossfading = false;
      }, duration * 1000);
    } catch (error) {
      console.error('[AudioEngine] Crossfade error:', error);
      this.isCrossfading = false;
    }
  }

  queueNextTrack(url: string) {
    if (!this.mediaElementAudio) return;
    this.mediaElementAudio.addEventListener('ended', () => this.playStream(url), { once: true });
  }

  prefetchTrack(url: string) {
    const preloadAudio = new Audio();
    preloadAudio.src = url;
    preloadAudio.load();
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  getWaveformData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  setupMediaSession(track?: Track) {
    if (!('mediaSession' in navigator)) return;
    if (track) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [
          { src: track.coverUrl || '/default-album-art.png', sizes: '96x96', type: 'image/png' },
          { src: track.coverUrl || '/default-album-art.png', sizes: '128x128', type: 'image/png' },
          { src: track.coverUrl || '/default-album-art.png', sizes: '192x192', type: 'image/png' },
          { src: track.coverUrl || '/default-album-art.png', sizes: '256x256', type: 'image/png' },
        ],
      });
    }
    navigator.mediaSession.setActionHandler('play', () => this.resume());
    navigator.mediaSession.setActionHandler('pause', () => this.pause());
    navigator.mediaSession.setActionHandler('stop', () => this.stop());
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      window.dispatchEvent(new CustomEvent('media-previous'));
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      window.dispatchEvent(new CustomEvent('media-next'));
    });
    navigator.mediaSession.setActionHandler('seekto', (event: any) => {
      if (event.seekTime) this.seek(event.seekTime);
    });
  }

  getAudioContext(): AudioContext | null { return this.audioContext; }
  getAnalyser(): AnalyserNode | null { return this.analyser; }
  isPlaying(): boolean { return this.mediaElementAudio ? !this.mediaElementAudio.paused : false; }
  getAudioElement(): HTMLAudioElement | null { return this.mediaElementAudio; }

  destroy() {
    this.stop();
    this.audioContext?.close();
    this.audioContext = null;
    this.gainNode = null;
    this.analyser = null;
    this.mediaElementSource = null;
  }
}

let audioEngineInstance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (!audioEngineInstance) {
    audioEngineInstance = new AudioEngine();
  }
  return audioEngineInstance;
}