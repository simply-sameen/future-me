/*
  # Create reminders table

  1. New Tables
    - `reminders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `goal_id` (uuid, optional foreign key to goals)
      - `title` (text)
      - `description` (text)
      - `reminder_date` (timestamp)
      - `is_completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `reminders` table
    - Add policy for users to read their own reminders
    - Add policy for users to create reminders
    - Add policy for users to update their own reminders
    - Add policy for users to delete their own reminders
*/

CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  goal_id uuid REFERENCES goals(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  reminder_date timestamptz NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX reminders_user_id_idx ON reminders(user_id);
CREATE INDEX reminders_goal_id_idx ON reminders(goal_id);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reminders"
  ON reminders FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
