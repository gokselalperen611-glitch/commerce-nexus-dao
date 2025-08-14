-- Fix search path security issues for functions

-- Drop and recreate handle_purchase_and_tokens with proper search path
DROP FUNCTION IF EXISTS public.handle_purchase_and_tokens();
CREATE OR REPLACE FUNCTION public.handle_purchase_and_tokens()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Calculate tokens to award
  DECLARE
    tokens_to_award INTEGER;
    store_reward_rate DECIMAL;
  BEGIN
    -- Get store's reward configuration
    SELECT 
      COALESCE(p.dao_tokens_per_purchase, 100) * NEW.quantity,
      COALESCE(s.reward_rate, 0.01)
    INTO tokens_to_award, store_reward_rate
    FROM public.products p
    JOIN public.stores s ON s.id = p.store_id
    WHERE p.id = NEW.product_id;

    -- Update purchase record with tokens earned
    NEW.tokens_earned = tokens_to_award;

    -- Insert token distribution record
    INSERT INTO public.token_distributions (
      user_id,
      store_id, 
      purchase_id,
      tokens_amount,
      reason
    ) VALUES (
      NEW.user_id,
      NEW.store_id,
      NEW.id,
      tokens_to_award,
      'purchase'
    );

    -- Update user's store membership token balance
    UPDATE public.store_memberships
    SET token_balance = token_balance + tokens_to_award
    WHERE user_id = NEW.user_id 
      AND store_id = NEW.store_id 
      AND is_active = true;

    RETURN NEW;
  END;
END;
$$;

-- Drop and recreate update_proposal_votes with proper search path
DROP FUNCTION IF EXISTS public.update_proposal_votes();
CREATE OR REPLACE FUNCTION public.update_proposal_votes()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update vote counts on the proposal
  UPDATE public.governance_proposals
  SET 
    votes_for = (
      SELECT COALESCE(SUM(token_weight), 0)
      FROM public.governance_votes
      WHERE proposal_id = NEW.proposal_id AND vote_type = 'for'
    ),
    votes_against = (
      SELECT COALESCE(SUM(token_weight), 0)
      FROM public.governance_votes
      WHERE proposal_id = NEW.proposal_id AND vote_type = 'against'
    )
  WHERE id = NEW.proposal_id;

  RETURN NEW;
END;
$$;