import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
  target: React.RefObject<HTMLElement>;
  className?: string;
}

export default function ReadingProgress({ target, className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (target.current) {
        const element = target.current;
        const scrollTop = window.scrollY;
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        const windowHeight = window.innerHeight;

        const distance = scrollTop - elementTop + windowHeight;
        const progressPercent = Math.min(
          Math.max((distance / elementHeight) * 100, 0),
          100
        );

        setProgress(progressPercent);
      }
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, [target]);

  return (
    <div className={cn("fixed top-0 left-0 w-full h-1 bg-gray-200 z-50", className)}>
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
