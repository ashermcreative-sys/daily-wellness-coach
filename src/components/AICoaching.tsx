import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface AICoachingProps {
  summary?: {
    summary_text?: string;
    what_went_well?: string;
    concerns?: string;
    suggested_actions?: string;
  } | null;
}

export const AICoaching = ({ summary }: AICoachingProps) => {
  if (!summary) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Today's AI Coaching
          </CardTitle>
          <CardDescription>
            Complete your night check-in to see personalized insights here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Waiting for your evening reflection...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatBulletPoints = (text?: string) => {
    if (!text) return [];
    return text
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Today's AI Coaching
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {summary.summary_text && (
          <div>
            <h4 className="font-semibold mb-2 text-foreground">Summary</h4>
            <p className="text-muted-foreground leading-relaxed">{summary.summary_text}</p>
          </div>
        )}

        {summary.what_went_well && (
          <div>
            <h4 className="font-semibold mb-2 text-secondary">✨ What Went Well</h4>
            <ul className="space-y-2">
              {formatBulletPoints(summary.what_went_well).map((point, i) => (
                <li key={i} className="flex gap-2 text-muted-foreground">
                  <span className="text-secondary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.concerns && (
          <div>
            <h4 className="font-semibold mb-2 text-accent">⚠️ Areas to Watch</h4>
            <ul className="space-y-2">
              {formatBulletPoints(summary.concerns).map((point, i) => (
                <li key={i} className="flex gap-2 text-muted-foreground">
                  <span className="text-accent">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.suggested_actions && (
          <div>
            <h4 className="font-semibold mb-2 text-primary">💡 For Tomorrow</h4>
            <ul className="space-y-2">
              {formatBulletPoints(summary.suggested_actions).map((point, i) => (
                <li key={i} className="flex gap-2 text-muted-foreground">
                  <span className="text-primary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};