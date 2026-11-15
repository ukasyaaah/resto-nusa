-- =============================================================
-- Schema: users (profil + role), categories, products
-- Jalankan di Supabase SQL Editor (atau simpan sebagai migration)
-- Catatan: password TIDAK ada di sini. Disimpan (bcrypt hash) oleh
-- Supabase Auth di auth.users.encrypted_password.
-- =============================================================

-- 0. Extension: moddatetime = trigger updated_at bawaan (tanpa fungsi custom)
create extension if not exists moddatetime with schema extensions;

-- 1. Enum role
create type public.user_role as enum ('admin', 'user');

-- 2. Tabel users (profil, 1:1 dengan auth.users)
create table public.users (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  email      text not null unique,   -- asumsi login pakai email (bukan phone/anonymous)
  role       public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Categories & products (hapus bagian ini jika tabelnya sudah ada)
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  title       text not null,
  description text,
  price       int8 not null check (price >= 0),
  stock       int4 not null default 0 check (stock >= 0),
  image       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Postgres tidak otomatis membuat index untuk foreign key
create index products_category_id_idx on public.products (category_id);

-- 4. updated_at otomatis
create trigger users_set_updated_at
  before update on public.users
  for each row execute function extensions.moddatetime(updated_at);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function extensions.moddatetime(updated_at);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function extensions.moddatetime(updated_at);

-- 5. Auto-buat profil saat sign up
--    role SELALU 'user' (tidak pernah diambil dari metadata client)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Helper cek admin
--    security definer agar tidak kena RLS users (mencegah infinite recursion)
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.users
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- 7. Privilege level kolom
--    Client (authenticated) hanya boleh membaca dan mengubah 'name'.
--    Operasi istimewa (buat/hapus user, ubah role/email/password) lewat
--    server route + service_role + auth.admin API, bukan dari browser.
revoke all on public.users from anon, authenticated;
grant select on public.users to authenticated;
grant update (name) on public.users to authenticated;

-- service_role (dipakai server) juga butuh grant eksplisit
grant all on public.users, public.categories, public.products to service_role;

-- Grant eksplisit untuk categories & products. Project Supabase baru tidak
-- selalu memberi akses otomatis ke anon/authenticated. RLS (bagian 8) tetap
-- yang membatasi siapa boleh menulis.
grant select on public.categories, public.products to anon, authenticated;
grant insert, update, delete on public.categories, public.products to authenticated;

-- 8. Row Level Security
alter table public.users      enable row level security;
alter table public.categories enable row level security;
alter table public.products   enable row level security;

-- users
create policy "users_select_own_or_admin" on public.users
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

-- Hanya baris sendiri, dan hanya kolom 'name' (dibatasi grant kolom)
create policy "users_update_own" on public.users
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- categories: publik baca, admin tulis
create policy "categories_select_all" on public.categories
  for select to anon, authenticated
  using (true);

create policy "categories_insert_admin" on public.categories
  for insert to authenticated
  with check ((select public.is_admin()));

create policy "categories_update_admin" on public.categories
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "categories_delete_admin" on public.categories
  for delete to authenticated
  using ((select public.is_admin()));

-- products: publik baca, admin tulis
create policy "products_select_all" on public.products
  for select to anon, authenticated
  using (true);

create policy "products_insert_admin" on public.products
  for insert to authenticated
  with check ((select public.is_admin()));

create policy "products_update_admin" on public.products
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "products_delete_admin" on public.products
  for delete to authenticated
  using ((select public.is_admin()));

-- 9. Jadikan akun admin (jalankan manual setelah user sign up)
-- update public.users set role = 'admin' where email = 'emailkamu@example.com';