-- supabase/migrations/add_products_from_google_sheet.sql
-- Run this in Supabase SQL Editor.
-- It creates a 'products' table and an update trigger.
-- Then you can paste the INSERTs created by csv_to_supabase_sql.py

-- Enable required extensions (uuid + cryptographic functions)
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  currency text not null default 'USD',
  category text,
  brand text,
  image_url text,
  active boolean not null default true,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful index for search
create index if not exists products_name_trgm_idx on public.products using gin (name gin_trgm_ops);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_idx on public.products (active);

-- Update 'updated_at' on changes
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- Optional: RLS (row-level security). Turn on and add a simple policy if you need it.
-- alter table public.products enable row level security;
-- create policy "Public read products" on public.products for select using (true);

-- NOTE: Run INSERT statements after this block. Use the output from csv_to_supabase_sql.py
