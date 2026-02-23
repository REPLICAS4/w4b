
-- Drop the existing restrictive SELECT policy on replicas
DROP POLICY IF EXISTS "Users can view their own replicas" ON public.replicas;

-- Create a permissive SELECT policy allowing all authenticated users to view all replicas
CREATE POLICY "Authenticated users can view all replicas"
ON public.replicas
FOR SELECT
TO authenticated
USING (true);
