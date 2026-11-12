-- Apply to the intended Supabase project before setting the Vercel environment variables.
create table if not exists public.storefront_catalog (
  id text primary key check (id = 'main'),
  revision integer not null default 0 check (revision >= 0),
  data jsonb check (data is null or ((data->>'revision')::integer = revision))
);

alter table public.storefront_catalog enable row level security;
revoke all on table public.storefront_catalog from anon, authenticated;
grant select, update on table public.storefront_catalog to service_role;

insert into public.storefront_catalog (id) values ('main') on conflict do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog-photos', 'catalog-photos', false, 3145728, array['image/webp'])
on conflict (id) do nothing;
