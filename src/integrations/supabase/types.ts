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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_deletions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          profile_snapshot: Json
          purged_at: string | null
          reason: string | null
          requested_at: string
          scheduled_purge_at: string
          stats_snapshot: Json
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          profile_snapshot?: Json
          purged_at?: string | null
          reason?: string | null
          requested_at?: string
          scheduled_purge_at: string
          stats_snapshot?: Json
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          profile_snapshot?: Json
          purged_at?: string | null
          reason?: string | null
          requested_at?: string
          scheduled_purge_at?: string
          stats_snapshot?: Json
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          check_in: string
          check_out: string
          created_at: string
          guest_id: string
          host_id: string
          id: string
          listing_id: string
          message: string | null
          metadata: Json | null
          payment_provider: string | null
          payment_reference: string | null
          payment_status: string
          status: string | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string
          guest_id: string
          host_id: string
          id?: string
          listing_id: string
          message?: string | null
          metadata?: Json | null
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string
          guest_id?: string
          host_id?: string
          id?: string
          listing_id?: string
          message?: string | null
          metadata?: Json | null
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      help_request_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          request_id: string
          sender_id: string | null
          sender_role: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          request_id: string
          sender_id?: string | null
          sender_role: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          request_id?: string
          sender_id?: string | null
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_request_messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "help_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      help_requests: {
        Row: {
          area: string
          created_at: string
          details: string | null
          estimated_rate: number | null
          helper_id: string | null
          helper_name: string | null
          helper_ref: string | null
          id: string
          metadata: Json | null
          service: string
          status: string
          updated_at: string
          urgent: boolean
          user_id: string
        }
        Insert: {
          area: string
          created_at?: string
          details?: string | null
          estimated_rate?: number | null
          helper_id?: string | null
          helper_name?: string | null
          helper_ref?: string | null
          id?: string
          metadata?: Json | null
          service: string
          status?: string
          updated_at?: string
          urgent?: boolean
          user_id: string
        }
        Update: {
          area?: string
          created_at?: string
          details?: string | null
          estimated_rate?: number | null
          helper_id?: string | null
          helper_name?: string | null
          helper_ref?: string | null
          id?: string
          metadata?: Json | null
          service?: string
          status?: string
          updated_at?: string
          urgent?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_requests_helper_ref_fkey"
            columns: ["helper_ref"]
            isOneToOne: false
            referencedRelation: "helpers"
            referencedColumns: ["id"]
          },
        ]
      }
      helpers: {
        Row: {
          active: boolean
          avatar_url: string | null
          background_checked: boolean
          bio: string | null
          city: string
          created_at: string
          district: string
          hourly_rate: number
          id: string
          id_verified: boolean
          jobs_done: number
          languages: string[]
          name: string
          rating: number
          response_min: number
          reviews_count: number
          services: string[]
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          background_checked?: boolean
          bio?: string | null
          city: string
          created_at?: string
          district: string
          hourly_rate?: number
          id?: string
          id_verified?: boolean
          jobs_done?: number
          languages?: string[]
          name: string
          rating?: number
          response_min?: number
          reviews_count?: number
          services?: string[]
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          background_checked?: boolean
          bio?: string | null
          city?: string
          created_at?: string
          district?: string
          hourly_rate?: number
          id?: string
          id_verified?: boolean
          jobs_done?: number
          languages?: string[]
          name?: string
          rating?: number
          response_min?: number
          reviews_count?: number
          services?: string[]
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          address: string | null
          amenities: string[] | null
          area_sqm: number | null
          baths: number | null
          beds: number | null
          bookings_count: number | null
          city: string | null
          created_at: string
          deposit: number | null
          deposit_display: string | null
          description: string | null
          district: string | null
          guests: number | null
          host_id: string
          host_name: string | null
          host_response: string | null
          id: string
          images: string[] | null
          latitude: number | null
          location_label: string | null
          longitude: number | null
          metadata: Json | null
          nearby_subway: string | null
          nearby_university: string | null
          no_deposit: boolean | null
          period: string | null
          price: number
          price_display: string | null
          rating: number | null
          status: string | null
          tag_colors: boolean[] | null
          tags: string[] | null
          title: string
          type: string
          university_area: string | null
          updated_at: string
          views_count: number | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          area_sqm?: number | null
          baths?: number | null
          beds?: number | null
          bookings_count?: number | null
          city?: string | null
          created_at?: string
          deposit?: number | null
          deposit_display?: string | null
          description?: string | null
          district?: string | null
          guests?: number | null
          host_id: string
          host_name?: string | null
          host_response?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location_label?: string | null
          longitude?: number | null
          metadata?: Json | null
          nearby_subway?: string | null
          nearby_university?: string | null
          no_deposit?: boolean | null
          period?: string | null
          price?: number
          price_display?: string | null
          rating?: number | null
          status?: string | null
          tag_colors?: boolean[] | null
          tags?: string[] | null
          title: string
          type: string
          university_area?: string | null
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          area_sqm?: number | null
          baths?: number | null
          beds?: number | null
          bookings_count?: number | null
          city?: string | null
          created_at?: string
          deposit?: number | null
          deposit_display?: string | null
          description?: string | null
          district?: string | null
          guests?: number | null
          host_id?: string
          host_name?: string | null
          host_response?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location_label?: string | null
          longitude?: number | null
          metadata?: Json | null
          nearby_subway?: string | null
          nearby_university?: string | null
          no_deposit?: boolean | null
          period?: string | null
          price?: number
          price_display?: string | null
          rating?: number | null
          status?: string | null
          tag_colors?: boolean[] | null
          tags?: string[] | null
          title?: string
          type?: string
          university_area?: string | null
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          metadata: Json | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          booking_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          deleted_at: string | null
          deletion_scheduled_at: string | null
          display_name: string | null
          id: string
          metadata: Json | null
          phone: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          deletion_scheduled_at?: string | null
          display_name?: string | null
          id?: string
          metadata?: Json | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          deletion_scheduled_at?: string | null
          display_name?: string | null
          id?: string
          metadata?: Json | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          host_id: string
          id: string
          listing_id: string
          metadata: Json | null
          rating: number
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          host_id: string
          id?: string
          listing_id: string
          metadata?: Json | null
          rating: number
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          host_id?: string
          id?: string
          listing_id?: string
          metadata?: Json | null
          rating?: number
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          account_holder: string | null
          account_number: string | null
          bank_name: string | null
          business_number: string | null
          created_at: string
          host_id: string
          id: string
          metadata: Json | null
          settlement_day: number | null
          updated_at: string
        }
        Insert: {
          account_holder?: string | null
          account_number?: string | null
          bank_name?: string | null
          business_number?: string | null
          created_at?: string
          host_id: string
          id?: string
          metadata?: Json | null
          settlement_day?: number | null
          updated_at?: string
        }
        Update: {
          account_holder?: string | null
          account_number?: string | null
          bank_name?: string | null
          business_number?: string | null
          created_at?: string
          host_id?: string
          id?: string
          metadata?: Json | null
          settlement_day?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cancel_account_deletion:
        | { Args: never; Returns: boolean }
        | { Args: { _user_id?: string }; Returns: boolean }
      get_my_phone: { Args: never; Returns: string }
      request_account_deletion:
        | {
            Args: { _reason?: string }
            Returns: {
              cancelled_at: string | null
              created_at: string
              display_name: string | null
              email: string | null
              id: string
              profile_snapshot: Json
              purged_at: string | null
              reason: string | null
              requested_at: string
              scheduled_purge_at: string
              stats_snapshot: Json
              user_id: string
            }
            SetofOptions: {
              from: "*"
              to: "account_deletions"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { _reason?: string; _user_id?: string }
            Returns: {
              cancelled_at: string | null
              created_at: string
              display_name: string | null
              email: string | null
              id: string
              profile_snapshot: Json
              purged_at: string | null
              reason: string | null
              requested_at: string
              scheduled_purge_at: string
              stats_snapshot: Json
              user_id: string
            }
            SetofOptions: {
              from: "*"
              to: "account_deletions"
              isOneToOne: true
              isSetofReturn: false
            }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
