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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      governance_proposals: {
        Row: {
          created_at: string
          creator_id: string
          description: string
          expires_at: string
          id: string
          min_tokens_to_vote: number | null
          proposal_type: string
          status: string
          store_id: string
          title: string
          votes_against: number | null
          votes_for: number | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          description: string
          expires_at: string
          id?: string
          min_tokens_to_vote?: number | null
          proposal_type: string
          status?: string
          store_id: string
          title: string
          votes_against?: number | null
          votes_for?: number | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string
          expires_at?: string
          id?: string
          min_tokens_to_vote?: number | null
          proposal_type?: string
          status?: string
          store_id?: string
          title?: string
          votes_against?: number | null
          votes_for?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "governance_proposals_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      governance_votes: {
        Row: {
          created_at: string
          id: string
          proposal_id: string
          token_weight: number
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          proposal_id: string
          token_weight: number
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          proposal_id?: string
          token_weight?: number
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "governance_votes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "governance_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          dao_tokens_per_purchase: number | null
          description: string | null
          external_id: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          stock_quantity: number | null
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dao_tokens_per_purchase?: number | null
          description?: string | null
          external_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          stock_quantity?: number | null
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dao_tokens_per_purchase?: number | null
          description?: string | null
          external_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          stock_quantity?: number | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_store_id"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          id: string
          product_id: string
          purchase_date: string
          quantity: number
          status: string
          store_id: string
          tokens_earned: number
          total_price: number
          user_id: string
        }
        Insert: {
          id?: string
          product_id: string
          purchase_date?: string
          quantity?: number
          status?: string
          store_id: string
          tokens_earned?: number
          total_price: number
          user_id: string
        }
        Update: {
          id?: string
          product_id?: string
          purchase_date?: string
          quantity?: number
          status?: string
          store_id?: string
          tokens_earned?: number
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_purchases_product_id"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_purchases_store_id"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_memberships: {
        Row: {
          id: string
          is_active: boolean | null
          joined_at: string
          membership_type: string
          store_id: string
          token_balance: number | null
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          joined_at?: string
          membership_type: string
          store_id: string
          token_balance?: number | null
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          joined_at?: string
          membership_type?: string
          store_id?: string
          token_balance?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_memberships_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          chain_id: number | null
          contract_address: string | null
          created_at: string
          description: string | null
          has_premium_membership: boolean | null
          id: string
          logo_url: string | null
          membership_fee_tokens: number | null
          name: string
          owner_id: string
          premium_features: string[] | null
          premium_fee_tokens: number | null
          reward_rate: number | null
          token_name: string
          token_symbol: string
          updated_at: string
        }
        Insert: {
          chain_id?: number | null
          contract_address?: string | null
          created_at?: string
          description?: string | null
          has_premium_membership?: boolean | null
          id?: string
          logo_url?: string | null
          membership_fee_tokens?: number | null
          name: string
          owner_id: string
          premium_features?: string[] | null
          premium_fee_tokens?: number | null
          reward_rate?: number | null
          token_name: string
          token_symbol: string
          updated_at?: string
        }
        Update: {
          chain_id?: number | null
          contract_address?: string | null
          created_at?: string
          description?: string | null
          has_premium_membership?: boolean | null
          id?: string
          logo_url?: string | null
          membership_fee_tokens?: number | null
          name?: string
          owner_id?: string
          premium_features?: string[] | null
          premium_fee_tokens?: number | null
          reward_rate?: number | null
          token_name?: string
          token_symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      token_contracts: {
        Row: {
          chain_id: number
          contract_address: string
          created_at: string
          deployed_at: string
          deployment_tx_hash: string | null
          description: string | null
          id: string
          initial_supply: number
          is_active: boolean | null
          owner_id: string
          store_id: string
          token_name: string
          token_symbol: string
          updated_at: string
        }
        Insert: {
          chain_id: number
          contract_address: string
          created_at?: string
          deployed_at?: string
          deployment_tx_hash?: string | null
          description?: string | null
          id?: string
          initial_supply: number
          is_active?: boolean | null
          owner_id: string
          store_id: string
          token_name: string
          token_symbol: string
          updated_at?: string
        }
        Update: {
          chain_id?: number
          contract_address?: string
          created_at?: string
          deployed_at?: string
          deployment_tx_hash?: string | null
          description?: string | null
          id?: string
          initial_supply?: number
          is_active?: boolean | null
          owner_id?: string
          store_id?: string
          token_name?: string
          token_symbol?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_contracts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      token_distributions: {
        Row: {
          created_at: string
          id: string
          purchase_id: string | null
          reason: string
          store_id: string
          tokens_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          purchase_id?: string | null
          reason?: string
          store_id: string
          tokens_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          purchase_id?: string | null
          reason?: string
          store_id?: string
          tokens_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_token_distributions_purchase_id"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_token_distributions_store_id"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_profile: {
        Args: { profile_user_id: string }
        Returns: {
          avatar_url: string
          created_at: string
          display_name: string
          id: string
          updated_at: string
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
