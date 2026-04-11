/*
  # Create goals table

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `priority` (text: low, medium, high)
      - `status` (text: not-started, in-progress, completed)
      - `target_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `goals` table
    - Add policy for users to read their own goals
    - Add policy for users to create goals
    - Add policy for users to update their own goals
    - Add policy for users to delete their own goals
*/

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text,
  priority text DEFAULT 'medium',
  status text DEFAULT 'not-started',
  target_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX goals_user_id_idx ON goals(user_id);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
