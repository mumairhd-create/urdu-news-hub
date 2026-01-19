import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import LazyImage from "@/components/LazyImage";

interface Photo {
  id: string;
  url: string;
  caption: { ur: string; en: string };
  credit?: string;
  date?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  title?: string;
  variant?: "grid" | "slider" | "masonry";
  autoPlay?: boolean;
  interval?: number;
}

const PhotoGallery = ({ 
  photos, 
  title, 
  variant = "grid", 
  autoPlay = false,
  interval = 3000 
}: PhotoGalleryProps) => {
  const { t, language, isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToPhoto = (index: number) => {
    setCurrentIndex(index);
  };

  const downloadPhoto = async (photo: Photo) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `photo-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft;
  const ChevronIconReverse = isRTL ? ChevronLeft : ChevronRight;

  if (variant === "slider") {
    return (
      <div className="relative">
        {title && (
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
        )}
        
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {/* Main Image */}
          <LazyImage
            src={photos[currentIndex].url}
            alt={photos[currentIndex].caption[language]}
            className="w-full h-full object-contain"
          />
          
          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              >
                <ChevronIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              >
                <ChevronIconReverse className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {/* Image Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h4 className="text-white font-medium mb-1">
              {photos[currentIndex].caption[language]}
            </h4>
            {photos[currentIndex].credit && (
              <p className="text-white/70 text-sm">
                {t("photoCredit") || "Credit"}: {photos[currentIndex].credit}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadPhoto(photos[currentIndex])}
              className="bg-black/50 hover:bg-black/70 text-white"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 text-white"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
                <div className="relative w-full h-full">
                  <LazyImage
                    src={photos[currentIndex].url}
                    alt={photos[currentIndex].caption[language]}
                    className="w-full h-full object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Thumbnail Navigation */}
        {photos.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => goToPhoto(index)}
                className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-primary scale-105' 
                    : 'border-transparent hover:border-primary/50'
                }`}
              >
                <LazyImage
                  src={photo.url}
                  alt={photo.caption[language]}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === "masonry") {
    return (
      <div className="space-y-4">
        {title && (
          <h3 className="text-lg font-semibold">{title}</h3>
        )}
        
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="break-inside-avoid group relative overflow-hidden rounded-lg border border-border hover:shadow-lg transition-all duration-300"
            >
              <LazyImage
                src={photo.url}
                alt={photo.caption[language]}
                className="w-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm line-clamp-2">
                    {photo.caption[language]}
                  </p>
                  {photo.credit && (
                    <p className="text-white/70 text-xs">
                      {t("photoCredit") || "Credit"}: {photo.credit}
                    </p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadPhoto(photo)}
                    className="bg-black/50 hover:bg-black/70 text-white p-1 h-8 w-8"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-black/50 hover:bg-black/70 text-white p-1 h-8 w-8"
                      >
                        <Maximize2 className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
                      <div className="relative w-full h-full">
                        <LazyImage
                          src={photo.url}
                          alt={photo.caption[language]}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default Grid Variant
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold">{title}</h3>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border hover:shadow-lg transition-all duration-300"
          >
            <LazyImage
              src={photo.url}
              alt={photo.caption[language]}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm line-clamp-2">
                  {photo.caption[language]}
                </p>
                {photo.credit && (
                  <p className="text-white/70 text-xs">
                    {t("photoCredit") || "Credit"}: {photo.credit}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadPhoto(photo)}
                  className="bg-black/50 hover:bg-black/70 text-white p-1 h-8 w-8"
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-black/50 hover:bg-black/70 text-white p-1 h-8 w-8"
                    >
                      <Maximize2 className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
                    <div className="relative w-full h-full">
                      <LazyImage
                        src={photo.url}
                        alt={photo.caption[language]}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
