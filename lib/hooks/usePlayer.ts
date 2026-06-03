import { useEffect } from 'react';
import { usePlayerStore } from '@/lib/stores/playerStore';
import { getAudioEngine } from '@/lib/services/audioEngine';
import { Track } from '@/lib/types';

export function useAudioPlayer() {
  const audioEngine = getAudioEngine();

  const {
    currentTrack,
    isPlaying,
    volume,
    playbackSpeed,
    playTrack,
    togglePlayPause,
    setCurrentTime,
    setVolume,
    setPlaybackSpeed
  } = usePlayerStore();

  // Setup audio event listeners
  useEffect(() => {
    const audioElement = audioEngine.getAudioElement();
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      usePlayerStore.setState({
        currentTime: audioElement.currentTime
      });
    };

    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
      window.dispatchEvent(new CustomEvent('track-ended'));
    };

    const handleLoadedMetadata = () => {
      usePlayerStore.setState({
        duration: audioElement.duration
      });
    };

    const handlePlay = () => {
      usePlayerStore.setState({ isPlaying: true });
    };

    const handlePause = () => {
      usePlayerStore.setState({ isPlaying: false });
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
    };
  }, []);

  // Handle play/pause sync
  useEffect(() => {
    if (isPlaying && currentTrack?.youtube_video_id) {
      // For YouTube streams - would need embedded player or API
      audioEngine.resume();
    } else if (!isPlaying) {
      audioEngine.pause();
    }
  }, [isPlaying, currentTrack, audioEngine]);

  // Handle volume sync
  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume, audioEngine]);

  // Handle playback speed sync
  useEffect(() => {
    audioEngine.setPlaybackSpeed(playbackSpeed);
  }, [playbackSpeed, audioEngine]);

  // Setup Media Session API
  useEffect(() => {
    if (currentTrack) {
      audioEngine.setupMediaSession(currentTrack);
    }
  }, [currentTrack, audioEngine]);

  return {
    audioEngine,
    currentTrack,
    isPlaying,
    volume,
    playbackSpeed,
    playTrack,
    togglePlayPause,
    setCurrentTime,
    setVolume,
    setPlaybackSpeed
  };
}

export function usePlaybackControl() {
  const {
    isPlaying,
    repeatMode,
    isShuffle,
    queue,
    currentTrackIndex,
    togglePlayPause,
    toggleRepeat,
    toggleShuffle,
    nextTrack,
    previousTrack,
    setQueue
  } = usePlayerStore();

  const handleKeyboardControls = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement) return;

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowRight':
        nextTrack();
        break;
      case 'ArrowLeft':
        previousTrack();
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardControls);
    return () => window.removeEventListener('keydown', handleKeyboardControls);
  }, []);

  return {
    isPlaying,
    repeatMode,
    isShuffle,
    queue,
    currentTrackIndex,
    togglePlayPause,
    toggleRepeat,
    toggleShuffle,
    nextTrack,
    previousTrack,
    setQueue
  };
}

export function usePlaylistManagement() {
  const { setQueue, currentTrack } = usePlayerStore();

  const playPlaylist = (tracks: Track[]) => {
    if (tracks.length === 0) return;

    setQueue(tracks);
    usePlayerStore.setState({
      currentTrack: tracks[0],
      currentTrackIndex: 0,
      isPlaying: true
    });
  };

  const addToQueue = (tracks: Track[]) => {
    const { queue, currentTrackIndex } = usePlayerStore.getState();
    const nextIndex = currentTrackIndex + 1;
    const newQueue = [
      ...queue.slice(0, nextIndex),
      ...tracks,
      ...queue.slice(nextIndex)
    ];
    setQueue(newQueue);
  };

  const clearQueue = () => {
    setQueue([]);
    usePlayerStore.setState({
      currentTrack: null,
      currentTrackIndex: 0,
      isPlaying: false
    });
  };

  return {
    playPlaylist,
    addToQueue,
    clearQueue
  };
}
