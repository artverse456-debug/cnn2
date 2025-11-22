-- Enable RLS
alter table if exists public.profiles enable row level security;
alter table if exists public.creator_groups enable row level security;
alter table if exists public.group_memberships enable row level security;
alter table if exists public.group_posts enable row level security;
alter table if exists public.post_comments enable row level security;
alter table if exists public.challenges enable row level security;
alter table if exists public.challenge_submissions enable row level security;
alter table if exists public.rewards enable row level security;
alter table if exists public.reward_claims enable row level security;

-- Profiles
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Service role inserts profiles" on public.profiles for insert with check (auth.role() = 'service_role');

-- Creator groups
create policy "Creator groups are public" on public.creator_groups for select using (true);
create policy "Creator can modify group" on public.creator_groups for update using (auth.uid() = creator_id);
create policy "Creator can delete group" on public.creator_groups for delete using (auth.uid() = creator_id);

-- Group memberships
create policy "Users manage own memberships" on public.group_memberships for insert with check (auth.uid() = user_id);
create policy "Users remove own memberships" on public.group_memberships for delete using (auth.uid() = user_id);

-- Group posts
create policy "Group posts readable" on public.group_posts for select using (true);
create policy "Creator manages posts" on public.group_posts for update using (auth.uid() = creator_id);
create policy "Creator deletes posts" on public.group_posts for delete using (auth.uid() = creator_id);

-- Challenges
create policy "Challenges readable" on public.challenges for select using (true);
create policy "Creator updates challenges" on public.challenges for update using (auth.uid() = creator_id);
create policy "Creator deletes challenges" on public.challenges for delete using (auth.uid() = creator_id);

-- Challenge submissions
create policy "Submitter can insert own submission" on public.challenge_submissions for insert with check (auth.uid() = user_id);
create policy "Group members can view submissions" on public.challenge_submissions for select using (
  auth.uid() in (
    select user_id from public.group_memberships gm where gm.group_id = challenge_submissions.group_id
  )
);

-- Rewards
create policy "Rewards are public" on public.rewards for select using (true);
create policy "Creator manages rewards" on public.rewards for insert with check (auth.uid() = creator_id);
create policy "Creator updates rewards" on public.rewards for update using (auth.uid() = creator_id);
create policy "Creator deletes rewards" on public.rewards for delete using (auth.uid() = creator_id);

-- Reward claims
create policy "User inserts own claims" on public.reward_claims for insert with check (auth.uid() = user_id);
create policy "User reads own claims" on public.reward_claims for select using (auth.uid() = user_id);
