
-- Phase 1: Enable real-time for all tables and set up proper configuration

-- Enable replica identity for real-time updates
ALTER TABLE public.sites REPLICA IDENTITY FULL;
ALTER TABLE public.workers REPLICA IDENTITY FULL;
ALTER TABLE public.attendance REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sites;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Create basic RLS policies for sites
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all sites" ON public.sites
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can create sites" ON public.sites
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update sites" ON public.sites
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Users can delete sites" ON public.sites
FOR DELETE TO authenticated
USING (true);

-- Create basic RLS policies for workers
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all workers" ON public.workers
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can create workers" ON public.workers
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update workers" ON public.workers
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Users can delete workers" ON public.workers
FOR DELETE TO authenticated
USING (true);

-- Create basic RLS policies for attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all attendance" ON public.attendance
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can create attendance" ON public.attendance
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update attendance" ON public.attendance
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Users can delete attendance" ON public.attendance
FOR DELETE TO authenticated
USING (true);

-- Create basic RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can create their own profile" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id);
