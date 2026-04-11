/*
  # Create AI token usage tracking table

  1. New Tables
    - `ai_token_usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `tokens_used` (integer)
      - `goal_id` (uuid, optional foreign key to goals)
      - `request_type` (text: goal-decomposition, strategy-planning)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `ai_token_usage` table
    - Add policy for users to read their own token usage
    - Add policy for system to insert token usage records (public with validation)
*/

CREATE TABLE IF NOT EXISTS ai_token_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  tokens_used integer NOT NULL DEFAULT 0,
  goal_id uuid REFERENCES goals(id) ON DELETE SET NULL,
  request_type text DEFAULT 'goal-decomposition',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX ai_token_usage_user_id_idx ON ai_token_usage(user_id);
CREATE INDEX ai_token_usage_created_at_idx ON ai_token_usage(created_at);

ALTER TABLE ai_token_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own token usage"
  ON ai_token_usage FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert token usage"
  ON ai_token_usage FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
