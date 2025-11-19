import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useHealthData = (userId: string | undefined) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [todaySummary, setTodaySummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Fetch today's entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today);

      if (entriesError) throw entriesError;
      setEntries(entriesData || []);

      // Fetch today's summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('daily_summaries')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle();

      if (summaryError) throw summaryError;
      setTodaySummary(summaryData);
    } catch (error) {
      console.error('Error fetching health data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const getEntryByTimeSlot = (timeSlot: string) => {
    return entries.find(e => e.time_slot === timeSlot);
  };

  const saveEntry = async (timeSlot: string, formData: any) => {
    if (!userId) {
      toast.error('Please sign in to save entries');
      return;
    }

    const entryData = {
      user_id: userId,
      date: today,
      time_slot: timeSlot,
      ...formData
    };

    const existingEntry = getEntryByTimeSlot(timeSlot);

    try {
      if (existingEntry) {
        const { error } = await supabase
          .from('entries')
          .update(entryData)
          .eq('id', existingEntry.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('entries')
          .insert(entryData);

        if (error) throw error;
      }

      await fetchData();

      // If this is a night entry, trigger AI analysis
      if (timeSlot === 'night') {
        await triggerAIAnalysis();
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      throw error;
    }
  };

  const triggerAIAnalysis = async () => {
    if (!userId) return;

    try {
      // Get all three entries for today
      const morningEntry = getEntryByTimeSlot('morning');
      const middayEntry = getEntryByTimeSlot('midday');
      const nightEntry = getEntryByTimeSlot('night');

      // Get recent summaries for context
      const { data: recentSummaries } = await supabase
        .from('daily_summaries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(7);

      const payload = {
        today_entries: {
          morning: morningEntry || null,
          midday: middayEntry || null,
          night: nightEntry || null,
        },
        recent_daily_summaries: recentSummaries || []
      };

      const { data, error } = await supabase.functions.invoke('analyze-health', {
        body: payload
      });

      if (error) throw error;

      // Save the AI-generated summary
      const summaryData = {
        user_id: userId,
        date: today,
        mind_readiness: data.mind_readiness,
        body_readiness: data.body_readiness,
        overall_readiness: data.overall_readiness,
        summary_text: data.summary_text,
        what_went_well: data.what_went_well,
        concerns: data.concerns,
        suggested_actions: data.suggested_actions,
        ai_raw_json: JSON.stringify(data)
      };

      const { error: upsertError } = await supabase
        .from('daily_summaries')
        .upsert(summaryData, {
          onConflict: 'user_id,date'
        });

      if (upsertError) throw upsertError;

      await fetchData();
      toast.success('AI analysis complete!');
    } catch (error) {
      console.error('Error in AI analysis:', error);
      toast.error('Failed to generate AI insights');
    }
  };

  return {
    entries,
    todaySummary,
    loading,
    getEntryByTimeSlot,
    saveEntry,
    refetch: fetchData
  };
};