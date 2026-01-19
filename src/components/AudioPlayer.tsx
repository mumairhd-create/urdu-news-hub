import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/hooks/useLanguage";

interface Podcast {
  id: string;
  title: { ur: string; en: string };
  description: { ur: string; en: string };
  audioUrl: string;
  duration: string;
  durationInSeconds: number;
  date: string;
  category: string;
  speaker?: string;
  imageUrl?: string;
}

interface AudioPlayerProps {
  podcast: Podcast;
  autoPlay?: boolean;
  showControls?: boolean;
  variant?: "full" | "compact" | "minimal";
}

const AudioPlayer = ({ 
  podcast, 
  autoPlay = false, 
  showControls = true,
  variant = "full" 
}: AudioPlayerProps) => {
  const { t, language, isRTL } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(podcast.durationInSeconds);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || podcast.durationInSeconds);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    if (autoPlay) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [autoPlay, podcast.durationInSeconds]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const changePlaybackRate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const downloadPodcast = async () => {
    try {
      const response = await fetch(podcast.audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `podcast-${podcast.id}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const sharePodcast = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: podcast.title[language],
          text: podcast.description[language],
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
        <audio ref={audioRef} src={podcast.audioUrl} />
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          className="p-2"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="flex-1">
          <h4 className="text-sm font-medium line-clamp-1">
            {podcast.title[language]}
          </h4>
          <p className="text-xs text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
        {podcast.imageUrl && (
          <img
            src={podcast.imageUrl}
            alt={podcast.title[language]}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        
        <div className="flex-1">
          <h4 className="font-medium line-clamp-1">
            {podcast.title[language]}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {podcast.description[language]}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{playbackRate}x</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="p-2"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadPodcast}
            className="p-2"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
        
        <audio ref={audioRef} src={podcast.audioUrl} />
      </div>
    );
  }

  // Full variant
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <audio ref={audioRef} src={podcast.audioUrl} />
      
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {podcast.imageUrl && (
          <img
            src={podcast.imageUrl}
            alt={podcast.title[language]}
            className="w-24 h-24 rounded-lg object-cover"
          />
        )}
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">
            {podcast.title[language]}
          </h3>
          <p className="text-muted-foreground mb-2">
            {podcast.description[language]}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {podcast.speaker && (
              <span>{t("speaker") || "Speaker"}: {podcast.speaker}</span>
            )}
            <span>{new Date(podcast.date).toLocaleDateString(language === "ur" ? "ur-PK" : "en-US")}</span>
            <span>{t("duration") || "Duration"}: {podcast.duration}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadPodcast}
            className="p-2"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={sharePodcast}
            className="p-2"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showControls && (
        <>
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="p-2"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              {/* Skip Backward */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(-15)}
                className="p-2"
              >
                <SkipBack className="h-4 w-4" />
                <span className="text-xs ml-1">15s</span>
              </Button>
              
              {/* Skip Forward */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(15)}
                className="p-2"
              >
                <SkipForward className="h-4 w-4" />
                <span className="text-xs ml-1">15s</span>
              </Button>
              
              {/* Playback Speed */}
              <Button
                variant="ghost"
                size="sm"
                onClick={changePlaybackRate}
                className="px-3 py-2 text-xs"
              >
                {playbackRate}x
              </Button>
            </div>
            
            {/* Volume */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="p-2"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;
