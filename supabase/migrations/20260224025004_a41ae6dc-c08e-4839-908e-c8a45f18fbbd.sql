DROP POLICY IF EXISTS "Authenticated users can view all replicas" ON public.replicas;
CREATE POLICY "Anyone can view all replicas" ON public.replicas FOR SELECT USING (true);