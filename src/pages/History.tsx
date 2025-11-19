import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Brain, Activity } from "lucide-react";
import { format } from "date-fns";

const History = () => {
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState<any>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('daily_summaries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setSummaries(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBulletPoints = (text?: string) => {
    if (!text) return [];
    return text
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-wellness-calm to-background">
      <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              History
            </h1>
            <p className="text-muted-foreground mt-1">Review your past wellness insights</p>
          </div>
        </div>

        {summaries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No history yet. Complete your first day to see insights here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Journey</h2>
              {summaries.map((summary) => (
                <Card 
                  key={summary.id}
                  className="cursor-pointer transition-all hover:shadow-lg"
                  onClick={() => setSelectedSummary(summary)}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{format(new Date(summary.date), 'MMMM d, yyyy')}</span>
                      <span className="text-2xl font-bold text-primary">
                        {Math.round(summary.overall_readiness)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="text-sm">{Math.round(summary.mind_readiness)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-secondary" />
                        <span className="text-sm">{Math.round(summary.body_readiness)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedSummary && (
              <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
                <Card>
                  <CardHeader>
                    <CardTitle>{format(new Date(selectedSummary.date), 'MMMM d, yyyy')}</CardTitle>
                    <CardDescription>Daily Summary</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {Math.round(selectedSummary.overall_readiness)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Overall</div>
                      </div>
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {Math.round(selectedSummary.mind_readiness)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Mind</div>
                      </div>
                      <div className="text-center p-4 bg-secondary/10 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">
                          {Math.round(selectedSummary.body_readiness)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Body</div>
                      </div>
                    </div>

                    {selectedSummary.summary_text && (
                      <div>
                        <h4 className="font-semibold mb-2">Summary</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {selectedSummary.summary_text}
                        </p>
                      </div>
                    )}

                    {selectedSummary.what_went_well && (
                      <div>
                        <h4 className="font-semibold mb-2 text-secondary">What Went Well</h4>
                        <ul className="space-y-1">
                          {formatBulletPoints(selectedSummary.what_went_well).map((point, i) => (
                            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                              <span className="text-secondary">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedSummary.concerns && (
                      <div>
                        <h4 className="font-semibold mb-2 text-accent">Concerns</h4>
                        <ul className="space-y-1">
                          {formatBulletPoints(selectedSummary.concerns).map((point, i) => (
                            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                              <span className="text-accent">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedSummary.suggested_actions && (
                      <div>
                        <h4 className="font-semibold mb-2 text-primary">Suggested Actions</h4>
                        <ul className="space-y-1">
                          {formatBulletPoints(selectedSummary.suggested_actions).map((point, i) => (
                            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                              <span className="text-primary">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;