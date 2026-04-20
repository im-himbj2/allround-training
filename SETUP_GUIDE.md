# ALLROUND TRAINING 웹사이트 - Supabase 설정 가이드

## 📋 단계별 설정

### 1단계: Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com)으로 이동
2. "New Project" 클릭
3. 프로젝트 이름 설정 (예: `allround-training`)
4. 강력한 비밀번호 설정
5. 리전 선택 (Asia에서 선택 권장)

### 2단계: 데이터베이스 스키마 생성
1. Supabase 대시보드 → "SQL Editor"로 이동
2. 다음 SQL을 복사하여 붙여넣기:

```sql
-- Activities 테이블 생성
create table public.activities (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  summary     text        not null,
  content     text        not null,
  image_url   text,
  category    text        not null default 'general',
  tags        text[]      not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users(id) on delete set null
);

-- 업데이트 시간 자동 갱신 함수
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 트리거 설정
create trigger on_activities_updated
  before update on public.activities
  for each row execute procedure public.handle_updated_at();

-- RLS (Row Level Security) 활성화
alter table public.activities enable row level security;

-- 정책 1: 모든 사용자가 읽을 수 있음
create policy "Anyone can read activities"
  on public.activities for select
  using (true);

-- 정책 2: 인증된 사용자만 추가 가능
create policy "Authenticated users can insert"
  on public.activities for insert
  to authenticated
  with check (true);

-- 정책 3: 작성자만 수정 가능
create policy "Owners can update their activities"
  on public.activities for update
  to authenticated
  using (auth.uid() = created_by);

-- 샘플 데이터 추가
insert into public.activities (title, summary, content, category, tags) values
(
  '새벽 러닝 크루',
  '매주 화/목 새벽 6시, 한강을 달립니다. 초보자 환영.',
  '## 새벽 러닝 크루

매주 화요일과 목요일 새벽 6시에 한강 둔치에서 모입니다.

**코스:** 여의도 한강공원 → 마포대교 → 반환점 (총 8km)

**준비물:**
- 운동화
- 물
- 밝은 색 옷

**참가방법:**
단톡방에 미리 알려주시고 현장에서 만나요!

모든 수준의 러너를 환영합니다.',
  'running',
  ARRAY['러닝', '새벽', '한강', '유산소']
),
(
  '주짓수 오픈 매트',
  '매주 토요일 오전, 실력 무관 자유 스파링 세션.',
  '## 주짓수 오픈 매트

매주 토요일 오전 10시~12시 진행되는 자유 스파링 세션입니다.

**장소:** 동아리방 (학생회관 3층)

**규칙:**
- 안전 최우선
- 탭은 즉시 존중

**준비물:**
- 도복(기)
- 또는 래쉬가드(노기)

**레벨:** 모든 수준 환영',
  'martial-arts',
  ARRAY['주짓수', 'BJJ', '스파링', '격투기']
),
(
  '웨이트 트레이닝 스터디',
  '프로그래밍, 폼 교정, 영양학까지 다루는 스터디 그룹.',
  '## 웨이트 트레이닝 스터디

격주 수요일 저녁 7시, 트레이닝 이론을 함께 공부합니다.

**커리큘럼:**
- 1~4주차: 근비대 프로그래밍 원리
- 5~8주차: 주요 리프트 폼 분석
- 9~12주차: 스포츠 영양학 기초

**진행방식:**
발표자를 순번으로 정해 매 세션 한 명이 주제를 맡습니다.

**참가 대상:**
웨이트에 관심있는 모든 수준',
  'strength',
  ARRAY['웨이트', '파워리프팅', '스터디', '영양']
);
```

3. "RUN" 버튼 클릭 (쿼리 실행)

### 3단계: API 키 복사
1. Supabase 대시보드 → 좌측 메뉴 "Settings" → "API"
2. 다음 값들을 복사:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL로 사용)
   - **anon (public)** (NEXT_PUBLIC_SUPABASE_ANON_KEY로 사용)

### 4단계: .env.local 파일 설정
프로젝트 루트(`d:\at`)에 `.env.local` 파일을 생성:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 5단계: 개발 서버 시작
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## ✅ 검증

- [ ] 히어로 섹션의 "ALLROUND TRAINING" 애니메이션 확인
- [ ] 3개의 활동 카드가 표시됨
- [ ] 카드 클릭 시 상세 페이지로 이동
- [ ] 상세 페이지에서 전체 내용 표시
- [ ] "새 활동 추가" 버튼이 보이지 않음 (비인증 상태)

## 🔐 추후: 인증 설정 (선택사항)

나중에 사용자가 활동을 추가할 수 있게 하려면:

1. Supabase 대시보드 → "Authentication" 활성화
2. Email/Password 또는 GitHub OAuth 선택
3. 로그인 페이지 생성 (`src/app/login/page.tsx`)
4. `/activities/new` 페이지 생성
5. 미들웨어로 경로 보호

**현재 구조는 모든 것이 준비되어 있으므로 위 단계들을 추가하기만 하면 됩니다!**

## 📝 활동 추가/편집

현재는 관리자가 Supabase 대시보드에서 직접 추가해야 합니다.

추후 UI를 통한 추가 기능을 원하면:
1. 로그인 시스템 구현
2. `/activities/new` 페이지 생성
3. 폼 제출 시 Supabase에 insert

---

**문제가 있으면:**
- 환경변수가 올바르게 설정되었는지 확인
- 브라우저 개발자 도구 (F12) → Console에서 에러 메시지 확인
- Supabase 대시보드에서 RLS 정책 확인
