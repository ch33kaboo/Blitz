/*
  # Create Words Table for Blitz Vocabulary Trainer

  1. New Tables
    - `words`
      - `id` (uuid, primary key) - Unique identifier for each word
      - `word` (text) - The German word or vocabulary term
      - `meaning` (text) - Translation, definition, or explanation
      - `times_shown` (integer, default 0) - How many times word was shown in training
      - `times_knew` (integer, default 0) - How many times user clicked "I knew it"
      - `times_didnt_know` (integer, default 0) - How many times user clicked "I didn't know it"
      - `times_not_sure` (integer, default 0) - How many times user clicked "Not sure"
      - `last_seen` (timestamptz) - Last time word was shown in training
      - `created_at` (timestamptz, default now()) - When word was added

  2. Security
    - Enable RLS on `words` table
    - Add policy allowing all operations for now (public app, no auth required)

  ## Notes
  - Stats tracking enables spaced repetition algorithm
  - Words with higher `times_didnt_know` will appear more frequently
  - Words never shown (times_shown = 0) have highest priority
*/

CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL,
  meaning text NOT NULL,
  times_shown integer DEFAULT 0 NOT NULL,
  times_knew integer DEFAULT 0 NOT NULL,
  times_didnt_know integer DEFAULT 0 NOT NULL,
  times_not_sure integer DEFAULT 0 NOT NULL,
  last_seen timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to words"
  ON words
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
