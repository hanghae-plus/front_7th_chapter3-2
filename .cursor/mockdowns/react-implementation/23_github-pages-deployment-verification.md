# GitHub Pages 배포 설정 검증 보고서

## 📋 목표

`https://jumoooo.github.io/front_7th_chapter3-2/` 에서 `src/advanced` 화면이 정상적으로 표시되도록 설정

**참고 프로젝트**: `front_7th_chapter3-1` (입증된 배포 설정)

---

## 🔍 현재 상태 분석

### ✅ 이미 구현된 부분

#### 1. Base Path 설정 ✅

**vite.config.ts**:

```typescript
const base: string =
  process.env.NODE_ENV === "production" ? "/front_7th_chapter3-2/" : "";
```

**검증 결과**:

- ✅ 배포 링크와 코드의 base path가 일치함: `/front_7th_chapter3-2/`
- ✅ front_7th_chapter3-1과 동일한 패턴 사용
- ✅ 프로덕션 환경에서만 base path 적용

---

#### 2. 배포용 HTML 파일 ✅

**index.html** (루트 디렉토리):

- ✅ `src/advanced/main.tsx`를 사용하도록 설정
- ✅ GitHub Pages 배포용 기본 HTML 파일로 사용
- ✅ front_7th_chapter3-1 패턴과 일치

---

#### 3. 빌드 스크립트 ✅

**package.json**:

```json
{
  "scripts": {
    "build:advanced": "tsc -b && vite build --config vite.config.ts"
  }
}
```

**검증 결과**:

- ✅ `build:advanced` 스크립트가 올바르게 설정됨
- ✅ TypeScript 컴파일 후 Vite 빌드 실행

---

#### 4. GitHub Actions 워크플로우 ✅

**`.github/workflows/deploy.yml`**:

- ✅ front_7th_chapter3-1과 동일한 구조
- ✅ `publish_dir: ./dist` 설정 올바름
- ✅ `build:advanced` 명령어 사용
- ✅ `NODE_ENV: production` 설정으로 base path 적용

---

#### 5. 빌드 결과물 검증 ✅

**로컬 빌드 테스트 결과**:

```
✓ 86 modules transformed.
dist/index.html                  0.44 kB │ gzip:  0.35 kB
dist/assets/index-BVSKioPT.js  225.60 kB │ gzip: 69.52 kB
✓ built in 1.11s
```

**생성된 파일 구조**:

```
dist/
├── index.html                    ✅
├── assets/
│   └── index-BVSKioPT.js        ✅
└── vite.svg
```

**검증 결과**:

- ✅ `index.html` 파일이 올바르게 생성됨
- ✅ base path (`/front_7th_chapter3-2/`)가 JavaScript 파일 경로에 적용됨
- ✅ 모든 필수 파일이 생성됨

---

## 📊 front_7th_chapter3-1과 비교

### ✅ 동일한 패턴

1. **vite.config.ts 구조**: 동일한 패턴 사용

   - base path 설정 방식 동일
   - test 설정 조건부 제외 동일
   - dirname 처리 방식 동일

2. **GitHub Actions 워크플로우 구조**: 동일

   - 동일한 액션 버전 사용
   - 동일한 권한 설정
   - 동일한 배포 방식

3. **빌드 결과물 구조**: 동일
   - `dist/index.html` 생성
   - `dist/assets/` 폴더 구조 동일

### 차이점 (의도된 차이) ✅

1. **Base Path**: `/front_7th_chapter3-1/` vs `/front_7th_chapter3-2/` (저장소 이름)
2. **빌드 스크립트**: `build:after` vs `build:advanced` (프로젝트 구조 차이)
3. **publish_dir**: `./packages/after/dist` vs `./dist` (monorepo vs 단일 프로젝트)

---

## ✅ 검증 체크리스트

### 파일 설정 검증

- [x] vite.config.ts: base path 설정 확인 (`/front_7th_chapter3-2/`)
- [x] index.html: advanced 버전 사용 확인 (`src/advanced/main.tsx`)
- [x] package.json: build:advanced 스크립트 확인
- [x] deploy.yml: 워크플로우 설정 확인 (`publish_dir: ./dist`)
- [x] 로컬 빌드 테스트: 성공 확인
- [x] 빌드 결과물: index.html 및 assets 파일 생성 확인
- [x] 빌드된 경로: base path 적용 확인

### 사용자 확인 필요 (외부 설정)

- [ ] GitHub Settings → Pages: Source가 "GitHub Actions"로 설정됨
- [ ] GitHub Actions: 워크플로우가 성공적으로 실행됨 (✅)
- [ ] gh-pages 브랜치: 브랜치가 생성되고 index.html 파일이 있음

---

## 👤 사용자가 직접 해야 할 작업 (외부 설정)

### ⚠️ 중요: 다음 작업들은 코드 수정이 아닌 GitHub 웹사이트에서 직접 설정해야 합니다

#### 1. GitHub 저장소 설정 확인

