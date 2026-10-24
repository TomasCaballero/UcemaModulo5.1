-- Documenta el estado ya existente en producción de `user_progress` (creado desde el dashboard).
-- Es idempotente: sirve para recrear un proyecto nuevo sin alterar uno que ya la tiene.
-- Las columnas se infirieron del código (src/logic/persistence/cloudSync.ts); si el dashboard
-- muestra otros tipos, ajustar acá para que coincidan.

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

drop policy if exists "Los usuarios pueden leer su propio progreso" on public.user_progress;
create policy "Los usuarios pueden leer su propio progreso"
  on public.user_progress
  for select
  to public
  using ((auth.uid() = user_id));

drop policy if exists "Los usuarios pueden insertar o actualizar su progreso" on public.user_progress;
create policy "Los usuarios pueden insertar o actualizar su progreso"
  on public.user_progress
  for all
  to public
  using ((auth.uid() = user_id))
  with check ((auth.uid() = user_id));
