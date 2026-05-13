// Auto-generated from Supabase schema via the MCP `generate_typescript_types`
// tool. Regenerate after any DDL changes:
//   npx supabase gen types typescript --project-id fyhjusydcmbcsisflmao
// (or via the Supabase MCP tool from a Claude session).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          archetype_id: string;
          axis_e: number;
          axis_g: number;
          axis_s: number;
          created_at: string;
          elo: number;
          email: string;
          handle: string;
          losses: number;
          show_on_profile: boolean;
          updated_at: string;
          user_id: string;
          wins: number;
        };
        Insert: {
          archetype_id: string;
          axis_e: number;
          axis_g: number;
          axis_s: number;
          created_at?: string;
          elo?: number;
          email: string;
          handle: string;
          losses?: number;
          show_on_profile?: boolean;
          updated_at?: string;
          user_id: string;
          wins?: number;
        };
        Update: {
          archetype_id?: string;
          axis_e?: number;
          axis_g?: number;
          axis_s?: number;
          created_at?: string;
          elo?: number;
          email?: string;
          handle?: string;
          losses?: number;
          show_on_profile?: boolean;
          updated_at?: string;
          user_id?: string;
          wins?: number;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      handle_is_available: { Args: { p_handle: string }; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