1. **GitHub 저장소 접속**

   - 저장소 URL: `https://github.com/jumoooo/front_7th_chapter3-2`
   - 저장소가 존재하고 접근 가능한지 확인

2. **저장소 권한 확인**
   - Settings > General에서 저장소 설정 확인
   - Actions 권한이 활성화되어 있는지 확인

---

#### 2. GitHub Pages 설정 ⚠️ 가장 중요!

1. **Settings > Pages 메뉴 접속**

   - 저장소의 Settings 탭 클릭
   - 왼쪽 메뉴에서 "Pages" 클릭
   - URL: `https://github.com/jumoooo/front_7th_chapter3-2/settings/pages`

2. **Source 설정** ⚠️

   - Source: **"GitHub Actions"** 선택 ✅
   - ❌ "Deploy from a branch"가 아니라 **"GitHub Actions"**를 선택해야 함
   - Save 클릭

3. **설정 확인**
   - 페이지 새로고침 후 Source가 "GitHub Actions"로 설정되었는지 재확인

---

#### 3. GitHub Actions 권한 설정

1. **Settings > Actions > General 접속**

   - 저장소의 Settings > Actions > General 메뉴로 이동

2. **Workflow permissions 설정**

   - "Workflow permissions" 섹션 확인
   - "Read and write permissions" 선택
   - Save 버튼 클릭

3. **Actions 권한 확인**
   - Actions 탭에서 워크플로우가 실행 가능한지 확인

---

#### 4. 초기 배포 확인

1. **워크플로우 실행 확인**

   - 코드 푸시 후 Actions 탭에서 워크플로우 실행 확인
   - URL: `https://github.com/jumoooo/front_7th_chapter3-2/actions`
   - `Deploy to GitHub Pages` 워크플로우 확인
   - ✅ 초록색 체크마크가 보이면 성공

2. **gh-pages 브랜치 확인**

   - Code 탭에서 브랜치 목록 확인
   - URL: `https://github.com/jumoooo/front_7th_chapter3-2/branches`
   - `gh-pages` 브랜치가 생성되었는지 확인
   - 브랜치 내용 확인: `https://github.com/jumoooo/front_7th_chapter3-2/tree/gh-pages`
   - `index.html` 파일이 있는지 확인

3. **배포 사이트 접속 확인**
   - `https://jumoooo.github.io/front_7th_chapter3-2/` 접속
   - `src/advanced` 화면이 표시되는지 확인
   - 브라우저 캐시 지우기 (Ctrl + Shift + R 또는 Cmd + Shift + R)

---

#### 5. 문제 해결 (필요시)

1. **배포 실패 시**

   - Actions 탭에서 실패한 워크플로우 클릭
   - 로그 확인하여 에러 원인 파악
   - 필요시 코드 수정 후 재푸시

2. **사이트가 404 에러인 경우**

   - GitHub Pages 설정 확인 (Source가 "GitHub Actions"인지)
   - `gh-pages` 브랜치가 올바르게 설정되었는지 확인
   - Base path가 올바른지 확인 (`/front_7th_chapter3-2/`)
   - 브라우저 캐시 지우기

3. **권한 에러인 경우**
   - Settings > Actions > General에서 권한 확인
   - 조직 저장소인 경우 관리자에게 권한 요청

---

## 📌 다음 단계 (작업 순서)

### 개발자(AI)가 한 작업 ✅

1. ✅ Base path 확인 완료 (`/front_7th_chapter3-2/`)
2. ✅ index.html 파일 생성 (advanced 버전 사용)
3. ✅ vite.config.ts 설정 (front_7th_chapter3-1 패턴 적용)
4. ✅ GitHub Actions 워크플로우 파일 생성 및 검증
5. ✅ 로컬 빌드 테스트 완료

### 사용자가 할 작업 (외부 설정)

6. **GitHub 저장소 설정 확인** (위의 "1. GitHub 저장소 설정 확인" 참조)
7. **GitHub Pages 설정** (위의 "2. GitHub Pages 설정" 참조) ⚠️ 가장 중요!
8. **GitHub Actions 권한 설정** (위의 "3. GitHub Actions 권한 설정" 참조)

### 공동 작업

9. **코드 푸시 및 배포 테스트**

   - 개발자가 코드를 main 브랜치에 푸시
   - 사용자가 Actions 탭에서 워크플로우 실행 확인
   - 사용자가 gh-pages 브랜치 생성 확인
   - 사용자가 배포된 사이트 접속하여 기능 검증

10. **배포 검증 및 문제 해결**
    - 배포된 사이트 기능 확인
    - 문제 발생 시 위의 "5. 문제 해결" 참조

---

## 🎉 결론

**모든 파일 설정이 올바르게 구성되어 있습니다!**

파일 레벨에서는 문제가 없으며, `front_7th_chapter3-1`과 동일한 입증된 패턴을 사용하고 있습니다.

404 에러가 발생한다면, 가장 먼저 확인해야 할 것은:

1. **GitHub Settings → Pages**: Source가 "GitHub Actions"로 설정되었는지 ⚠️

이것만 확인하면 대부분의 경우 해결됩니다!
