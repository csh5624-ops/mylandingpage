create table public.usernames (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  auth_user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.usernames enable row level security;

-- 교육용 데모: 더미 시딩 + 중복확인 조회를 anon 키로 직접 수행하기 위해 개방
-- (민감정보를 저장하지 않으므로 select/insert를 공개 허용 — 실제 서비스라면
--  insert는 인증된 사용자 또는 서버 전용 로직으로 제한해야 함)
create policy "usernames_select_public"
  on public.usernames
  for select
  to anon
  using (true);

create policy "usernames_insert_public"
  on public.usernames
  for insert
  to anon
  with check (true);

-- ⚠️ 아이디 찾기 기능용 email 컬럼 (교육용 단순 구현, 위험 인지하고 추가)
-- 이 테이블은 위 정책으로 anon이 누구나 select 가능하므로,
-- email 컬럼을 추가하면 타인의 가입 이메일이 그대로 조회될 수 있다.
-- 실서비스 전환 시 반드시 서버 전용 로직(Edge Function 등)으로 교체할 것.
alter table public.usernames add column if not exists email text;
