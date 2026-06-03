import { useEffect, useRef, useState, useCallback } from 'react'
import type { Track } from '@/lib/types'

interface UseAudioPlayerOptions {
  onEnded?: () => void
  onTimeUpdate?: (time: number) => void
  onLoadedMetadata?: (duration: number) => void
  onError?: (error: Error) => void
}

export const useAudioPlayer = (options: UseAudioPlayerOptions = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsReady(true)
      options.onLoadedMetadata?.(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      options.onTimeUpdate?.(audio.currentTime)
    }

    const handleEnded = () => {
      options.onEnded?.()
    }

    const handleError = () => {
      options.onError?.(new Error('Audio playback error'))
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [options])

  const play = useCallback((src: string) => {
    if (!audioRef.current) return
    audioRef.current.src = src
    audioRef.current.play().catch(err => console.error('Playback error:', err))
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const resume = useCallback(() => {
    audioRef.current?.play().catch(err => console.error('Resume error:', err))
  }, [])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration))
    }
  }, [duration])

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume))
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  return {
    audioRef,
    isReady,
    duration,
    currentTime,
    play,
    pause,
    resume,
    seek,
    setVolume,
    stop,
  }
}
