export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  public: {
    Tables: {
      pets: {
        Row: {
          age: number | null;
          created_at: string;
          description: string;
          id: number;
          image_url: string | null;
          name: string;
          species: string;
          status: "available" | "quarantine";
          weight: number | null;
          breed: string | null;
          size: string | null;
          personality: string | null;
          ideal_home: string | null;
          special_needs: string | null;
          image_urls: string[] | null;
        };
        Insert: {
          age?: number | null;
          created_at?: string;
          description: string;
          id?: number;
          image_url?: string | null;
          name: string;
          species: string;
          status?: "available" | "quarantine";
          weight?: number | null;
          breed?: string | null;
          size?: string | null;
          personality?: string | null;
          ideal_home?: string | null;
          special_needs?: string | null;
          image_urls?: string[] | null;
        };
        Update: {
          age?: number | null;
          created_at?: string;
          description?: string;
          id?: number;
          image_url?: string | null;
          name?: string;
          species?: string;
          status?: "available" | "quarantine";
          weight?: number | null;
          breed?: string | null;
          size?: string | null;
          personality?: string | null;
          ideal_home?: string | null;
          special_needs?: string | null;
          image_urls?: string[] | null;
        };
        Relationships: [];
      };
      pet_walks: {
        Row: {
          created_at: string;
          id: number;
          notes: string | null;
          pet_id: number;
          walked_at: string;
          walker_id: string | null;
          end_at: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          notes?: string | null;
          pet_id: number;
          walked_at?: string;
          walker_id?: string | null;
          end_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          notes?: string | null;
          pet_id?: number;
          walked_at?: string;
          walker_id?: string | null;
          end_at?: string | null;
        };
        Relationships: [];
      };
      adoption_applications: {
        Row: {
          city: string | null;
          created_at: string;
          email: string;
          full_name: string;
          has_other_pets: boolean | null;
          housing_type: string | null;
          id: number;
          message: string;
          pet_id: number;
          phone: string | null;
          status: "new" | "reviewing" | "accepted" | "rejected";
          user_id: string | null;
        };
        Insert: {
          city?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          has_other_pets?: boolean | null;
          housing_type?: string | null;
          id?: number;
          message: string;
          pet_id: number;
          phone?: string | null;
          status?: "new" | "reviewing" | "accepted" | "rejected";
          user_id?: string | null;
        };
        Update: {
          city?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          has_other_pets?: boolean | null;
          housing_type?: string | null;
          id?: number;
          message?: string;
          pet_id?: number;
          phone?: string | null;
          status?: "new" | "reviewing" | "accepted" | "rejected";
          user_id?: string | null;
        };
        Relationships: [];
      };
      calendar_events: {
        Row: {
          created_at: string;
          description: string;
          ends_at: string | null;
          event_type:
            | "open_day"
            | "food_drive"
            | "volunteer_training"
            | "community_event"
            | "other";
          id: number;
          is_public: boolean;
          location: string;
          starts_at: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          ends_at?: string | null;
          event_type?:
            | "open_day"
            | "food_drive"
            | "volunteer_training"
            | "community_event"
            | "other";
          id?: number;
          is_public?: boolean;
          location: string;
          starts_at: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          ends_at?: string | null;
          event_type?:
            | "open_day"
            | "food_drive"
            | "volunteer_training"
            | "community_event"
            | "other";
          id?: number;
          is_public?: boolean;
          location?: string;
          starts_at?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      volunteers: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: number;
          phone: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id?: number;
          phone?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: number;
          phone?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
