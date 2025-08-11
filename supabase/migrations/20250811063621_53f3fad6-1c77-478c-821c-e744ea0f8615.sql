-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  membership_fee_tokens INTEGER DEFAULT 0,
  has_premium_membership BOOLEAN DEFAULT false,
  premium_fee_tokens INTEGER DEFAULT 0,
  premium_features TEXT[],
  reward_rate DECIMAL DEFAULT 0.01,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Store policies
CREATE POLICY "Stores are viewable by everyone"
ON public.stores
FOR SELECT
USING (true);

CREATE POLICY "Store owners can update their stores"
ON public.stores
FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Authenticated users can create stores"
ON public.stores
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Create store memberships table
CREATE TABLE public.store_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  store_id UUID NOT NULL REFERENCES public.stores(id),
  membership_type TEXT NOT NULL CHECK (membership_type IN ('basic', 'premium')),
  token_balance INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, store_id)
);

ALTER TABLE public.store_memberships ENABLE ROW LEVEL SECURITY;

-- Membership policies
CREATE POLICY "Users can view their own memberships"
ON public.store_memberships
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Store owners can view all memberships"
ON public.store_memberships
FOR SELECT
USING (EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND owner_id = auth.uid()));

-- Create governance proposals table
CREATE TABLE public.governance_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id),
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  proposal_type TEXT NOT NULL CHECK (proposal_type IN ('feature', 'policy', 'tokenomics', 'governance')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'passed', 'rejected', 'expired')),
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  min_tokens_to_vote INTEGER DEFAULT 1,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.governance_proposals ENABLE ROW LEVEL SECURITY;

-- Proposal policies
CREATE POLICY "Proposals are viewable by store members"
ON public.governance_proposals
FOR SELECT
USING (EXISTS (SELECT 1 FROM public.store_memberships WHERE store_id = governance_proposals.store_id AND user_id = auth.uid()));

CREATE POLICY "Store members can create proposals"
ON public.governance_proposals
FOR INSERT
WITH CHECK (auth.uid() = creator_id AND EXISTS (SELECT 1 FROM public.store_memberships WHERE store_id = governance_proposals.store_id AND user_id = auth.uid()));

-- Create votes table
CREATE TABLE public.governance_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.governance_proposals(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  vote_type TEXT NOT NULL CHECK (vote_type IN ('for', 'against')),
  token_weight INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(proposal_id, user_id)
);

ALTER TABLE public.governance_votes ENABLE ROW LEVEL SECURITY;

-- Vote policies
CREATE POLICY "Users can view their own votes"
ON public.governance_votes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create votes"
ON public.governance_votes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Auto-update functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'display_name', new.email));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();