# 두더지 로그

### 스포일러 방지 SNS 웹 서비스

스포일러 방지 기능이 있는 React + TypeScript 기반 소셜 네트워크 웹 서비스이다.<br/>
사용자는 게시글 작성 시 원하는 텍스트 범위를 선택적으로 숨길 수 있으며, 무한 스크롤 피드를 통해 게시글을 탐색하고 무한 중첩 댓글로 소통할 수 있다.

### 배포 주소

https://891km-log.vercel.app

<br>

## 기술 스택

| 카테고리                  | 기술                              |
| ------------------------- | --------------------------------- |
| **프론트엔드**            | React, TypeScript                 |
| **서버 상태 관리**        | TanStack Query                    |
| **전역 상태 관리**        | Zustand                           |
| **백엔드 & 데이터베이스** | Supabase                          |
| **스타일링**              | Tailwind CSS, Shadcn/ui           |
| **배포**                  | Vercel (프로덕션), Netlify (개발) |

<br>

## 파일 구조

```
├── src/
│   ├── api/                        # API 통신
│   │   ├── auth-api.ts
│   │   ├── post-api.ts
│   │   ├── comment-api.ts
│   │   └── profile-api.ts
│   │
│   ├── components/                 # 재사용 가능한 컴포넌트
│   │   ├── post-feed/              # 무한 스크롤 피드
│   │   ├── post-item/              # 게시글 아이템
│   │   ├── post-comment/           # 재귀적 댓글 컴포넌트
│   │   ├── post-editor/            # 게시글 작성/수정
│   │   ├── profile/                # 프로필 관련
│   │   └── ui/                     # 공통 UI 컴포넌트
│   │
│   ├── hooks/                      # Custom Hooks
│   │   ├── mutations/              # TanStack Query Mutations
│   │   │   ├── auth/               # 인증 관련
│   │   │   ├── post/               # 게시글 CRUD
│   │   │   ├── comment/            # 댓글 CRUD
│   │   │   └── profile/            # 프로필 업데이트
│   │   └── queries/                # TanStack Query Queries
│   │
│   ├── store/                      # Zustand 전역 상태
│   │   ├── session.ts              # 세션 관리
│   │   ├── post-editor-modal.ts
│   │   ├── post-images-viewer-modal.ts
│   │   └── profile-editor-modal.ts
│   │
│   ├── pages/                      # 페이지 컴포넌트
│   │   ├── index-page.tsx
│   │   ├── post-detail-page.tsx
│   │   ├── profile-detail-page.tsx
│   │   └── login-page.tsx
│   │
│   ├── layouts/                    # 레이아웃 컴포넌트
│   │   ├── global-layout.tsx
│   │   ├── auth-layout.tsx
│   │   ├── guest-only-layout.tsx
│   │   └── user-only-layout.tsx
│   │   └── header/
│   │
│   ├── constants/                  # 상수 관리
│   │   ├── routes.ts
│   │   └── toast-messages.ts       # UX 일관성을 위한 메시지 상수
│   │
│   ├── lib/                        # 유틸리티 함수
│   │   ├── supabase.ts             # Supabase 클라이언트
│   │   ├── content-meta.tsx        # 텍스트 가리기 로직
│   │   ├── error-code-ko.ts        # 에러 코드 한국어 맵핑
│   │   ├── random-nickname.ts
│   │   ├── supabase.ts
│   │   ├── time.ts
│   │   └── utils.ts
│   │
│   └── types/                     # TypeScript 타입 정의
│       ├── database.types.ts       # Supabase 자동 생성 타입
│       └── types.ts
│
├── supabase/
├── public/
└── package.json
```

<br>

## 주요 기능

### 1. 게시글 작성 및 관리

- 게시글 작성, 수정, 삭제
- 이미지 업로드 기능
- 좋아요 기능
- 댓글 및 대댓글 기능
  - **재귀적 컴포넌트 구조**를 통한 무한 중첩 댓글 시스템

### 2. 무한 스크롤 피드

- 스크롤 기반 자동 데이터 로딩
- **TanStack Query의 pagination** 활용
- 스크롤 위치에 따른 효율적인 데이터 페칭

### 3. 상태 관리

- **TanStack Query**: 서버 상태 관리 및 캐싱
- **Zustand**: 전역 상태 관리
  - 세션 관리
  - 포스트 작성/수정 상태
  - 이미지 뷰어 상태
  - 프로필 수정 모달 상태

### 4. 텍스트 가리기 기능 (스포일러 방지)

- 포스트 내 원하는 텍스트를 선택적으로 숨김 처리
- 숨김 처리된 텍스트 범위를 **JSON 형식**으로 서버에 저장
- 클라이언트에서 렌더링 시 숨김 처리 제어
- 클릭 시 가려진 내용 표시

### 5. UX 최적화

- **모바일 최적화**: 모달 전체화면 적용으로 모바일 환경 개선
- **로딩 처리**:
  - 비동기 데이터 로딩 중 로딩 인디케이터 표시
  - Skeleton UI를 통한 대기 경험 개선
- **에러 핸들링**:
  - 입력 오류 시 toast 알림
  - 업로드 실패 등 상황별 경고 메시지
  - 경고 및 안내 문구를 상수로 분리하여 일관성 유지

<br>

## 트러블 슈팅

### 텍스트 가리기 기능 구현

#### 문제 상황

포스트 내에서 단순히 전체 포스트를 가리는 것이 아니라 스포일러성 텍스트인 **특정 텍스트 범위만** 선택적으로 가리는 기능이 필요했다.

#### 문제 해결

**1. 데이터 구조 설계**

- 사용자가 선택한 텍스트의 시작/끝 인덱스를 배열로 저장

```ts
export type ContentMeta = {
  start: number;
  end: number;
}[];
```

**2. 텍스트 편집 시 범위 자동 조정**

- `adjustContentMeta`: 텍스트 추가/삭제 시 숨김 범위 자동 업데이트
  - 커서 위치에 따라 before(전체 이동) / overlap(끝점 조정) / after(변경 없음) 처리
- `normalizeContentMeta`: 겹치는 범위 자동 병합 및 정렬

**3. 실시간 시각화**

- `splitContentByMeta`: content를 text/hidden 타입으로 분리하여 렌더링을 위한 구조 생성
- `ContentMeta 기반 렌더링`: 분리된 데이터를 기반으로 컴포넌트에서 하이라이트/숨김 상태를 제어

**4. 결과**

- 텍스트 편집 시에도 숨김 범위가 자동으로 조정되어 일관성 유지
- JSON 형식으로 서버에 저장하여 데이터 구조화
