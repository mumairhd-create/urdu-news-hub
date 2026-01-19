import { useState } from "react";
import { Play, Eye, Clock } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { useLanguage } from "@/hooks/useLanguage";
import LazyImage from "@/components/LazyImage";
import { getText, MultilingualText } from "@/types/multilingual";

interface Video {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: number;
  date: string;
  category: string;
}

interface VideoCardProps {
  video: Video;
  variant?: "default" | "compact" | "featured";
  autoPlay?: boolean;
}

const VideoCard = ({ video, variant = "default", autoPlay = false }: VideoCardProps) => {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  if (isPlaying) {
    return (
      <div className="relative">
        <VideoPlayer
          src={video.videoUrl}
          thumbnail={video.thumbnail}
          title={getText(video.title, language)}
          className="w-full aspect-video"
        />
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70"
        >
          {t("close") || "Close"}
        </button>
      </div>
    );
  }

  const baseClasses = "group cursor-pointer overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300";
  
  const variants = {
    default: "aspect-video",
    compact: "aspect-video max-w-sm",
    featured: "aspect-video col-span-2"
  };

  return (
    <div className={`${baseClasses} ${variants[variant]}`} onClick={handlePlay}>
      <div className="relative h-full">
        {/* Thumbnail */}
        <LazyImage
          src={video.thumbnail}
          alt={getText(video.title, language)}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
              {getText(video.title, language)}
            </h3>
            <p className="text-white/80 text-xs line-clamp-2">
              {getText(video.description, language)}
            </p>
          </div>
        </div>
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-primary/90 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-200">
            <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
          </div>
        </div>
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
        
        {/* Views & Date */}
        <div className="absolute top-2 left-2 flex items-center gap-3 text-white text-xs">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{video.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(video.date).toLocaleDateString(language === "ur" ? "ur-PK" : "en-US", { month: "short", day: "numeric" })}</span>
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-2 right-12 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
          {t(video.category) || video.category}
        </div>
      </div>
      
      {/* Video Info (for compact variant) */}
      {variant === "compact" && (
        <div className="p-3">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
            {getText(video.title, language)}
          </h3>
          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            <span>{video.views.toLocaleString()} views</span>
            <span>•</span>
            <span>{video.duration}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
