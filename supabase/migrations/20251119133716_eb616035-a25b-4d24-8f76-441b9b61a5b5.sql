-- Create users table for future multi-user support
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create enum types for entries
CREATE TYPE time_slot AS ENUM ('morning', 'midday', 'night');
CREATE TYPE yes_no_neutral AS ENUM ('yes', 'no', 'neutral');
CREATE TYPE exercise_level AS ENUM ('none', 'light', 'moderate', 'intense');
CREATE TYPE consumption_level AS ENUM ('none', 'low', 'medium', 'high');
CREATE TYPE alcohol_level AS ENUM ('none', 'some', 'more');

-- Create entries table for check-ins
CREATE TABLE IF NOT EXISTS public.entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot time_slot NOT NULL,
  
  -- Quantitative ratings (0-10)
  mood_score NUMERIC(3,1) CHECK (mood_score >= 0 AND mood_score <= 10),
  stress_score NUMERIC(3,1) CHECK (stress_score >= 0 AND stress_score <= 10),
  energy_score NUMERIC(3,1) CHECK (energy_score >= 0 AND energy_score <= 10),
  pain_score NUMERIC(3,1) CHECK (pain_score >= 0 AND pain_score <= 10),
  
  -- Lifestyle/context fields
  slept_well yes_no_neutral,
  exercise_level exercise_level,
  caffeine consumption_level,
  alcohol alcohol_level,
  
  -- Free text
  notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure one entry per user per date per time_slot
  UNIQUE(user_id, date, time_slot)
);

-- Create daily summaries table for AI insights
CREATE TABLE IF NOT EXISTS public.daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Readiness scores (0-100)
  mind_readiness NUMERIC(5,2) CHECK (mind_readiness >= 0 AND mind_readiness <= 100),
  body_readiness NUMERIC(5,2) CHECK (body_readiness >= 0 AND body_readiness <= 100),
  overall_readiness NUMERIC(5,2) CHECK (overall_readiness >= 0 AND overall_readiness <= 100),
  
  -- AI-generated text
  summary_text TEXT,
  what_went_well TEXT,
  concerns TEXT,
  suggested_actions TEXT,
  
  -- Optional debug field
  ai_raw_json TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure one summary per user per date
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- RLS Policies for entries table
CREATE POLICY "Users can view their own entries"
  ON public.entries FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own entries"
  ON public.entries FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own entries"
  ON public.entries FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own entries"
  ON public.entries FOR DELETE
  USING (user_id = auth.uid());

-- RLS Policies for daily_summaries table
CREATE POLICY "Users can view their own summaries"
  ON public.daily_summaries FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own summaries"
  ON public.daily_summaries FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own summaries"
  ON public.daily_summaries FOR UPDATE
  USING (user_id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_entries_updated_at
  BEFORE UPDATE ON public.entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_summaries_updated_at
  BEFORE UPDATE ON public.daily_summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_entries_user_date ON public.entries(user_id, date);
CREATE INDEX idx_daily_summaries_user_date ON public.daily_summaries(user_id, date);