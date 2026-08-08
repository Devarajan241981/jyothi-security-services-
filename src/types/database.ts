// Hand-written to match supabase/migrations/20260714000000_init.sql.
// Regenerate with `supabase gen types typescript` once the project is linked,
// and keep this file in sync with any future migrations.

export type EnquiryStatus = "new" | "contacted" | "converted" | "closed";
export type ApplicationStatus =
  | "new"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "hired";
export type GuardStatus = "active" | "inactive" | "on_leave";
export type GuardGender = "male" | "female" | "other";
export type ShiftType = "day" | "night" | "both";
export type ClientStatus = "active" | "inactive";
export type AssignmentStatus = "active" | "completed" | "cancelled";
export type AttendanceStatus = "present" | "absent" | "leave" | "late";
export type PaymentStatus = "pending" | "paid";
export type CalendarEventType = "assignment" | "salary" | "meeting" | "important";
export type NotificationType = "new_enquiry" | "new_application";

export type Database = {
  public: {
    Tables: {
      enquiries: {
        Row: {
          id: string;
          created_at: string;
          premises_type: string;
          company_name: string;
          contact_person: string;
          phone: string;
          email: string | null;
          location: string;
          guard_count: number;
          guard_type: string | null;
          preferred_age: string | null;
          languages: string[];
          shift: ShiftType | null;
          additional_requirements: string | null;
          status: EnquiryStatus;
          email_sent: boolean;
          email_error: string | null;
          deleted_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["enquiries"]["Row"]> & {
          premises_type: string;
          company_name: string;
          contact_person: string;
          phone: string;
          location: string;
        };
        Update: Partial<Database["public"]["Tables"]["enquiries"]["Row"]>;
        Relationships: [];
      };
      job_applications: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          age: number;
          phone: string;
          address: string;
          experience: string | null;
          languages: string[];
          aadhaar_path: string | null;
          status: ApplicationStatus;
          email_sent: boolean;
          email_error: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["job_applications"]["Row"]> & {
          full_name: string;
          age: number;
          phone: string;
          address: string;
        };
        Update: Partial<Database["public"]["Tables"]["job_applications"]["Row"]>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          type: string;
          contact_person: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          location: string | null;
          contract_start: string | null;
          contract_end: string | null;
          status: ClientStatus;
          notes: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["clients"]["Row"]> & {
          name: string;
          type: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Row"]>;
        Relationships: [];
      };
      guards: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          guard_code: string;
          full_name: string;
          phone: string;
          gender: GuardGender;
          age: number | null;
          languages: string[];
          experience_years: number | null;
          address: string | null;
          aadhaar_number: string | null;
          aadhaar_path: string | null;
          photo_path: string | null;
          joining_date: string;
          salary: number | null;
          shift: ShiftType;
          current_client_id: string | null;
          current_location: string | null;
          status: GuardStatus;
        };
        Insert: Partial<Database["public"]["Tables"]["guards"]["Row"]> & {
          guard_code: string;
          full_name: string;
          phone: string;
        };
        Update: Partial<Database["public"]["Tables"]["guards"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "guards_current_client_id_fkey";
            columns: ["current_client_id"];
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      assignments: {
        Row: {
          id: string;
          created_at: string;
          guard_id: string;
          client_id: string;
          shift: ShiftType;
          location: string | null;
          start_date: string;
          end_date: string | null;
          status: AssignmentStatus;
        };
        Insert: Partial<Database["public"]["Tables"]["assignments"]["Row"]> & {
          guard_id: string;
          client_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["assignments"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "assignments_guard_id_fkey";
            columns: ["guard_id"];
            referencedRelation: "guards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assignments_client_id_fkey";
            columns: ["client_id"];
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      attendance: {
        Row: {
          id: string;
          created_at: string;
          guard_id: string;
          attendance_date: string;
          status: AttendanceStatus;
          notes: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["attendance"]["Row"]> & {
          guard_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["attendance"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "attendance_guard_id_fkey";
            columns: ["guard_id"];
            referencedRelation: "guards";
            referencedColumns: ["id"];
          },
        ];
      };
      salaries: {
        Row: {
          id: string;
          created_at: string;
          guard_id: string;
          salary_month: string;
          base_salary: number;
          bonus: number;
          deduction: number;
          net_salary: number;
          payment_status: PaymentStatus;
          payment_date: string | null;
          receipt_number: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["salaries"]["Row"]> & {
          guard_id: string;
          salary_month: string;
        };
        Update: Partial<Database["public"]["Tables"]["salaries"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "salaries_guard_id_fkey";
            columns: ["guard_id"];
            referencedRelation: "guards";
            referencedColumns: ["id"];
          },
        ];
      };
      calendar_events: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string | null;
          event_date: string;
          event_type: CalendarEventType;
        };
        Insert: Partial<Database["public"]["Tables"]["calendar_events"]["Row"]> & {
          title: string;
          event_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["calendar_events"]["Row"]>;
        Relationships: [];
      };
      gallery_images: {
        Row: {
          id: string;
          created_at: string;
          image_path: string;
          category: string;
          caption: string | null;
          sort_order: number;
          is_published: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["gallery_images"]["Row"]> & {
          image_path: string;
          category: string;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_images"]["Row"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          role: string;
          organization: string | null;
          quote: string;
          rating: number;
          avatar_path: string | null;
          sort_order: number;
          is_published: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["testimonials"]["Row"]> & {
          name: string;
          role: string;
          quote: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          updated_at: string;
          company_name: string;
          logo_path: string | null;
          contact_numbers: string[];
          emergency_number: string | null;
          emails: string[];
          whatsapp_number: string | null;
          office_address: string | null;
          social_media: Record<string, string>;
          hero_images: string[];
          supported_languages: string[];
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          created_at: string;
          type: NotificationType;
          title: string;
          message: string | null;
          link: string | null;
          is_read: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          type: NotificationType;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      submit_enquiry: {
        Args: {
          p_premises_type: string;
          p_company_name: string;
          p_contact_person: string;
          p_phone: string;
          p_location: string;
          p_guard_count: number;
          p_guard_type: string;
          p_languages: string[];
          p_shift: string;
          p_email?: string | null;
          p_preferred_age?: string | null;
          p_additional_requirements?: string | null;
        };
        Returns: string;
      };
      submit_job_application: {
        Args: {
          p_full_name: string;
          p_age: number;
          p_phone: string;
          p_address: string;
          p_experience?: string | null;
          p_languages?: string[];
          p_aadhaar_path?: string | null;
        };
        Returns: string;
      };
    };
    Enums: {
      enquiry_status: EnquiryStatus;
      application_status: ApplicationStatus;
      guard_status: GuardStatus;
      guard_gender: GuardGender;
      shift_type: ShiftType;
      client_status: ClientStatus;
      assignment_status: AssignmentStatus;
      attendance_status: AttendanceStatus;
      payment_status: PaymentStatus;
      calendar_event_type: CalendarEventType;
      notification_type: NotificationType;
    };
    CompositeTypes: Record<string, never>;
  };
};
