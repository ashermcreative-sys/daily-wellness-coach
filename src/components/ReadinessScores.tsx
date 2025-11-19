import { Card, CardContent } from "@/components/ui/card";

interface ReadinessScoresProps {
  mindReadiness?: number;
  bodyReadiness?: number;
  overallReadiness?: number;
}

const ScoreCard = ({ label, score, color }: { label: string; score: number; color: string }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-secondary";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-accent";
    return "text-destructive";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "from-secondary/20 to-secondary/5";
    if (score >= 60) return "from-primary/20 to-primary/5";
    if (score >= 40) return "from-accent/20 to-accent/5";
    return "from-destructive/20 to-destructive/5";
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${getScoreBackground(score)}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {Math.round(score)}
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${color} transition-all duration-500`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ReadinessScores = ({ 
  mindReadiness = 0, 
  bodyReadiness = 0, 
  overallReadiness = 0 
}: ReadinessScoresProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Today's Readiness</h2>
        <p className="text-muted-foreground">Your daily wellness snapshot</p>
      </div>
      
      <Card className="overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-3">
            <p className="text-lg font-semibold text-muted-foreground">Overall Readiness</p>
            <div className="relative">
              <div className="text-7xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                {Math.round(overallReadiness)}
              </div>
            </div>
            <div className="w-full max-w-xs bg-muted h-3 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
                style={{ width: `${overallReadiness}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreCard label="Mind Readiness" score={mindReadiness} color="bg-primary" />
        <ScoreCard label="Body Readiness" score={bodyReadiness} color="bg-secondary" />
      </div>
    </div>
  );
};