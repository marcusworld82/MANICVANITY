/*
  # Content Command Center Schema

  1. New Tables
    - `content_pieces` - Main content items with status workflow
    - `content_tags` - Reusable tags for content categorization  
    - `content_piece_tags` - Many-to-many relationship for content tagging
    - `content_ideas` - Idea backlog with priority and archival

  2. Security
    - Enable RLS on all tables
    - Public read access for published/scheduled content
    - Authenticated users can manage ideas and content pieces
*/

-- Content pieces (main content workflow)
CREATE TABLE IF NOT EXISTS content_pieces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  platform text NOT NULL CHECK (platform IN ('YouTube', 'LinkedIn', 'Instagram', 'Blog', 'Email')),
  status text NOT NULL DEFAULT 'Backlog' CHECK (status IN ('Backlog', 'Draft', 'Review', 'Scheduled', 'Published')),
  planned_at timestamptz,
  published_at timestamptz,
  thumbnail_url text,
  brief text,
  cta text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content tags
CREATE TABLE IF NOT EXISTS content_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);

-- Content piece tags (many-to-many)
CREATE TABLE IF NOT EXISTS content_piece_tags (
  piece_id uuid REFERENCES content_pieces(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES content_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (piece_id, tag_id)
);

-- Content ideas
CREATE TABLE IF NOT EXISTS content_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  notes text,
  priority integer DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),
  created_at timestamptz DEFAULT now(),
  archived boolean DEFAULT false
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_pieces_status ON content_pieces(status);
CREATE INDEX IF NOT EXISTS idx_content_pieces_platform ON content_pieces(platform);
CREATE INDEX IF NOT EXISTS idx_content_pieces_planned_at ON content_pieces(planned_at);
CREATE INDEX IF NOT EXISTS idx_content_ideas_archived ON content_ideas(archived);

-- Enable RLS
ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_piece_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Content pieces: public read for published/scheduled, auth users can manage
CREATE POLICY "Public can read published content"
  ON content_pieces
  FOR SELECT
  TO anon, authenticated
  USING (status IN ('Published', 'Scheduled'));

CREATE POLICY "Authenticated users can manage content pieces"
  ON content_pieces
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Content tags: public read, auth users can manage
CREATE POLICY "Public can read content tags"
  ON content_tags
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage content tags"
  ON content_tags
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Content piece tags: follow content pieces permissions
CREATE POLICY "Public can read content piece tags"
  ON content_piece_tags
  FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM content_pieces 
    WHERE id = piece_id AND status IN ('Published', 'Scheduled')
  ));

CREATE POLICY "Authenticated users can manage content piece tags"
  ON content_piece_tags
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Content ideas: auth users only
CREATE POLICY "Authenticated users can manage ideas"
  ON content_ideas
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update trigger for content_pieces
CREATE OR REPLACE FUNCTION update_content_pieces_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_pieces_updated_at
  BEFORE UPDATE ON content_pieces
  FOR EACH ROW
  EXECUTE FUNCTION update_content_pieces_updated_at();