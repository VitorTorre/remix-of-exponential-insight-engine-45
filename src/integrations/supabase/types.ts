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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      antifragile_learning: {
        Row: {
          after_state: Json
          before_state: Json
          created_at: string | null
          id: string
          improvement_delta: number | null
          learning_type: string
          notes: string | null
          scenarios_affected: number[] | null
          stress_level_at_learning: number | null
          trigger_event: string
          volatility_at_learning: number | null
        }
        Insert: {
          after_state: Json
          before_state: Json
          created_at?: string | null
          id?: string
          improvement_delta?: number | null
          learning_type: string
          notes?: string | null
          scenarios_affected?: number[] | null
          stress_level_at_learning?: number | null
          trigger_event: string
          volatility_at_learning?: number | null
        }
        Update: {
          after_state?: Json
          before_state?: Json
          created_at?: string | null
          id?: string
          improvement_delta?: number | null
          learning_type?: string
          notes?: string | null
          scenarios_affected?: number[] | null
          stress_level_at_learning?: number | null
          trigger_event?: string
          volatility_at_learning?: number | null
        }
        Relationships: []
      }
      csv_exports: {
        Row: {
          created_at: string | null
          export_type: string
          file_content: string
          file_name: string
          filters_applied: Json | null
          id: string
          records_count: number | null
        }
        Insert: {
          created_at?: string | null
          export_type: string
          file_content: string
          file_name: string
          filters_applied?: Json | null
          id?: string
          records_count?: number | null
        }
        Update: {
          created_at?: string | null
          export_type?: string
          file_content?: string
          file_name?: string
          filters_applied?: Json | null
          id?: string
          records_count?: number | null
        }
        Relationships: []
      }
      market_memories: {
        Row: {
          actual_result: string | null
          antifragile_score: number | null
          asset: string
          candles_after: Json | null
          candles_before: Json
          created_at: string | null
          final_direction: string | null
          id: string
          is_shock_event: boolean | null
          learning_weight: number | null
          market_stress_level: number | null
          max_adverse: number | null
          max_favorable: number | null
          metadata: Json | null
          notes: string | null
          pattern_candle: Json
          scenario_id: string | null
          signal_generated: string | null
          timeframe: string
          volatility_index: number | null
        }
        Insert: {
          actual_result?: string | null
          antifragile_score?: number | null
          asset: string
          candles_after?: Json | null
          candles_before: Json
          created_at?: string | null
          final_direction?: string | null
          id?: string
          is_shock_event?: boolean | null
          learning_weight?: number | null
          market_stress_level?: number | null
          max_adverse?: number | null
          max_favorable?: number | null
          metadata?: Json | null
          notes?: string | null
          pattern_candle: Json
          scenario_id?: string | null
          signal_generated?: string | null
          timeframe: string
          volatility_index?: number | null
        }
        Update: {
          actual_result?: string | null
          antifragile_score?: number | null
          asset?: string
          candles_after?: Json | null
          candles_before?: Json
          created_at?: string | null
          final_direction?: string | null
          id?: string
          is_shock_event?: boolean | null
          learning_weight?: number | null
          market_stress_level?: number | null
          max_adverse?: number | null
          max_favorable?: number | null
          metadata?: Json | null
          notes?: string | null
          pattern_candle?: Json
          scenario_id?: string | null
          signal_generated?: string | null
          timeframe?: string
          volatility_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_memories_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "pattern_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      micro_reports: {
        Row: {
          ai_generated: boolean | null
          asset: string | null
          confidence_score: number | null
          created_at: string | null
          detailed_analysis: string | null
          id: string
          key_insights: Json | null
          patterns_identified: string[] | null
          performance_metrics: Json | null
          recommendations: string[] | null
          report_type: string
          scenarios_matched: number[] | null
          summary: string
          timeframe: string | null
          title: string
          volatility_analysis: Json | null
        }
        Insert: {
          ai_generated?: boolean | null
          asset?: string | null
          confidence_score?: number | null
          created_at?: string | null
          detailed_analysis?: string | null
          id?: string
          key_insights?: Json | null
          patterns_identified?: string[] | null
          performance_metrics?: Json | null
          recommendations?: string[] | null
          report_type: string
          scenarios_matched?: number[] | null
          summary: string
          timeframe?: string | null
          title: string
          volatility_analysis?: Json | null
        }
        Update: {
          ai_generated?: boolean | null
          asset?: string | null
          confidence_score?: number | null
          created_at?: string | null
          detailed_analysis?: string | null
          id?: string
          key_insights?: Json | null
          patterns_identified?: string[] | null
          performance_metrics?: Json | null
          recommendations?: string[] | null
          report_type?: string
          scenarios_matched?: number[] | null
          summary?: string
          timeframe?: string | null
          title?: string
          volatility_analysis?: Json | null
        }
        Relationships: []
      }
      pattern_scenarios: {
        Row: {
          accuracy: number | null
          ai_confidence: number | null
          context_description: string
          context_type: string
          created_at: string | null
          discovered_by_ai: boolean | null
          expected_direction: string
          expected_outcome: string
          id: string
          is_base_scenario: boolean | null
          metadata: Json | null
          pattern_name: string
          pattern_type: string
          probability_score: number | null
          scenario_number: number
          successful_occurrences: number | null
          total_occurrences: number | null
          updated_at: string | null
        }
        Insert: {
          accuracy?: number | null
          ai_confidence?: number | null
          context_description: string
          context_type: string
          created_at?: string | null
          discovered_by_ai?: boolean | null
          expected_direction: string
          expected_outcome: string
          id?: string
          is_base_scenario?: boolean | null
          metadata?: Json | null
          pattern_name: string
          pattern_type: string
          probability_score?: number | null
          scenario_number: number
          successful_occurrences?: number | null
          total_occurrences?: number | null
          updated_at?: string | null
        }
        Update: {
          accuracy?: number | null
          ai_confidence?: number | null
          context_description?: string
          context_type?: string
          created_at?: string | null
          discovered_by_ai?: boolean | null
          expected_direction?: string
          expected_outcome?: string
          id?: string
          is_base_scenario?: boolean | null
          metadata?: Json | null
          pattern_name?: string
          pattern_type?: string
          probability_score?: number | null
          scenario_number?: number
          successful_occurrences?: number | null
          total_occurrences?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          accuracy: number | null
          asset: string
          consecutive_errors: number | null
          created_at: string | null
          id: string
          losses: number | null
          needs_review: boolean | null
          timeframe: string
          total_operations: number | null
          wins: number | null
        }
        Insert: {
          accuracy?: number | null
          asset: string
          consecutive_errors?: number | null
          created_at?: string | null
          id?: string
          losses?: number | null
          needs_review?: boolean | null
          timeframe: string
          total_operations?: number | null
          wins?: number | null
        }
        Update: {
          accuracy?: number | null
          asset?: string
          consecutive_errors?: number | null
          created_at?: string | null
          id?: string
          losses?: number | null
          needs_review?: boolean | null
          timeframe?: string
          total_operations?: number | null
          wins?: number | null
        }
        Relationships: []
      }
      signal_analysis: {
        Row: {
          actual_exit_price: number | null
          actual_result: string | null
          asset: string
          closed_at: string | null
          confidence: number
          created_at: string | null
          entry_price: number
          id: string
          predicted_result: string
          profit_loss: number | null
          signal: string
          stop_loss: number | null
          strategies: Json
          take_profit: number | null
          timeframe: string
        }
        Insert: {
          actual_exit_price?: number | null
          actual_result?: string | null
          asset: string
          closed_at?: string | null
          confidence: number
          created_at?: string | null
          entry_price: number
          id?: string
          predicted_result: string
          profit_loss?: number | null
          signal: string
          stop_loss?: number | null
          strategies: Json
          take_profit?: number | null
          timeframe: string
        }
        Update: {
          actual_exit_price?: number | null
          actual_result?: string | null
          asset?: string
          closed_at?: string | null
          confidence?: number
          created_at?: string | null
          entry_price?: number
          id?: string
          predicted_result?: string
          profit_loss?: number | null
          signal?: string
          stop_loss?: number | null
          strategies?: Json
          take_profit?: number | null
          timeframe?: string
        }
        Relationships: []
      }
      strategy_performance: {
        Row: {
          accuracy: number | null
          asset: string
          avg_confidence: number | null
          correct_signals: number | null
          id: string
          last_updated: string | null
          strategy_name: string
          timeframe: string
          total_signals: number | null
          weight: number | null
        }
        Insert: {
          accuracy?: number | null
          asset: string
          avg_confidence?: number | null
          correct_signals?: number | null
          id?: string
          last_updated?: string | null
          strategy_name: string
          timeframe: string
          total_signals?: number | null
          weight?: number | null
        }
        Update: {
          accuracy?: number | null
          asset?: string
          avg_confidence?: number | null
          correct_signals?: number | null
          id?: string
          last_updated?: string | null
          strategy_name?: string
          timeframe?: string
          total_signals?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      system_annotations: {
        Row: {
          annotation_type: string
          content: string
          created_at: string | null
          id: string
          importance_level: number | null
          is_ai_generated: boolean | null
          related_memory_id: string | null
          related_report_id: string | null
          related_scenario_id: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          annotation_type: string
          content: string
          created_at?: string | null
          id?: string
          importance_level?: number | null
          is_ai_generated?: boolean | null
          related_memory_id?: string | null
          related_report_id?: string | null
          related_scenario_id?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          annotation_type?: string
          content?: string
          created_at?: string | null
          id?: string
          importance_level?: number | null
          is_ai_generated?: boolean | null
          related_memory_id?: string | null
          related_report_id?: string | null
          related_scenario_id?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_annotations_related_memory_id_fkey"
            columns: ["related_memory_id"]
            isOneToOne: false
            referencedRelation: "market_memories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_annotations_related_report_id_fkey"
            columns: ["related_report_id"]
            isOneToOne: false
            referencedRelation: "micro_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_annotations_related_scenario_id_fkey"
            columns: ["related_scenario_id"]
            isOneToOne: false
            referencedRelation: "pattern_scenarios"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
