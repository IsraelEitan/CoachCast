export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      ai_jobs: {
        Row: {
          created_at: string;
          created_by: string | null;
          error_message: string | null;
          finished_at: string | null;
          id: string;
          input: Json;
          kind: "brand_scan" | "idea_generation" | "script_generation" | "render_plan" | "publish_plan";
          output: Json;
          started_at: string | null;
          status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          error_message?: string | null;
          finished_at?: string | null;
          id?: string;
          input?: Json;
          kind: "brand_scan" | "idea_generation" | "script_generation" | "render_plan" | "publish_plan";
          output?: Json;
          started_at?: string | null;
          status?: "queued" | "running" | "succeeded" | "failed" | "cancelled";
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          error_message?: string | null;
          finished_at?: string | null;
          id?: string;
          input?: Json;
          kind?: "brand_scan" | "idea_generation" | "script_generation" | "render_plan" | "publish_plan";
          output?: Json;
          started_at?: string | null;
          status?: "queued" | "running" | "succeeded" | "failed" | "cancelled";
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [];
      };
      brand_profiles: {
        Row: {
          audience: Json;
          avoid_claims: string[];
          content_pillars: string[];
          created_at: string;
          id: string;
          offers: string[];
          pain_points: string[];
          raw_summary: Json;
          source_handle: string | null;
          source_url: string | null;
          status: "draft" | "ready" | "archived";
          tone: string[];
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          audience?: Json;
          avoid_claims?: string[];
          content_pillars?: string[];
          created_at?: string;
          id?: string;
          offers?: string[];
          pain_points?: string[];
          raw_summary?: Json;
          source_handle?: string | null;
          source_url?: string | null;
          status?: "draft" | "ready" | "archived";
          tone?: string[];
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          audience?: Json;
          avoid_claims?: string[];
          content_pillars?: string[];
          created_at?: string;
          id?: string;
          offers?: string[];
          pain_points?: string[];
          raw_summary?: Json;
          source_handle?: string | null;
          source_url?: string | null;
          status?: "draft" | "ready" | "archived";
          tone?: string[];
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [];
      };
      content_ideas: {
        Row: {
          brand_profile_id: string | null;
          confidence: number;
          created_at: string;
          cta: string;
          format: string;
          hook: string;
          id: string;
          status: "draft" | "approved" | "rejected" | "archived";
          title: string;
          updated_at: string;
          viewer_pain: string;
          workspace_id: string;
        };
        Insert: {
          brand_profile_id?: string | null;
          confidence: number;
          created_at?: string;
          cta: string;
          format: string;
          hook: string;
          id?: string;
          status?: "draft" | "approved" | "rejected" | "archived";
          title: string;
          updated_at?: string;
          viewer_pain: string;
          workspace_id: string;
        };
        Update: {
          brand_profile_id?: string | null;
          confidence?: number;
          created_at?: string;
          cta?: string;
          format?: string;
          hook?: string;
          id?: string;
          status?: "draft" | "approved" | "rejected" | "archived";
          title?: string;
          updated_at?: string;
          viewer_pain?: string;
          workspace_id?: string;
        };
        Relationships: [];
      };
      script_drafts: {
        Row: {
          beats: string[];
          caption: string;
          content_idea_id: string;
          created_at: string;
          hashtags: string[];
          hook: string;
          id: string;
          shot_list: string[];
          status: "draft" | "approved" | "needs_revision" | "archived";
          teleprompter_text: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          beats?: string[];
          caption: string;
          content_idea_id: string;
          created_at?: string;
          hashtags?: string[];
          hook: string;
          id?: string;
          shot_list?: string[];
          status?: "draft" | "approved" | "needs_revision" | "archived";
          teleprompter_text: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          beats?: string[];
          caption?: string;
          content_idea_id?: string;
          created_at?: string;
          hashtags?: string[];
          hook?: string;
          id?: string;
          shot_list?: string[];
          status?: "draft" | "approved" | "needs_revision" | "archived";
          teleprompter_text?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [];
      };
      workspace_members: {
        Row: {
          created_at: string;
          role: "owner" | "admin" | "trainer" | "viewer";
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          role?: "owner" | "admin" | "trainer" | "viewer";
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          role?: "owner" | "admin" | "trainer" | "viewer";
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [];
      };
      workspaces: {
        Row: {
          audience_summary: string | null;
          created_at: string;
          id: string;
          instagram_handle: string | null;
          name: string;
          owner_id: string;
          primary_offer: string | null;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          audience_summary?: string | null;
          created_at?: string;
          id?: string;
          instagram_handle?: string | null;
          name: string;
          owner_id: string;
          primary_offer?: string | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          audience_summary?: string | null;
          created_at?: string;
          id?: string;
          instagram_handle?: string | null;
          name?: string;
          owner_id?: string;
          primary_offer?: string | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_workspace_member: {
        Args: { target_workspace_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
