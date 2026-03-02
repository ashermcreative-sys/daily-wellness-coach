import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Supplement {
  id: string;
  user_id: string;
  name: string;
  dosage: string | null;
  time_of_day: string;
  is_active: boolean;
}

export interface SupplementLog {
  id: string;
  supplement_id: string;
  date: string;
  taken: boolean;
  taken_at: string | null;
}

export const useSupplements = (userId: string | undefined) => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [logs, setLogs] = useState<SupplementLog[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const [{ data: supps, error: sErr }, { data: logsData, error: lErr }] =
        await Promise.all([
          supabase
            .from("supplements")
            .select("*")
            .eq("user_id", userId)
            .eq("is_active", true)
            .order("time_of_day"),
          supabase
            .from("supplement_logs")
            .select("*")
            .eq("user_id", userId)
            .eq("date", today),
        ]);

      if (sErr) throw sErr;
      if (lErr) throw lErr;
      setSupplements((supps as Supplement[]) || []);
      setLogs((logsData as SupplementLog[]) || []);
    } catch (error) {
      console.error("Error fetching supplements:", error);
      toast.error("Failed to load supplements");
    } finally {
      setLoading(false);
    }
  }, [userId, today]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addSupplement = async (name: string, dosage: string, timeOfDay: string) => {
    if (!userId) return;
    const { error } = await supabase.from("supplements").insert({
      user_id: userId,
      name,
      dosage: dosage || null,
      time_of_day: timeOfDay,
    });
    if (error) throw error;
    await fetchData();
  };

  const removeSupplement = async (id: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from("supplements")
      .update({ is_active: false })
      .eq("id", id);
    if (error) throw error;
    await fetchData();
  };

  const toggleTaken = async (supplementId: string) => {
    if (!userId) return;
    const existing = logs.find((l) => l.supplement_id === supplementId);

    if (existing) {
      const newTaken = !existing.taken;
      const { error } = await supabase
        .from("supplement_logs")
        .update({
          taken: newTaken,
          taken_at: newTaken ? new Date().toISOString() : null,
        })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("supplement_logs").insert({
        user_id: userId,
        supplement_id: supplementId,
        date: today,
        taken: true,
        taken_at: new Date().toISOString(),
      });
      if (error) throw error;
    }
    await fetchData();
  };

  const isSupplementTaken = (supplementId: string) => {
    return logs.find((l) => l.supplement_id === supplementId)?.taken || false;
  };

  return {
    supplements,
    logs,
    loading,
    addSupplement,
    removeSupplement,
    toggleTaken,
    isSupplementTaken,
    refetch: fetchData,
  };
};
