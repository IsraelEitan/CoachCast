create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  website_url text,
  instagram_handle text,
  primary_offer text,
  audience_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'admin', 'trainer', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.brand_profiles (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'ready', 'archived')),
  source_url text,
  source_handle text,
  tone text[] not null default '{}',
  audience jsonb not null default '{}'::jsonb,
  offers text[] not null default '{}',
  content_pillars text[] not null default '{}',
  pain_points text[] not null default '{}',
  avoid_claims text[] not null default '{}',
  raw_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_ideas (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  brand_profile_id uuid references public.brand_profiles(id) on delete set null,
  title text not null,
  hook text not null,
  viewer_pain text not null,
  format text not null,
  cta text not null,
  confidence numeric(4, 3) not null check (confidence >= 0 and confidence <= 1),
  status text not null default 'draft' check (status in ('draft', 'approved', 'rejected', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.script_drafts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  content_idea_id uuid not null references public.content_ideas(id) on delete cascade,
  hook text not null,
  teleprompter_text text not null,
  beats text[] not null default '{}',
  caption text not null,
  hashtags text[] not null default '{}',
  shot_list text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'approved', 'needs_revision', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  kind text not null check (kind in ('brand_scan', 'idea_generation', 'script_generation', 'render_plan', 'publish_plan')),
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workspaces_owner_id_idx on public.workspaces(owner_id);
create index workspace_members_user_id_idx on public.workspace_members(user_id);
create index brand_profiles_workspace_created_at_idx on public.brand_profiles(workspace_id, created_at desc);
create index content_ideas_workspace_profile_idx on public.content_ideas(workspace_id, brand_profile_id);
create index content_ideas_workspace_status_created_at_idx on public.content_ideas(workspace_id, status, created_at desc);
create index script_drafts_workspace_idea_idx on public.script_drafts(workspace_id, content_idea_id);
create index ai_jobs_workspace_status_created_at_idx on public.ai_jobs(workspace_id, status, created_at desc);

create trigger set_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.set_updated_at();

create trigger set_brand_profiles_updated_at
  before update on public.brand_profiles
  for each row execute function public.set_updated_at();

create trigger set_content_ideas_updated_at
  before update on public.content_ideas
  for each row execute function public.set_updated_at();

create trigger set_script_drafts_updated_at
  before update on public.script_drafts
  for each row execute function public.set_updated_at();

create trigger set_ai_jobs_updated_at
  before update on public.ai_jobs
  for each row execute function public.set_updated_at();

create or replace function public.create_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (workspace_id, user_id) do nothing;

  return new;
end;
$$;

create trigger create_owner_membership
  after insert on public.workspaces
  for each row execute function public.create_owner_membership();

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspace_members member
    where member.workspace_id = target_workspace_id
      and member.user_id = (select auth.uid())
  );
$$;

grant execute on function public.is_workspace_member(uuid) to authenticated;

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.brand_profiles enable row level security;
alter table public.content_ideas enable row level security;
alter table public.script_drafts enable row level security;
alter table public.ai_jobs enable row level security;

create policy "members can read workspaces"
  on public.workspaces
  for select
  to authenticated
  using (public.is_workspace_member(id));

create policy "users can create owned workspaces"
  on public.workspaces
  for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "owners can update workspaces"
  on public.workspaces
  for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "owners can delete workspaces"
  on public.workspaces
  for delete
  to authenticated
  using (owner_id = (select auth.uid()));

create policy "members can read workspace memberships"
  on public.workspace_members
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1
      from public.workspaces workspace
      where workspace.id = workspace_id
        and workspace.owner_id = (select auth.uid())
    )
  );

create policy "owners can add workspace memberships"
  on public.workspace_members
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.workspaces workspace
      where workspace.id = workspace_id
        and workspace.owner_id = (select auth.uid())
    )
  );

create policy "owners can update workspace memberships"
  on public.workspace_members
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.workspaces workspace
      where workspace.id = workspace_id
        and workspace.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.workspaces workspace
      where workspace.id = workspace_id
        and workspace.owner_id = (select auth.uid())
    )
  );

create policy "owners can delete workspace memberships"
  on public.workspace_members
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.workspaces workspace
      where workspace.id = workspace_id
        and workspace.owner_id = (select auth.uid())
    )
  );

create policy "members can read brand profiles"
  on public.brand_profiles
  for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "members can create brand profiles"
  on public.brand_profiles
  for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "members can update brand profiles"
  on public.brand_profiles
  for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "members can delete brand profiles"
  on public.brand_profiles
  for delete
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "members can read content ideas"
  on public.content_ideas
  for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "members can create content ideas"
  on public.content_ideas
  for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "members can update content ideas"
  on public.content_ideas
  for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "members can delete content ideas"
  on public.content_ideas
  for delete
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "members can read script drafts"
  on public.script_drafts
  for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "members can create script drafts"
  on public.script_drafts
  for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "members can update script drafts"
  on public.script_drafts
  for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "members can delete script drafts"
  on public.script_drafts
  for delete
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "members can read ai jobs"
  on public.ai_jobs
  for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "members can create ai jobs"
  on public.ai_jobs
  for insert
  to authenticated
  with check (
    public.is_workspace_member(workspace_id)
    and (created_by is null or created_by = (select auth.uid()))
  );

create policy "members can update ai jobs"
  on public.ai_jobs
  for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "members can delete ai jobs"
  on public.ai_jobs
  for delete
  to authenticated
  using (public.is_workspace_member(workspace_id));
