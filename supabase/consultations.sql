create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  funeral_method text not null check (funeral_method in ('cremation', 'burial')),
  expected_guests text not null check (expected_guests in ('under50', 'around100', 'around200', 'over300')),
  region text not null check (region in ('busan', 'ulsan', 'gyeongnam', 'etc')),
  additional_notes text,
  created_at timestamptz not null default now()
);

alter table public.consultations enable row level security;

-- 고객(공개 publishable 키)은 등록(insert)만 가능
create policy "consultations_insert_public"
  on public.consultations
  for insert
  to anon
  with check (true);

-- 의도적으로 select 정책을 만들지 않는다 = anon 역할은 절대 조회 불가
-- 관리자 조회는 Supabase 대시보드(Table Editor)에서만 수행한다
