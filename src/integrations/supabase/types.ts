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
      amenity: {
        Row: {
          amenity_id: number
          amenity_name: string | null
          availability_status: string | null
          booking_fees: number | null
          booking_required: boolean | null
          operating_hours: string | null
          staff_id: number | null
        }
        Insert: {
          amenity_id?: number
          amenity_name?: string | null
          availability_status?: string | null
          booking_fees?: number | null
          booking_required?: boolean | null
          operating_hours?: string | null
          staff_id?: number | null
        }
        Update: {
          amenity_id?: number
          amenity_name?: string | null
          availability_status?: string | null
          booking_fees?: number | null
          booking_required?: boolean | null
          operating_hours?: string | null
          staff_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "amenity_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["staff_id"]
          },
        ]
      }
      apartment: {
        Row: {
          apartment_id: number
          apartment_number: string | null
          apartment_status: string | null
          block: string | null
          floor_number: number | null
          owner_contact: string | null
          owner_name: string | null
          wing_id: number | null
        }
        Insert: {
          apartment_id?: number
          apartment_number?: string | null
          apartment_status?: string | null
          block?: string | null
          floor_number?: number | null
          owner_contact?: string | null
          owner_name?: string | null
          wing_id?: number | null
        }
        Update: {
          apartment_id?: number
          apartment_number?: string | null
          apartment_status?: string | null
          block?: string | null
          floor_number?: number | null
          owner_contact?: string | null
          owner_name?: string | null
          wing_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "apartment_wing_id_fkey"
            columns: ["wing_id"]
            isOneToOne: false
            referencedRelation: "wing"
            referencedColumns: ["wing_id"]
          },
        ]
      }
      banking: {
        Row: {
          amount: number | null
          banking_status: string | null
          payment_method: string | null
          purpose: string | null
          resident_id: number | null
          transaction_date: string | null
          transaction_id: number
        }
        Insert: {
          amount?: number | null
          banking_status?: string | null
          payment_method?: string | null
          purpose?: string | null
          resident_id?: number | null
          transaction_date?: string | null
          transaction_id?: number
        }
        Update: {
          amount?: number | null
          banking_status?: string | null
          payment_method?: string | null
          purpose?: string | null
          resident_id?: number | null
          transaction_date?: string | null
          transaction_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "banking_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "resident"
            referencedColumns: ["resident_id"]
          },
        ]
      }
      complaint: {
        Row: {
          complaint_id: number
          complaint_status: string | null
          complaint_text: string | null
          date_raised: string | null
          resident_id: number | null
          subject: string | null
        }
        Insert: {
          complaint_id?: number
          complaint_status?: string | null
          complaint_text?: string | null
          date_raised?: string | null
          resident_id?: number | null
          subject?: string | null
        }
        Update: {
          complaint_id?: number
          complaint_status?: string | null
          complaint_text?: string | null
          date_raised?: string | null
          resident_id?: number | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaint_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "resident"
            referencedColumns: ["resident_id"]
          },
        ]
      }
      delivery_records: {
        Row: {
          courier_company_name: string | null
          delivery_address: string | null
          delivery_date: string | null
          delivery_id: number
          delivery_status: string | null
          received_by: string | null
          resident_id: number | null
        }
        Insert: {
          courier_company_name?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          delivery_id?: number
          delivery_status?: string | null
          received_by?: string | null
          resident_id?: number | null
        }
        Update: {
          courier_company_name?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          delivery_id?: number
          delivery_status?: string | null
          received_by?: string | null
          resident_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_records_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "resident"
            referencedColumns: ["resident_id"]
          },
        ]
      }
      housekeeping: {
        Row: {
          cleaning_date: string | null
          cleaning_status: string | null
          housekeeping_id: number
          resident_id: number | null
          service_type: string | null
          staff_id: number | null
        }
        Insert: {
          cleaning_date?: string | null
          cleaning_status?: string | null
          housekeeping_id?: number
          resident_id?: number | null
          service_type?: string | null
          staff_id?: number | null
        }
        Update: {
          cleaning_date?: string | null
          cleaning_status?: string | null
          housekeeping_id?: number
          resident_id?: number | null
          service_type?: string | null
          staff_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "housekeeping_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "resident"
            referencedColumns: ["resident_id"]
          },
          {
            foreignKeyName: "housekeeping_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["staff_id"]
          },
        ]
      }
      maintenance: {
        Row: {
          amount: number | null
          apartment_id: number | null
          due_date: string | null
          maintenance_id: number
          paid_status: string | null
          payment_date: string | null
          resident_id: number | null
        }
        Insert: {
          amount?: number | null
          apartment_id?: number | null
          due_date?: string | null
          maintenance_id?: number
          paid_status?: string | null
          payment_date?: string | null
          resident_id?: number | null
        }
        Update: {
          amount?: number | null
          apartment_id?: number | null
          due_date?: string | null
          maintenance_id?: number
          paid_status?: string | null
          payment_date?: string | null
          resident_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartment"
            referencedColumns: ["apartment_id"]
          },
          {
            foreignKeyName: "maintenance_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "resident"
            referencedColumns: ["resident_id"]
          },
        ]
      }
      notice_board: {
        Row: {
          message: string | null
          notice_id: number
          posted_by: string | null
          posted_date: string | null
          title: string | null
        }
        Insert: {
          message?: string | null
          notice_id?: number
          posted_by?: string | null
          posted_date?: string | null
          title?: string | null
        }
        Update: {
          message?: string | null
          notice_id?: number
          posted_by?: string | null
          posted_date?: string | null
          title?: string | null
        }
        Relationships: []
      }
      parking: {
        Row: {
          apartment_id: number | null
          end_time: string | null
          parking_id: number
          parking_status: string | null
          parking_type: string | null
          resident_id: number | null
          slot_number: string | null
          start_time: string | null
          vehicle_number: string | null
          vehicle_type: string | null
        }
        Insert: {
          apartment_id?: number | null
          end_time?: string | null
          parking_id?: number
          parking_status?: string | null
          parking_type?: string | null
          resident_id?: number | null
          slot_number?: string | null
          start_time?: string | null
          vehicle_number?: string | null
          vehicle_type?: string | null
        }
        Update: {
          apartment_id?: number | null
          end_time?: string | null
          parking_id?: number
          parking_status?: string | null
          parking_type?: string | null
          resident_id?: number | null
          slot_number?: string | null
          start_time?: string | null
          vehicle_number?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parking_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartment"
            referencedColumns: ["apartment_id"]
          },
          {
            foreignKeyName: "parking_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "resident"
            referencedColumns: ["resident_id"]
          },
        ]
      }
      resident: {
        Row: {
          apartment_id: number | null
          contact_number: string | null
          email: string | null
          joining_date: string | null
          name: string | null
          resident_id: number
          status: string | null
        }
        Insert: {
          apartment_id?: number | null
          contact_number?: string | null
          email?: string | null
          joining_date?: string | null
          name?: string | null
          resident_id?: number
          status?: string | null
        }
        Update: {
          apartment_id?: number | null
          contact_number?: string | null
          email?: string | null
          joining_date?: string | null
          name?: string | null
          resident_id?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resident_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartment"
            referencedColumns: ["apartment_id"]
          },
        ]
      }
      staff: {
        Row: {
          contact_number: string | null
          joining_date: string | null
          name: string | null
          role: string | null
          salary: number | null
          staff_id: number
        }
        Insert: {
          contact_number?: string | null
          joining_date?: string | null
          name?: string | null
          role?: string | null
          salary?: number | null
          staff_id?: number
        }
        Update: {
          contact_number?: string | null
          joining_date?: string | null
          name?: string | null
          role?: string | null
          salary?: number | null
          staff_id?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          password_hash: string
          phone: string | null
          role: string
          user_id: number
          username: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          password_hash: string
          phone?: string | null
          role: string
          user_id?: number
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          password_hash?: string
          phone?: string | null
          role?: string
          user_id?: number
          username?: string
        }
        Relationships: []
      }
      wing: {
        Row: {
          total_apartments: number | null
          total_floors: number | null
          wing_id: number
          wing_name: string | null
        }
        Insert: {
          total_apartments?: number | null
          total_floors?: number | null
          wing_id?: number
          wing_name?: string | null
        }
        Update: {
          total_apartments?: number | null
          total_floors?: number | null
          wing_id?: number
          wing_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
