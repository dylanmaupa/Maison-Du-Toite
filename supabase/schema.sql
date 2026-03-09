-- ═══════════════════════════════════════════════════════════════════════════════
-- MAISON DU TOITE — Supabase Schema
-- Run this in your Supabase SQL Editor once to create all tables + policies.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enums ─────────────────────────────────────────────────────────────────────
create type availability_status as enum ('in_stock', 'preorder', 'sold_out');
create type order_status as enum (
  'pending_cod', 'pending_payment', 'paid', 'confirmed',
  'preparing', 'ready', 'delivered', 'cancelled', 'failed'
);
create type payment_method_type as enum ('cod', 'stripe', 'paynow');
create type delivery_method_type as enum ('delivery', 'pickup');

-- ── categories ────────────────────────────────────────────────────────────────
create table categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  image_url   text,
  display_order int default 0,
  created_at  timestamptz default now()
);

-- ── products ──────────────────────────────────────────────────────────────────
create table products (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  slug           text not null unique,
  description    text,
  price          numeric(10,2) not null,
  category_id    uuid references categories(id) on delete set null,
  featured       boolean default false,
  availability   availability_status default 'in_stock',
  lead_time      text,                          -- e.g. "24 hours"
  display_order  int default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ── product_images ────────────────────────────────────────────────────────────
create table product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references products(id) on delete cascade,
  image_url   text not null,
  sort_order  int default 0
);

-- ── orders ────────────────────────────────────────────────────────────────────
create table orders (
  id              uuid primary key default uuid_generate_v4(),
  order_number    text not null unique,          -- MDT-000123
  customer_name   text not null,
  phone           text not null,
  email           text not null,
  address         text,                          -- null for pickup
  delivery_method delivery_method_type not null,
  preferred_date  date,
  notes           text,
  payment_method  payment_method_type not null,
  payment_id      text,                          -- Stripe session/payment id
  order_status    order_status default 'pending_cod',
  delivery_fee    numeric(10,2) default 0,
  subtotal        numeric(10,2) not null,
  total           numeric(10,2) not null,
  internal_notes  text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── order_items ───────────────────────────────────────────────────────────────
create table order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid references orders(id) on delete cascade,
  product_id  uuid references products(id) on delete set null,
  product_name  text not null,                  -- snapshot at time of order
  quantity    int not null,
  price       numeric(10,2) not null            -- unit price at time of order
);

-- ── delivery_zones ────────────────────────────────────────────────────────────
create table delivery_zones (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  fee             numeric(10,2) not null default 0,
  free_threshold  numeric(10,2),               -- null = never free
  display_order   int default 0
);

-- ── settings ──────────────────────────────────────────────────────────────────
create table settings (
  key   text primary key,
  value text
);

-- Default settings
insert into settings (key, value) values
  ('whatsapp_order_number',   ''),
  ('whatsapp_general_number', ''),
  ('announcement_text',       ''),
  ('announcement_active',     'false'),
  ('instagram_url',           ''),
  ('facebook_url',            ''),
  ('tiktok_url',              '');

-- ── Sequence for order numbers ────────────────────────────────────────────────
create sequence order_number_seq start 1 increment 1;

-- Function to generate MDT-XXXXXX
create or replace function generate_order_number()
returns text as $$
  select 'MDT-' || lpad(nextval('order_number_seq')::text, 6, '0');
$$ language sql;

-- ── updated_at triggers ───────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function set_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();


-- ═══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════════

alter table categories      enable row level security;
alter table products        enable row level security;
alter table product_images  enable row level security;
alter table orders          enable row level security;
alter table order_items     enable row level security;
alter table delivery_zones  enable row level security;
alter table settings        enable row level security;

-- ── Public: read published products & categories ──────────────────────────────
create policy "Public can read categories"
  on categories for select using (true);

create policy "Public can read products"
  on products for select using (availability != 'sold_out' or availability = 'sold_out');
  -- All products visible (shop shows sold-out badge); filter in app if needed

create policy "Public can read product_images"
  on product_images for select using (true);

create policy "Public can read delivery_zones"
  on delivery_zones for select using (true);

create policy "Public can read settings"
  on settings for select using (true);

-- ── Public: insert orders (anyone can place an order) ─────────────────────────
create policy "Public can insert orders"
  on orders for insert with check (true);

create policy "Public can insert order_items"
  on order_items for insert with check (true);

-- ── Authenticated admin: full access to everything ───────────────────────────
create policy "Admin full access to categories"
  on categories for all using (auth.role() = 'authenticated');

create policy "Admin full access to products"
  on products for all using (auth.role() = 'authenticated');

create policy "Admin full access to product_images"
  on product_images for all using (auth.role() = 'authenticated');

create policy "Admin full access to orders"
  on orders for all using (auth.role() = 'authenticated');

create policy "Admin full access to order_items"
  on order_items for all using (auth.role() = 'authenticated');

create policy "Admin full access to delivery_zones"
  on delivery_zones for all using (auth.role() = 'authenticated');

create policy "Admin full access to settings"
  on settings for all using (auth.role() = 'authenticated');


-- ═══════════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════════════════════
-- Run this in the Supabase Dashboard → Storage section, or via SQL:

insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict do nothing;

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admin upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
