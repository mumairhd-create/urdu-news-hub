import { useState, useEffect, useMemo } from "react";
import { TrendingUp, Hash, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";

interface TrendingTopic {
  id: string;
  name: string;
  count: number;
  category: string;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

const TrendingTopics = () => {
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [timeRange, setTimeRange] = useState<"hour" | "day" | "week">("day");

  // Mock trending topics data
  const mockTopics: TrendingTopic[] = useMemo(() => [
    {
      id: "1",
      name: language === "ur" ? "ٹیکنالوجی انقلاب" : "Technology Revolution",
      count: 15420,
      category: "technology",
      trend: "up",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "2",
      name: language === "ur" ? "قومی بجٹ 2024" : "National Budget 2024",
      count: 12350,
      category: "politics",
      trend: "up",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "3",
      name: language === "ur" ? "پاکستان کرکٹ ٹیم" : "Pakistan Cricket Team",
      count: 10890,
      category: "sports",
      trend: "stable",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "4",
      name: language === "ur" ? "صحت پالیسی" : "Health Policy",
      count: 8760,
      category: "health",
      trend: "up",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "5",
      name: language === "ur" ? "اسٹاک مارکیٹ" : "Stock Market",
      count: 7230,
      category: "business",
      trend: "down",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "6",
      name: language === "ur" ? "نیئی فلمیں" : "New Movies",
      count: 6540,
      category: "entertainment",
      trend: "up",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "7",
      name: language === "ur" ? "آرٹیفیشل انٹیلیجنس" : "Artificial Intelligence",
      count: 5890,
      category: "technology",
      trend: "up",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "8",
      name: language === "ur" ? "ہاکی ورلڈ کپ" : "Hockey World Cup",
      count: 4320,
      category: "sports",
      trend: "stable",
      lastUpdated: new Date().toISOString()
    }
  ], [language]);

  useEffect(() => {
    // Simulate API call to get trending topics
    setTopics(mockTopics);
  }, [language, mockTopics]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handleTopicClick = (topic: TrendingTopic) => {
    navigate(`/search?q=${encodeURIComponent(topic.name)}`);
  };

  const timeRanges = [
    { value: "hour", label: language === "ur" ? "ایک گھنٹہ" : "1 Hour" },
    { value: "day", label: language === "ur" ? "ایک دن" : "1 Day" },
    { value: "week", label: language === "ur" ? "ایک ہفتہ" : "1 Week" }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          {t("trendingTopics") || "Trending Topics"}
        </h3>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(range.value as "hour" | "day" | "week")}
              className="text-xs h-6 px-2"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {topics.slice(0, 6).map((topic, index) => (
          <div
            key={topic.id}
            className="flex items-center justify-between p-2 hover:bg-secondary rounded cursor-pointer transition-colors group"
            onClick={() => handleTopicClick(topic)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-sm text-foreground truncate">
                    {topic.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {t(topic.category) || topic.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {getTrendIcon(topic.trend)}
                    <span>{formatCount(topic.count)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              <Clock className="h-3 w-3" />
              <span>{timeRange}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate("/trending")}
        >
          {t("viewAllTrending") || "View All Trending"}
        </Button>
      </div>
    </div>
  );
};

export default TrendingTopics;
