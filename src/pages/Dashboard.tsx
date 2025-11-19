import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ReadinessScores } from "@/components/ReadinessScores";
import { CheckInForm } from "@/components/CheckInForm";
import { AICoaching } from "@/components/AICoaching";
import { useHealthData } from "@/hooks/useHealthData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, History } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>();
  const [loading, setLoading] = useState(true);

  const { 
    entries, 
    todaySummary, 
    loading: dataLoading,
    getEntryByTimeSlot, 
    saveEntry 
  } = useHealthData(userId);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUserId(session.user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/auth');
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-wellness-calm to-background">
      <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Wellness Journal
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your daily health and get AI-powered insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/history')}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              History
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Readiness Scores */}
        <ReadinessScores
          mindReadiness={todaySummary?.mind_readiness}
          bodyReadiness={todaySummary?.body_readiness}
          overallReadiness={todaySummary?.overall_readiness}
        />

        {/* Check-in Forms */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Today's Check-ins</h3>
          <Tabs defaultValue="morning" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="morning">Morning</TabsTrigger>
              <TabsTrigger value="midday">Midday</TabsTrigger>
              <TabsTrigger value="night">Night</TabsTrigger>
            </TabsList>
            <TabsContent value="morning" className="mt-6">
              <CheckInForm
                timeSlot="morning"
                existingEntry={getEntryByTimeSlot('morning')}
                onSubmit={(data) => saveEntry('morning', data)}
              />
            </TabsContent>
            <TabsContent value="midday" className="mt-6">
              <CheckInForm
                timeSlot="midday"
                existingEntry={getEntryByTimeSlot('midday')}
                onSubmit={(data) => saveEntry('midday', data)}
              />
            </TabsContent>
            <TabsContent value="night" className="mt-6">
              <CheckInForm
                timeSlot="night"
                existingEntry={getEntryByTimeSlot('night')}
                onSubmit={(data) => saveEntry('night', data)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Coaching */}
        <AICoaching summary={todaySummary} />

        {/* Disclaimer */}
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>
            This app is for self-tracking and general wellbeing insights only. 
            It does not provide medical advice or diagnosis. 
            If you have concerns about your physical or mental health, 
            please consult a qualified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;