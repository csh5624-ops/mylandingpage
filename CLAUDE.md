@AGENTS.md

# 프로젝트 개요

부울경(부산·울산·경남) 지역 장례비 견적 플랫폼 "고요장례". Next.js App Router + Supabase(Auth/DB).

## 라우트

| 경로 | 역할 |
|---|---|
| `/` | 메인 랜딩페이지 |
| `/quote` | 장례 조건 선택 견적 입력 (다단계 폼) |
| `/quote/result` | 견적 계산 결과 (서버 동적 렌더링, `searchParams` 기반) |
| `/consultation` | 맞춤 상담 신청 폼 (Supabase `consultations` 테이블) |
| `/login` | 로그인 + Google OAuth + 아이디/비밀번호 찾기 |
| `/register/terms` | 회원가입 약관 동의 게이트 |
| `/register/form` | 회원가입 폼 (Supabase Auth 연동) |
| `/mypage` | 로그인 사용자 정보 + 로그아웃 |

## 디자인 톤 — 반드시 준수

연꽃 로고 기반 브라운 팔레트를 사용한다. **네이비(`slate-900`)/골드(`amber-*`)는 더 이상 쓰지 않는다 — 재도입 금지.**

`src/app/globals.css`의 `@theme inline`에 정의된 토큰만 사용:

| 토큰 | HEX | 용도 |
|---|---|---|
| `brand-50` | `#F2EAE0` | 연한 배경/보더 |
| `brand-100` | `#C09465` | 밝은 액센트(CTA 버튼 배경 등) |
| `brand-200` | `#A4774E` | 보조 액센트 |
| `brand-300` | `#865A3D` | 본문 보조 텍스트 |
| `brand-400` | `#714D2D` | 진한 텍스트/hover 배경 |
| `brand-500` | `#5F3D22` | 다크 섹션 배경, 헤딩 텍스트 |

`green-600`/`red-500` 같은 폼 검증 성공·실패 색상은 브랜드 색이 아니므로 예외(유지).

## 로고/아이콘

- 헤더 워드마크용: `public/images/logo-lotus.png`
- 파비콘: `src/app/icon.png`
- OG 이미지: `src/app/opengraph-image.tsx` (`next/og` `ImageResponse` + `public/fonts/NotoSansKR-Bold.ttf`)
- 위 세 파일은 모두 같은 원본에서 나온 것 — 로고를 교체하면 셋 다 동기화할 것
- 원본 백업: `public/images/brand-source/`

## 인증

- `src/components/AuthProvider.tsx`의 `useAuth()`로만 세션 접근 (페이지마다 `onAuthStateChange` 재구현 금지)
- Supabase 클라이언트는 `src/lib/supabase.ts`의 `supabase` export 재사용

## Supabase 키 관리

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 항상 `.env.local`로만 — 코드에 하드코딩 금지
- `sb_secret_...` 키는 이 프로젝트(클라이언트 전용 앱)에 절대 포함하지 않음

## UI 컨벤션

- 알림/완료 메시지는 `alert()` 대신 `src/components/Toast.tsx` 재사용
- 아이콘은 인라인 SVG — 새 아이콘 라이브러리 추가 금지

## 알려진 의도적 단순화 (교육용)

`usernames` 테이블은 anon 키로 select/insert가 모두 열려 있고 `email` 컬럼도 공개 조회 가능 — 아이디 중복확인/찾기 기능을 학습 목적으로 단순 구현한 것. 실서비스 전환 시 서버 전용 로직(Edge Function 등)으로 교체 필요.
