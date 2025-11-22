-- Enable RLS
alter table public.profiles enable row level security;
alter table public.creator_groups enable row level security;
alter table public.group_memberships enable row level security;
alter table public.group_posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_claims enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_submissions enable row level security;

-- profiles policies
create policy "Users can read their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can create their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- creator_groups policies
create policy "Creator groups are public" on public.creator_groups
  for select using (true);

create policy "Creators manage their own groups" on public.creator_groups
  for all using (auth.uid() = creator_id) with check (auth.uid() = creator_id);

-- group_memberships policies
create policy "Users can join themselves" on public.group_memberships
  for insert with check (auth.uid() = user_id);

create policy "Users can read their memberships" on public.group_memberships
  for select using (auth.uid() = user_id);

-- group_posts policies
create policy "Members can read posts" on public.group_posts
  for select using (
    exists (
      select 1 from public.group_memberships gm
      where gm.group_id = group_posts.group_id
        and gm.user_id = auth.uid()
    )
  );

create policy "Authors manage their posts" on public.group_posts
  for insert with check (auth.uid() = author_id);

-- post_comments policies
create policy "Members read comments" on public.post_comments
  for select using (
    exists (
      select 1 from public.group_posts gp
      join public.group_memberships gm on gm.group_id = gp.group_id
      where gp.id = post_comments.post_id
        and gm.user_id = auth.uid()
    )
  );

create policy "Authors write comments" on public.post_comments
  for insert with check (auth.uid() = author_id);

-- rewards policies
create policy "Rewards are public" on public.rewards
  for select using (true);

-- reward_claims policies
create policy "Users see their reward claims" on public.reward_claims
  for select using (auth.uid() = user_id);

create policy "Users create their reward claims" on public.reward_claims
  for insert with check (auth.uid() = user_id);

-- challenges policies
create policy "Challenges are public" on public.challenges
  for select using (true);

-- challenge_submissions policies
create policy "Users see their submissions" on public.challenge_submissions
  for select using (auth.uid() = user_id);

create policy "Users create submissions" on public.challenge_submissions
  for insert with check (auth.uid() = user_id);
