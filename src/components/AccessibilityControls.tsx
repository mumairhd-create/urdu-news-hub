import { useState, useEffect } from "react";
import { Minus, Plus, RotateCcw, Eye, Type, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";

interface AccessibilityControlsProps {
  className?: string;
}

const AccessibilityControls = ({ className = "" }: AccessibilityControlsProps) => {
  const { t, language, isRTL } = useLanguage();
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [readingMode, setReadingMode] = useState(false);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedHighContrast = localStorage.getItem('highContrast');
    const savedReadingMode = localStorage.getItem('readingMode');

    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
      document.documentElement.style.fontSize = `${savedFontSize}px`;
    }

    if (savedHighContrast) {
      setHighContrast(savedHighContrast === 'true');
      if (savedHighContrast === 'true') {
        document.documentElement.classList.add('high-contrast');
      }
    }

    if (savedReadingMode) {
      setReadingMode(savedReadingMode === 'true');
      if (savedReadingMode === 'true') {
        document.documentElement.classList.add('reading-mode');
      }
    }
  }, []);

  // Font size controls
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem('fontSize', newSize.toString());
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem('fontSize', newSize.toString());
  };

  const resetFontSize = () => {
    setFontSize(16);
    document.documentElement.style.fontSize = '16px';
    localStorage.setItem('fontSize', '16');
  };

  // High contrast toggle
  const toggleHighContrast = () => {
    const newHighContrast = !highContrast;
    setHighContrast(newHighContrast);
    
    if (newHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    localStorage.setItem('highContrast', newHighContrast.toString());
  };

  // Reading mode toggle
  const toggleReadingMode = () => {
    const newReadingMode = !readingMode;
    setReadingMode(newReadingMode);
    
    if (newReadingMode) {
      document.documentElement.classList.add('reading-mode');
    } else {
      document.documentElement.classList.remove('reading-mode');
    }
    
    localStorage.setItem('readingMode', newReadingMode.toString());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`p-2 ${className}`}
          title={t("accessibility") || "Accessibility"}
        >
          <Type className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        {/* Font Size Controls */}
        <div className="px-2 py-1.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {t("fontSize") || "Font Size"}
            </span>
            <span className="text-xs text-muted-foreground">
              {fontSize}px
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={decreaseFontSize}
              disabled={fontSize <= 12}
              className="p-1 h-8 w-8"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetFontSize}
              className="p-1 h-8 px-2 text-xs"
            >
              {t("reset") || "Reset"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={increaseFontSize}
              disabled={fontSize >= 24}
              className="p-1 h-8 w-8"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* High Contrast */}
        <DropdownMenuItem onClick={toggleHighContrast} className="cursor-pointer">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="text-sm">
              {t("highContrast") || "High Contrast"}
            </span>
            <div className="ml-auto">
              <div className={`w-4 h-4 rounded border-2 ${highContrast ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                {highContrast && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuItem>
        
        {/* Reading Mode */}
        <DropdownMenuItem onClick={toggleReadingMode} className="cursor-pointer">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">
              {t("readingMode") || "Reading Mode"}
            </span>
            <div className="ml-auto">
              <div className={`w-4 h-4 rounded border-2 ${readingMode ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                {readingMode && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Quick Actions */}
        <DropdownMenuItem 
          onClick={() => {
            resetFontSize();
            setHighContrast(false);
            setReadingMode(false);
            document.documentElement.classList.remove('high-contrast', 'reading-mode');
            localStorage.removeItem('fontSize');
            localStorage.removeItem('highContrast');
            localStorage.removeItem('readingMode');
          }}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">
              {t("resetAll") || "Reset All Settings"}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccessibilityControls;
