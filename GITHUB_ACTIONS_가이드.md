# 🔧 GitHub Actions 설정 및 확인 가이드

## 📋 현재 GitHub Actions 워크플로우 설정

### ✅ 워크플로우 파일 위치
`.github/workflows/deploy.yml`

### ✅ 워크플로우 내용
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pages: write
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build advanced package
        run: pnpm build:advanced
        env:
          NODE_ENV: production

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 🔍 GitHub Actions 확인 방법

### 1단계: Actions 탭으로 이동

1. **GitHub 저장소로 이동**
   - URL: `https://github.com/jumoooo/front_7th_chapter3-2`

2. **Actions 탭 클릭**
   - 저장소 상단 메뉴에서 `Actions` 클릭
   - 또는: `https://github.com/jumoooo/front_7th_chapter3-2/actions`

### 2단계: 워크플로우 확인

1. **워크플로우 목록 확인**
   - 왼쪽 사이드바에서 워크플로우 목록 확인
   - `Deploy to GitHub Pages` 워크플로우가 보여야 합니다

2. **실행 기록 확인**
   - 중앙 영역에 워크플로우 실행 기록이 표시됩니다
   - 각 실행의 상태를 확인할 수 있습니다:
     - ✅ **초록색 체크마크**: 성공
     - 🟡 **노란색 원**: 진행 중
     - ❌ **빨간색 X**: 실패

### 3단계: 워크플로우 실행 상세 확인

1. **실행 기록 클릭**
   - 특정 실행 기록을 클릭하면 상세 내용을 볼 수 있습니다

2. **각 단계 확인**
   - `Checkout repository` - 코드 체크아웃
   - `Setup pnpm` - pnpm 설정
   - `Setup Node.js` - Node.js 설정
   - `Install dependencies` - 패키지 설치
   - `Build advanced package` - 빌드 실행
   - `Deploy to GitHub Pages` - 배포 실행

3. **에러가 있다면**
   - 실패한 단계를 클릭하면 로그를 볼 수 있습니다
   - 에러 메시지를 확인하여 문제를 파악할 수 있습니다

---

## ⚠️ GitHub Actions 관련 주요 설정

### 1. GitHub Pages Source 설정 (가장 중요!)

**설정 위치**: GitHub 저장소 → Settings → Pages

**필요한 설정**:
```
Source: GitHub Actions ✅
```

> ⚠️ **중요**: "Deploy from a branch"가 아니라 **"GitHub Actions"**를 선택해야 합니다!

**설정 방법**:
1. 저장소로 이동: `https://github.com/jumoooo/front_7th_chapter3-2`
2. Settings → Pages 메뉴로 이동
3. Source를 **"GitHub Actions"**로 선택
4. Save 클릭

### 2. GitHub Actions 활성화 확인

**설정 위치**: GitHub 저장소 → Settings → Actions → General

**확인 사항**:
- Actions가 활성화되어 있는지 확인
- "Allow all actions and reusable workflows" 선택 권장

---

## 🚀 GitHub Actions 워크플로우 실행 방법

### 자동 실행
- `main` 브랜치에 push하면 자동으로 실행됩니다

### 수동 실행 (필요한 경우)

#### 방법 1: 빈 커밋으로 트리거
```bash
git commit --allow-empty -m "trigger deployment"
git push
```

#### 방법 2: 코드 변경 후 push
```bash
git add .
git commit -m "update code"
git push
```

---

## 🔍 문제 해결

### 문제 1: 워크플로우가 실행되지 않아요

**원인**:
- `main` 브랜치에 push하지 않았을 수 있음
- 다른 브랜치에 push했을 수 있음

**해결**:
```bash
# 현재 브랜치 확인
git branch

# main 브랜치로 전환 (필요한 경우)
git checkout main

# push
git push
```

---

### 문제 2: 워크플로우가 실패해요

**확인 사항**:
1. Actions 탭에서 실패한 워크플로우 클릭
2. 실패한 단계 확인
3. 에러 로그 확인

**가장 흔한 에러들**:

#### 에러 1: `ERR_PNPM_OUTDATED_LOCKFILE`
**원인**: `pnpm-lock.yaml` 파일이 최신 상태가 아님

**해결**:
```bash
# 로컬에서
pnpm install

# 변경사항 커밋
git add pnpm-lock.yaml
git commit -m "fix: update pnpm-lock.yaml"
git push
```

#### 에러 2: 빌드 실패
**원인**: TypeScript 오류, 빌드 오류 등

**해결**:
```bash
# 로컬에서 빌드 테스트
pnpm build:advanced

# 오류가 있다면 수정 후
git add .
git commit -m "fix: resolve build errors"
git push
```

#### 에러 3: 권한 오류
**원인**: GitHub Actions 권한 부족

**해결**:
- Settings → Actions → General
- "Read and write permissions" 선택
- "Allow GitHub Actions to create and approve pull requests" 선택

---

### 문제 3: 워크플로우는 성공했는데 404 에러가 나와요

**확인 사항**:
1. **GitHub Pages Source 설정 확인**
   - Settings → Pages → Source가 "GitHub Actions"인지 확인

2. **gh-pages 브랜치 확인**
   - 브랜치 목록: `https://github.com/jumoooo/front_7th_chapter3-2/branches`
   - `gh-pages` 브랜치가 있는지 확인
   - 브랜치 내용: `https://github.com/jumoooo/front_7th_chapter3-2/tree/gh-pages`
   - `index.html` 파일이 있는지 확인

3. **배포 완료 대기**
   - 워크플로우 성공 후 1-2분 정도 대기
   - GitHub Pages 배포에는 시간이 걸릴 수 있습니다

---

## 📊 워크플로우 실행 상태 확인

### 성공 상태 ✅
- 초록색 체크마크 표시
- 모든 단계가 성공적으로 완료
- `gh-pages` 브랜치에 파일이 업로드됨

### 실패 상태 ❌
- 빨간색 X 표시
- 실패한 단계 클릭하여 로그 확인
- 에러 메시지 확인 후 문제 해결

### 진행 중 상태 🟡
- 노란색 원 표시
- 현재 실행 중
- 완료될 때까지 대기

---

## 🎯 체크리스트

- [ ] GitHub Actions 워크플로우 파일이 올바르게 설정됨 (`.github/workflows/deploy.yml`)
- [ ] GitHub Settings → Pages에서 Source가 "GitHub Actions"로 설정됨
- [ ] GitHub Actions가 활성화되어 있음
- [ ] `main` 브랜치에 push했음
- [ ] 워크플로우가 성공적으로 실행됨 (✅ 초록색 체크마크)
- [ ] `gh-pages` 브랜치에 `index.html` 파일이 있음

---

## 💡 참고사항

- GitHub Actions 워크플로우는 `main` 브랜치에 push할 때 자동으로 실행됩니다
- 워크플로우 실행에는 보통 2-5분 정도 걸립니다
- 배포 완료 후 GitHub Pages에 반영되는데 몇 분 더 걸릴 수 있습니다
- 워크플로우가 성공했다면 `gh-pages` 브랜치가 자동으로 생성되고 파일이 업로드됩니다

