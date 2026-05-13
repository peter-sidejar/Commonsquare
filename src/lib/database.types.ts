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
      comment_votes: {
        Row: {
          comment_id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          value: number;
        };
        Insert: {
          comment_id: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          value: number;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "comment_votes_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "topic_comments";
            referencedColumns: ["id"];
          },
        ];
      };
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
      topic_comments: {
        Row: {
          archetype_id: string;
          body: string;
          created_at: string;
          id: string;
          is_deleted: boolean;
          parent_id: string | null;
          score: number;
          topic_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          archetype_id: string;
          body: string;
          created_at?: string;
          id?: string;
          is_deleted?: boolean;
          parent_id?: string | null;
          score?: number;
          topic_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          archetype_id?: string;
          body?: string;
          created_at?: string;
          id?: string;
          is_deleted?: boolean;
          parent_id?: string | null;
          score?: number;
          topic_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "topic_comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "topic_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "topic_comments_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "topics";
            referencedColumns: ["id"];
          },
        ];
      };
      topics: {
        Row: {
          background: string;
          center_sources: Json;
          created_at: string;
          debate_question: string;
          id: string;
          left_sources: Json;
          left_summary: string;
          og_image_url: string | null;
          primary_axis: string;
          published_at: string;
          right_sources: Json;
          right_summary: string;
          slug: string;
          status: string;
          tags: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          background: string;
          center_sources?: Json;
          created_at?: string;
          debate_question: string;
          id?: string;
          left_sources?: Json;
          left_summary: string;
          og_image_url?: string | null;
          primary_axis?: string;
          published_at?: string;
          right_sources?: Json;
          right_summary: string;
          slug: string;
          status?: string;
          tags?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          background?: string;
          center_sources?: Json;
          created_at?: string;
          debate_question?: string;
          id?: string;
          left_sources?: Json;
          left_summary?: string;
          og_image_url?: string | null;
          primary_axis?: string;
          published_at?: string;
          right_sources?: Json;
          right_summary?: string;
          slug?: string;
          status?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      topic_votes: {
        Row: {
          archetype_id: string;
          created_at: string;
          id: string;
          topic_id: string;
          updated_at: string;
          user_id: string;
          vote: string;
        };
        Insert: {
          archetype_id: string;
          created_at?: string;
          id?: string;
          topic_id: string;
          updated_at?: string;
          user_id: string;
          vote: string;
        };
        Update: {
          archetype_id?: string;
          created_at?: string;
          id?: string;
          topic_id?: string;
          updated_at?: string;
          user_id?: string;
          vote?: string;
        };
        Relationships: [
          {
            foreignKeyName: "topic_votes_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "topics";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      handle_is_available: { Args: { p_handle: string }; Returns: boolean };
      handle_is_clean: { Args: { p_handle: string }; Returns: boolean };
      topic_comments_with_author: {
        Args: { p_limit?: number; p_sort?: string; p_topic_id: string };
        Returns: {
          archetype_id: string;
          body: string;
          created_at: string;
          handle: string;
          id: string;
          is_deleted: boolean;
          parent_id: string;
          score: number;
          show_on_profile: boolean;
        }[];
      };
      topic_vote_tally: {
        Args: { p_topic_id: string };
        Returns: {
          no_by_archetype: Json;
          no_total: number;
          yes_by_archetype: Json;
          yes_total: number;
        }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type TopicRow = Database["public"]["Tables"]["topics"]["Row"];
export type TopicInsert = Database["public"]["Tables"]["topics"]["Insert"];
export type TopicVoteTally =
  Database["public"]["Functions"]["topic_vote_tally"]["Returns"][number];
export type CommentWithAuthor =
  Database["public"]["Functions"]["topic_comments_with_author"]["Returns"][number];

// Shape of a source citation inside a topic's left_sources / right_sources /
// center_sources jsonb arrays. n8n writes these via the ingest endpoint; the
// page renders them as source cards.
export interface TopicSource {
  outlet: string;
  title: string;
  url: string;
  bias_label: string; // "Left" | "Lean Left" | "Center" | "Lean Right" | "Right"
  excerpt?: string;
}
