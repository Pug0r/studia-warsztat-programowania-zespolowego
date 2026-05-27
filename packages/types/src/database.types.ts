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
          status: string;
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
          status?: string;
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
          status?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "adoption_applications_pet_id_fkey";
            columns: ["pet_id"];
            isOneToOne: false;
            referencedRelation: "pets";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_email: string | null;
          actor_user_id: string | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: number;
          ip_address: string | null;
          metadata: Json;
          method: string;
          new_data: Json | null;
          old_data: Json | null;
          route: string;
          user_agent: string | null;
        };
        Insert: {
          action: string;
          actor_email?: string | null;
          actor_user_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: number;
          ip_address?: string | null;
          metadata?: Json;
          method: string;
          new_data?: Json | null;
          old_data?: Json | null;
          route: string;
          user_agent?: string | null;
        };
        Update: {
          action?: string;
          actor_email?: string | null;
          actor_user_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          id?: number;
          ip_address?: string | null;
          metadata?: Json;
          method?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          route?: string;
          user_agent?: string | null;
        };
        Relationships: [];
      };
      calendar_events: {
        Row: {
          created_at: string;
          description: string;
          ends_at: string | null;
          event_type: string;
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
          event_type?: string;
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
          event_type?: string;
          id?: number;
          is_public?: boolean;
          location?: string;
          starts_at?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      health_card_entries: {
        Row: {
          created_at: string;
          description: string | null;
          entry_type: string;
          id: number;
          medication: string | null;
          pet_id: number;
          title: string;
          treatment_date: string;
          updated_at: string;
          vet_email: string | null;
          vet_id: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          entry_type?: string;
          id?: number;
          medication?: string | null;
          pet_id: number;
          title: string;
          treatment_date?: string;
          updated_at?: string;
          vet_email?: string | null;
          vet_id?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          entry_type?: string;
          id?: number;
          medication?: string | null;
          pet_id?: number;
          title?: string;
          treatment_date?: string;
          updated_at?: string;
          vet_email?: string | null;
          vet_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "health_card_entries_pet_id_fkey";
            columns: ["pet_id"];
            isOneToOne: false;
            referencedRelation: "pets";
            referencedColumns: ["id"];
          },
        ];
      };
      medical_event_reminders: {
        Row: {
          audience_role: string;
          created_at: string;
          due_at: string;
          id: number;
          medical_event_id: number;
          read_at: string | null;
        };
        Insert: {
          audience_role: string;
          created_at?: string;
          due_at: string;
          id?: number;
          medical_event_id: number;
          read_at?: string | null;
        };
        Update: {
          audience_role?: string;
          created_at?: string;
          due_at?: string;
          id?: number;
          medical_event_id?: number;
          read_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "medical_event_reminders_medical_event_id_fkey";
            columns: ["medical_event_id"];
            isOneToOne: false;
            referencedRelation: "medical_events";
            referencedColumns: ["id"];
          },
        ];
      };
      medical_events: {
        Row: {
          created_at: string;
          created_by: string | null;
          created_by_email: string | null;
          id: number;
          notes: string | null;
          pet_id: number;
          reminder_sent_at: string | null;
          scheduled_at: string;
          status: string;
          title: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          created_by_email?: string | null;
          id?: number;
          notes?: string | null;
          pet_id: number;
          reminder_sent_at?: string | null;
          scheduled_at: string;
          status?: string;
          title: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          created_by_email?: string | null;
          id?: number;
          notes?: string | null;
          pet_id?: number;
          reminder_sent_at?: string | null;
          scheduled_at?: string;
          status?: string;
          title?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medical_events_pet_id_fkey";
            columns: ["pet_id"];
            isOneToOne: false;
            referencedRelation: "pets";
            referencedColumns: ["id"];
          },
        ];
      };
      pet_health_entries: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          end_date: string | null;
          id: number;
          notes: string | null;
          pet_id: number;
          start_date: string | null;
          title: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: number;
          notes?: string | null;
          pet_id: number;
          start_date?: string | null;
          title: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: number;
          notes?: string | null;
          pet_id?: number;
          start_date?: string | null;
          title?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pet_health_entries_pet_id_fkey";
            columns: ["pet_id"];
            isOneToOne: false;
            referencedRelation: "pets";
            referencedColumns: ["id"];
          },
        ];
      };
      pet_walks: {
        Row: {
          created_at: string;
          end_at: string | null;
          id: number;
          notes: string | null;
          pet_id: number;
          walked_at: string;
          walker_id: string | null;
        };
        Insert: {
          created_at?: string;
          end_at?: string | null;
          id?: number;
          notes?: string | null;
          pet_id: number;
          walked_at?: string;
          walker_id?: string | null;
        };
        Update: {
          created_at?: string;
          end_at?: string | null;
          id?: number;
          notes?: string | null;
          pet_id?: number;
          walked_at?: string;
          walker_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "pet_walks_pet_id_fkey";
            columns: ["pet_id"];
            isOneToOne: false;
            referencedRelation: "pets";
            referencedColumns: ["id"];
          },
        ];
      };
      pets: {
        Row: {
          age: number | null;
          breed: string | null;
          created_at: string;
          description: string;
          id: number;
          ideal_home: string | null;
          image_url: string | null;
          image_urls: string[] | null;
          name: string;
          personality: string | null;
          size: string | null;
          special_needs: string | null;
          species: string;
          weight: number | null;
        };
        Insert: {
          age?: number | null;
          breed?: string | null;
          created_at?: string;
          description: string;
          id?: number;
          ideal_home?: string | null;
          image_url?: string | null;
          image_urls?: string[] | null;
          name: string;
          personality?: string | null;
          size?: string | null;
          special_needs?: string | null;
          species: string;
          weight?: number | null;
        };
        Update: {
          age?: number | null;
          breed?: string | null;
          created_at?: string;
          description?: string;
          id?: number;
          ideal_home?: string | null;
          image_url?: string | null;
          image_urls?: string[] | null;
          name?: string;
          personality?: string | null;
          size?: string | null;
          special_needs?: string | null;
          species?: string;
          weight?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
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
    Enums: {
      user_role: "user" | "admin" | "vet" | "coordinator" | "volunteer";
    };
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
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
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
    Enums: {
      user_role: ["user", "admin", "vet", "coordinator", "volunteer"],
    },
  },
} as const;
