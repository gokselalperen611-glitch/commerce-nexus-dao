-- Add token contracts table to store deployed token information
CREATE TABLE public.token_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  contract_address TEXT NOT NULL UNIQUE,
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  initial_supply NUMERIC NOT NULL,
  description TEXT,
  chain_id INTEGER NOT NULL,
  deployment_tx_hash TEXT,
  deployed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.token_contracts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Token contracts are viewable by everyone"
ON public.token_contracts
FOR SELECT
USING (is_active = true);

CREATE POLICY "Store owners can create token contracts"
ON public.token_contracts
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Store owners can update their token contracts"
ON public.token_contracts
FOR UPDATE
USING (auth.uid() = owner_id);

-- Add trigger for updated_at
CREATE TRIGGER update_token_contracts_updated_at
BEFORE UPDATE ON public.token_contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add contract_address column to stores table
ALTER TABLE public.stores 
ADD COLUMN contract_address TEXT,
ADD COLUMN chain_id INTEGER DEFAULT 137;