export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      daily_summaries: {
        Row: {
          ai_raw_json: string | null
          body_readiness: number | null
          concerns: string | null
          created_at: string
          date: string
          id: string
          mind_readiness: number | null
          overall_readiness: number | null
          suggested_actions: string | null
          summary_text: string | null
          updated_at: string
          user_id: string
          what_went_well: string | null
        }
        Insert: {
          ai_raw_json?: string | null
          body_readiness?: number | null
          concerns?: string | null
          created_at?: string
          date: string
          id?: string
          mind_readiness?: number | null
          overall_readiness?: number | null
          suggested_actions?: string | null
          summary_text?: string | null
          updated_at?: string
          user_id: string
          what_went_well?: string | null
        }
        Update: {
          ai_raw_json?: string | null
          body_readiness?: number | null
          concerns?: string | null
          created_at?: string
          date?: string
          id?: string
          mind_readiness?: number | null
          overall_readiness?: number | null
          suggested_actions?: string | null
          summary_text?: string | null
          updated_at?: string
          user_id?: string
          what_went_well?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_summaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      entries: {
        Row: {
          alcohol: Database["public"]["Enums"]["alcohol_level"] | null
          caffeine: Database["public"]["Enums"]["consumption_level"] | null
          created_at: string
          date: string
          energy_score: number | null
          exercise_level: Database["public"]["Enums"]["exercise_level"] | null
          id: string
          mood_score: number | null
          notes: string | null
          pain_score: number | null
          slept_well: Database["public"]["Enums"]["yes_no_neutral"] | null
          stress_score: number | null
          time_slot: Database["public"]["Enums"]["time_slot"]
          updated_at: string
          user_id: string
        }
        Insert: {
          alcohol?: Database["public"]["Enums"]["alcohol_level"] | null
          caffeine?: Database["public"]["Enums"]["consumption_level"] | null
          created_at?: string
          date: string
          energy_score?: number | null
          exercise_level?: Database["public"]["Enums"]["exercise_level"] | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          pain_score?: number | null
          slept_well?: Database["public"]["Enums"]["yes_no_neutral"] | null
          stress_score?: number | null
          time_slot: Database["public"]["Enums"]["time_slot"]
          updated_at?: string
          user_id: string
        }
        Update: {
          alcohol?: Database["public"]["Enums"]["alcohol_level"] | null
          caffeine?: Database["public"]["Enums"]["consumption_level"] | null
          created_at?: string
          date?: string
          energy_score?: number | null
          exercise_level?: Database["public"]["Enums"]["exercise_level"] | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          pain_score?: number | null
          slept_well?: Database["public"]["Enums"]["yes_no_neutral"] | null
          stress_score?: number | null
          time_slot?: Database["public"]["Enums"]["time_slot"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      supplement_logs: {
        Row: {
          created_at: string
          date: string
          id: string
          supplement_id: string
          taken: boolean
          taken_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          supplement_id: string
          taken?: boolean
          taken_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          supplement_id?: string
          taken?: boolean
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplement_logs_supplement_id_fkey"
            columns: ["supplement_id"]
            isOneToOne: false
            referencedRelation: "supplements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplement_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      supplements: {
        Row: {
          created_at: string
          dosage: string | null
          id: string
          is_active: boolean
          name: string
          time_of_day: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          id?: string
          is_active?: boolean
          name: string
          time_of_day?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string | null
          id?: string
          is_active?: boolean
          name?: string
          time_of_day?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alcohol_level: "none" | "some" | "more"
      consumption_level: "none" | "low" | "medium" | "high"
      exercise_level: "none" | "light" | "moderate" | "intense"
      time_slot: "morning" | "midday" | "night"
      yes_no_neutral: "yes" | "no" | "neutral"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alcohol_level: ["none", "some", "more"],
      consumption_level: ["none", "low", "medium", "high"],
      exercise_level: ["none", "light", "moderate", "intense"],
      time_slot: ["morning", "midday", "night"],
      yes_no_neutral: ["yes", "no", "neutral"],
    },
  },
} as const
