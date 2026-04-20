# 🚀 ALLROUND TRAINING 웹사이트 - 빠른 시작 가이드

## 현재 상태

✅ **프로젝트 완성**
- Next.js 14 앱 부트스트랩 완료
- 모든 컴포넌트 구현 완료
- Supabase 통합 준비 완료
- 반응형 디자인 완성

## 📦 현재 생성된 파일 구조

```
d:\at\
├── src/
│   ├── app/
│   │   ├── layout.tsx              ✅ 루트 레이아웃
│   │   ├── page.tsx                ✅ 랜딩 페이지
│   │   ├── globals.css             ✅ 흑백 디자인
│   │   └── activities/
│   │       └── [id]/
│   │           ├── page.tsx        ✅ 상세 페이지
│   │           └── loading.tsx     ✅ 로딩 스켈레톤
│   ├── components/
│   │   ├── hero/
│   │   │   └── HeroSection.tsx     ✅ "ALLROUND TRAINING" 애니메이션
│   │   ├── activities/
│   │   │   ├── ActivityCard.tsx    ✅ 카드 컴포넌트
│   │   │   ├── ActivityGrid.tsx    ✅ 서버 컴포넌트 (DB 연결)
│   │   │   └── AddActivityButton.tsx ✅ 인증 게이트
│   │   └── layout/
│   │       ├── Navbar.tsx          ✅ 네비게이션
│   │       └── Footer.tsx          ✅ 푸터
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           ✅ 브라우저 클라이언트
│   │   │   └── server.ts           ✅ 서버 클라이언트
│   │   └── types.ts                ✅ TypeScript 타입
│   └── hooks/
│       └── useAuth.ts              ✅ 인증 훅 (준비)
├── .env.local                      ⏳ Supabase 설정 필요
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── SETUP_GUIDE.md                  📖 상세 설정 가이드
```

## ⏳ 다음 단계 (3분 소요)

### 1️⃣ Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com) 방문
2. 새 프로젝트 생성
3. **SETUP_GUIDE.md**의 "2단계"를 따라 SQL 실행

### 2️⃣ 환경변수 설정
`d:\at\.env.local` 파일을 다음과 같이 수정:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3️⃣ 개발 서버 재시작
```bash
npm run dev
```

## ✨ 이미 구현된 기능

### 🎬 히어로 섹션
- "ALLROUND" / "TRAINING" 애니메이션 텍스트
- Framer Motion으로 웅장한 진입 효과
- 반응형 타이포그래피
- 스크롤 지시자

### 🃏 활동 카드 그리드
- Supabase 데이터베이스 연결 (준비 완료)
- 카드 호버 효과 (scale + border glow)
- 반응형 그리드 (1/2/3 컬럼)
- 카테고리 뱃지 및 태그

### 📄 상세 페이지
- 동적 라우팅 (`/activities/[id]`)
- 풀 콘텐츠 표시
- 관련 활동 링크
- 뒤로 가기 버튼

### 🔐 인증 준비 완료
- `useAuth` 훅 (현재 stub, 나중에 자동 작동)
- RLS 정책 설정 완료
- `created_by` 컬럼 (작성자 추적)

## 🎨 디자인 시스템

**Stitch에서 생성:**
- 검은 배경 (완전 흑백 모던)
- 기하학적 Kinetic Brutalism 스타일
- 고대비 타이포그래피
- 미니멀리스트 UI

## 📱 현재 테스트 방법

```bash
# 개발 서버 시작 (이미 실행 중)
npm run dev

# 브라우저에서 열기
http://localhost:3000
```

**화면에 보이는 것:**
- ✅ ALLROUND TRAINING 히어로 (Supabase 연결 전까지는 카드 없음)
- ✅ 네비게이션 바
- ✅ 푸터

## 🔄 Supabase 설정 후

환경변수를 설정하면:
1. 자동으로 샘플 활동 3개 표시
2. 카드 클릭 시 상세 페이지로 이동
3. 상세 페이지에서 전체 내용 확인

## 📝 Supabase에 활동 추가하는 방법

### 방법 1: SQL (빠름)
```sql
insert into public.activities (title, summary, content, category, tags) values
('활동 제목', '요약', '## 제목\n\n상세 내용', 'category', ARRAY['태그1', '태그2']);
```

### 방법 2: Supabase 대시보드 (UI)
1. Supabase 대시보드
2. "Table Editor" → "activities"
3. "Insert" 클릭
4. 데이터 입력

## 🛠️ 개발자용 추가 정보

### 파일 상세 설명

#### `src/components/hero/HeroSection.tsx`
- Framer Motion 애니메이션 로직
- staggerChildren (0.4s 간격)
- 각 단어 y: "110%" → "0%" 전환
- 폰트: Bebas Neue, 900 weight

#### `src/lib/supabase/server.ts`
- Server Components에서 사용
- 쿠키 기반 세션 관리
- @supabase/ssr 사용 (추천)

#### `src/components/activities/ActivityGrid.tsx`
- 서버 컴포넌트 (async)
- Supabase에서 직접 fetch
- 클라이언트 아일랜드 패턴 사용

## 🚀 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

Vercel 배포 (권장):
```bash
vercel
```

## ❓ 문제 해결

### "활동이 아직 없습니다" 메시지가 계속 나타남
→ Supabase 환경변수가 설정되지 않았을 수 있습니다.
- `.env.local` 파일 확인
- Supabase 키가 올바른지 확인
- 개발 서버 재시작 (`npm run dev`)

### 애니메이션이 보이지 않음
→ Framer Motion이 로드되지 않았을 수 있습니다.
```bash
npm install framer-motion
```

### 타입 에러 발생
→ TypeScript 정의가 필요합니다.
```bash
npm install --save-dev @types/react @types/node
```

## 📚 추가 문서

- **SETUP_GUIDE.md**: Supabase 상세 설정 (반드시 읽기!)
- **Plan**: C:\Users\USER\.claude\plans\noble-scribbling-cosmos.md

## 💡 다음에 추가 가능한 기능

1. **사용자 인증** - Supabase Auth 활성화
2. **활동 추가 폼** - `/activities/new` 페이지
3. **검색 기능** - 활동 검색
4. **필터링** - 카테고리별 필터
5. **이미지 업로드** - Supabase Storage
6. **좋아요/댓글** - 상호작용 기능
7. **관리자 패널** - 활동 CRUD UI

---

**모든 기초 작업이 완료되었습니다! 🎉**  
Supabase 환경변수만 설정하면 완전히 작동하는 웹사이트입니다.
