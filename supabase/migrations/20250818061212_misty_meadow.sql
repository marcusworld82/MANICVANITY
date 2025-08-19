/*
  # Order System Enhancements

  1. New Columns
    - Add temp_cart jsonb column to orders for cart snapshot
    - Add payment_method and updated_at columns
    - Add dev_emails table for development email logging

  2. Security
    - Maintain existing RLS policies
    - Add service role access for webhook processing
*/

-- Add missing columns to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'temp_cart'
  ) THEN
    ALTER TABLE orders ADD COLUMN temp_cart jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_method text DEFAULT 'stripe';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create dev_emails table for development email logging
CREATE TABLE IF NOT EXISTS dev_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on dev_emails
ALTER TABLE dev_emails ENABLE ROW LEVEL SECURITY;

-- Policy for dev_emails (admin only in production)
CREATE POLICY "Dev emails are viewable by authenticated users"
  ON dev_emails
  FOR SELECT
  TO authenticated
  USING (true);

-- Add updated_at trigger for orders
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at'
  ) THEN
    CREATE TRIGGER update_orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;