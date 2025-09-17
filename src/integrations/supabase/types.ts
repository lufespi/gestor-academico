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
      documents: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          meeting_id: string | null
          mime_type: string | null
          project_id: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          meeting_id?: string | null
          mime_type?: string | null
          project_id?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          meeting_id?: string | null
          mime_type?: string | null
          project_id?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_criteria: {
        Row: {
          created_at: string
          description: string | null
          evaluation_type: Database["public"]["Enums"]["evaluation_type"]
          id: string
          is_active: boolean
          max_score: number
          name: string
          weight: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          evaluation_type: Database["public"]["Enums"]["evaluation_type"]
          id?: string
          is_active?: boolean
          max_score?: number
          name: string
          weight?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          evaluation_type?: Database["public"]["Enums"]["evaluation_type"]
          id?: string
          is_active?: boolean
          max_score?: number
          name?: string
          weight?: number
        }
        Relationships: []
      }
      evaluations: {
        Row: {
          comments: string | null
          created_at: string
          criteria_id: string
          evaluation_type: Database["public"]["Enums"]["evaluation_type"]
          id: string
          professor_id: string
          project_id: string
          score: number
          updated_at: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          criteria_id: string
          evaluation_type: Database["public"]["Enums"]["evaluation_type"]
          id?: string
          professor_id: string
          project_id: string
          score: number
          updated_at?: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          criteria_id?: string
          evaluation_type?: Database["public"]["Enums"]["evaluation_type"]
          id?: string
          professor_id?: string
          project_id?: string
          score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "evaluation_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          agenda: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          meeting_date: string
          next_meeting: string | null
          notes: string | null
          professor_id: string
          project_id: string
          updated_at: string
        }
        Insert: {
          agenda?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          meeting_date: string
          next_meeting?: string | null
          notes?: string | null
          professor_id: string
          project_id: string
          updated_at?: string
        }
        Update: {
          agenda?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          meeting_date?: string
          next_meeting?: string | null
          notes?: string | null
          professor_id?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      professors: {
        Row: {
          created_at: string
          department: string | null
          id: string
          is_active: boolean
          specialization: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          specialization?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          specialization?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          proposal_deadline: string | null
          proposal_reelaboration_deadline: string | null
          status: Database["public"]["Enums"]["project_status"]
          student_id: string
          tc_deadline: string | null
          tc_reelaboration_deadline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          proposal_deadline?: string | null
          proposal_reelaboration_deadline?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          student_id: string
          tc_deadline?: string | null
          tc_reelaboration_deadline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          proposal_deadline?: string | null
          proposal_reelaboration_deadline?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          student_id?: string
          tc_deadline?: string | null
          tc_reelaboration_deadline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      review_panels: {
        Row: {
          created_at: string
          defense_date: string | null
          id: string
          location: string | null
          professor1_id: string
          professor2_id: string
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          defense_date?: string | null
          id?: string
          location?: string | null
          professor1_id: string
          professor2_id: string
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          defense_date?: string | null
          id?: string
          location?: string | null
          professor1_id?: string
          professor2_id?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_panels_professor1_id_fkey"
            columns: ["professor1_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_panels_professor2_id_fkey"
            columns: ["professor2_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_panels_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          advisor_id: string | null
          course: string
          created_at: string
          id: string
          is_active: boolean
          registration_number: string
          semester: number
          updated_at: string
          user_id: string
        }
        Insert: {
          advisor_id?: string | null
          course: string
          created_at?: string
          id?: string
          is_active?: boolean
          registration_number: string
          semester: number
          updated_at?: string
          user_id: string
        }
        Update: {
          advisor_id?: string | null
          course?: string
          created_at?: string
          id?: string
          is_active?: boolean
          registration_number?: string
          semester?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_projects: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_my_deadlines: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_my_meetings: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_my_project_details: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_overdue_items_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_project_status_distribution: {
        Args: Record<PropertyKey, never>
        Returns: {
          project_count: number
          status_name: string
        }[]
      }
      get_recent_activities: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          description: string
          type: string
        }[]
      }
      get_total_students: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_upcoming_deadlines_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      evaluation_type:
        | "proposta"
        | "reelaboracao_proposta"
        | "tc"
        | "reelaboracao_tc"
      project_status:
        | "proposta"
        | "reelaboracao_proposta"
        | "em_andamento"
        | "entregue"
        | "reelaboracao_tc"
        | "avaliado"
        | "aprovado"
        | "reprovado"
      user_role: "coordinator" | "professor" | "student"
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
    Enums: {
      evaluation_type: [
        "proposta",
        "reelaboracao_proposta",
        "tc",
        "reelaboracao_tc",
      ],
      project_status: [
        "proposta",
        "reelaboracao_proposta",
        "em_andamento",
        "entregue",
        "reelaboracao_tc",
        "avaliado",
        "aprovado",
        "reprovado",
      ],
      user_role: ["coordinator", "professor", "student"],
    },
  },
} as const
