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
      app_settings: {
        Row: {
          created_at: string | null
          id: string
          is_global: boolean | null
          key: string
          updated_at: string | null
          user_id: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          key: string
          updated_at?: string | null
          user_id?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          key?: string
          updated_at?: string | null
          user_id?: string | null
          value?: Json
        }
        Relationships: []
      }
      client_notes: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "billing_summary"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_photos: {
        Row: {
          client_id: string
          created_at: string
          id: string
          is_default: boolean | null
          photo_url: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          photo_url: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_photos_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "billing_summary"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "client_photos_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
      coupons: {
        Row: {
          code: string
          created_at: string | null
          description: string
          enabled: boolean | null
          end_date: string | null
          id: string
          start_date: string | null
          type: string
          updated_at: string | null
          usage_limit: number | null
          used_count: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string | null
          description: string
          enabled?: boolean | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          type: string
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string
          enabled?: boolean | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          type?: string
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          value?: number
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
      esoft_settings: {
        Row: {
          allow_reference_editing: boolean | null
          api_password: string
          api_username: string
          auto_deliver_listings: boolean | null
          client_id: string
          created_at: string | null
          default_order_reference_format: string | null
          id: string
          updated_at: string | null
          white_label_domain: string | null
        }
        Insert: {
          allow_reference_editing?: boolean | null
          api_password: string
          api_username: string
          auto_deliver_listings?: boolean | null
          client_id: string
          created_at?: string | null
          default_order_reference_format?: string | null
          id?: string
          updated_at?: string | null
          white_label_domain?: string | null
        }
        Update: {
          allow_reference_editing?: boolean | null
          api_password?: string
          api_username?: string
          auto_deliver_listings?: boolean | null
          client_id?: string
          created_at?: string | null
          default_order_reference_format?: string | null
          id?: string
          updated_at?: string | null
          white_label_domain?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          date: string
          id: string
          order_number: string | null
          status: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          date?: string
          id?: string
          order_number?: string | null
          status: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          date?: string
          id?: string
          order_number?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "billing_summary"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      order_activities: {
        Row: {
          activity_type: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          metadata: Json | null
          order_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          metadata?: Json | null
          order_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_activities_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_communication: {
        Row: {
          created_at: string
          id: string
          is_internal: boolean
          message: string
          order_id: string
          recipient_role: string | null
          sender_id: string | null
          sender_role: string
          source: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_internal?: boolean
          message: string
          order_id: string
          recipient_role?: string | null
          sender_id?: string | null
          sender_role: string
          source: string
        }
        Update: {
          created_at?: string
          id?: string
          is_internal?: boolean
          message?: string
          order_id?: string
          recipient_role?: string | null
          sender_id?: string | null
          sender_role?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_communication_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_payouts: {
        Row: {
          amount: number
          created_at: string
          id: string
          name: string
          order_id: string
          paid_date: string | null
          product_id: string | null
          role: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          name: string
          order_id: string
          paid_date?: string | null
          product_id?: string | null
          role: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          name?: string
          order_id?: string
          paid_date?: string | null
          product_id?: string | null
          role?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_payouts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_payouts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "order_products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_products: {
        Row: {
          assigned_editor: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          order_id: string
          price: number
          product_id: string | null
          quantity: number
          status: string
          status_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_editor?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_id: string
          price: number
          product_id?: string | null
          quantity?: number
          status?: string
          status_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_editor?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_id?: string
          price?: number
          product_id?: string | null
          quantity?: number
          status?: string
          status_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "production_statuses"
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
          stripe_payment_id: string | null
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
          stripe_payment_id?: string | null
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
          stripe_payment_id?: string | null
          updated_at?: string
          zip?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          card_type: string
          client_id: string
          created_at: string
          expiry_date: string
          id: string
          is_default: boolean
          last_four: string
        }
        Insert: {
          card_type: string
          client_id: string
          created_at?: string
          expiry_date: string
          id?: string
          is_default?: boolean
          last_four: string
        }
        Update: {
          card_type?: string
          client_id?: string
          created_at?: string
          expiry_date?: string
          id?: string
          is_default?: boolean
          last_four?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "billing_summary"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "payment_methods_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      product_overrides: {
        Row: {
          client_id: string
          created_at: string
          discount: string
          id: string
          name: string
          override_price: number
          standard_price: number
        }
        Insert: {
          client_id: string
          created_at?: string
          discount: string
          id?: string
          name: string
          override_price: number
          standard_price: number
        }
        Update: {
          client_id?: string
          created_at?: string
          discount?: string
          id?: string
          name?: string
          override_price?: number
          standard_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_overrides_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "billing_summary"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "product_overrides_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      production_statuses: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          esoft_products: string[] | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          esoft_products?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          esoft_products?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string
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
      tax_settings: {
        Row: {
          created_at: string
          enabled: boolean
          fixed_amount: number | null
          id: string
          is_payment_fee: boolean
          name: string
          percentage: number | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          fixed_amount?: number | null
          id?: string
          is_payment_fee?: boolean
          name: string
          percentage?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          fixed_amount?: number | null
          id?: string
          is_payment_fee?: boolean
          name?: string
          percentage?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      billing_summary: {
        Row: {
          client_id: string | null
          client_name: string | null
          last_payment_amount: number | null
          last_payment_date: string | null
          outstanding_payment: number | null
          total_billed: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_coupons_table_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
