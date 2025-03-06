export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      additional_appointments: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          order_id: string
          time: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          order_id: string
          time: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          order_id?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "additional_appointments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company: string | null
          company_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          outstanding_jobs: number | null
          outstanding_payment: number | null
          phone: string | null
          photo_url: string | null
          status: string
          total_jobs: number | null
        }
        Insert: {
          company?: string | null
          company_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          outstanding_jobs?: number | null
          outstanding_payment?: number | null
          phone?: string | null
          photo_url?: string | null
          status?: string
          total_jobs?: number | null
        }
        Update: {
          company?: string | null
          company_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          outstanding_jobs?: number | null
          outstanding_payment?: number | null
          phone?: string | null
          photo_url?: string | null
          status?: string
          total_jobs?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_clients_companies"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          industry: string
          logo_url: string | null
          name: string
          open_jobs: number | null
          outstanding_amount: number | null
          phone: string | null
          state: string | null
          status: string
          total_jobs: number | null
          total_revenue: number | null
          website: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string
          logo_url?: string | null
          name: string
          open_jobs?: number | null
          outstanding_amount?: number | null
          phone?: string | null
          state?: string | null
          status?: string
          total_jobs?: number | null
          total_revenue?: number | null
          website?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string
          logo_url?: string | null
          name?: string
          open_jobs?: number | null
          outstanding_amount?: number | null
          phone?: string | null
          state?: string | null
          status?: string
          total_jobs?: number | null
          total_revenue?: number | null
          website?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      custom_fields: {
        Row: {
          created_at: string
          field_key: string
          field_value: string | null
          id: string
          order_id: string
        }
        Insert: {
          created_at?: string
          field_key: string
          field_value?: string | null
          id?: string
          order_id: string
        }
        Update: {
          created_at?: string
          field_key?: string
          field_value?: string | null
          id?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_fields_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          city: string
          client: string
          client_email: string
          client_phone: string | null
          created_at: string
          customer_notes: string | null
          id: string
          internal_notes: string | null
          notes: string | null
          order_number: string
          package: string
          photographer: string | null
          photographer_payout_rate: number | null
          price: number
          property_type: string
          scheduled_date: string
          scheduled_time: string
          square_feet: number
          state: string
          status: string
          updated_at: string
          zip: string
        }
        Insert: {
          address: string
          city: string
          client: string
          client_email: string
          client_phone?: string | null
          created_at?: string
          customer_notes?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number: string
          package: string
          photographer?: string | null
          photographer_payout_rate?: number | null
          price: number
          property_type: string
          scheduled_date: string
          scheduled_time: string
          square_feet: number
          state: string
          status: string
          updated_at?: string
          zip: string
        }
        Update: {
          address?: string
          city?: string
          client?: string
          client_email?: string
          client_phone?: string | null
          created_at?: string
          customer_notes?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number?: string
          package?: string
          photographer?: string | null
          photographer_payout_rate?: number | null
          price?: number
          property_type?: string
          scheduled_date?: string
          scheduled_time?: string
          square_feet?: number
          state?: string
          status?: string
          updated_at?: string
          zip?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          username: string | null
        }[]
      }
      migrate_sample_orders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
