-- Allow public read of profiles for Discovery creator info
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Anyone can view profiles"
ON public.profiles
FOR SELECT
USING (true);

-- Create chat_messages table for persisting chat history
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  replica_id UUID NOT NULL REFERENCES public.replicas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages"
ON public.chat_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages"
ON public.chat_messages FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX idx_chat_messages_replica_user ON public.chat_messages (replica_id, user_id, created_at);
