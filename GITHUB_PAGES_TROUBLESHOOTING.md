# 🔧 GitHub Pages 404 에러 해결 가이드

## ❌ 404 에러가 발생하는 경우

### 1️⃣ 가장 흔한 원인: GitHub Pages Source 설정 문제

**증상**: `https://jumoooo.github.io/front_7th_chapter3-2/`에 접속하면 404 에러 발생

**해결 방법**:

1. **GitHub 저장소로 이동**

   - `https://github.com/jumoooo/front_7th_chapter3-2`
   - Settings → Pages 메뉴로 이동

2. **Source 설정 확인**

   - ⚠️ **중요**: Source가 "Deploy from a branch"로 되어 있고, 브랜치가 "gh-pages"로 설정되어 있다면, 이것이 문제일 수 있습니다.
   - **올바른 설정**: Source를 **"GitHub Actions"**로 변경해야 합니다!
   - "Deploy from a branch"는 GitHub Actions 없이 수동으로 배포할 때만 사용합니다.

3. **올바른 설정 방법**:
   ```
   Settings → Pages
   Source: GitHub Actions ✅ (선택)
   Save 클릭
   ```

### 2️⃣ GitHub Actions 워크플로우 확인

**확인 방법**:

1. **Actions 탭으로 이동**

   - `https://github.com/jumoooo/front_7th_chapter3-2/actions`

2. **"Deploy to GitHub Pages" 워크플로우 확인**

   - 워크플로우가 실행되었는지 확인
   - 실패했다면 로그 확인
   - 성공했다면 다음 단계로

3. **워크플로우 재실행** (필요한 경우)
   ```bash
   git commit --allow-empty -m "trigger deployment"
   git push
   ```

### 3️⃣ gh-pages 브랜치 확인

**확인 방법**:

1. **브랜치 목록 확인**

   - `https://github.com/jumoooo/front_7th_chapter3-2/branches`
   - `gh-pages` 브랜치가 있는지 확인

2. **gh-pages 브랜치 내용 확인**

   - `https://github.com/jumoooo/front_7th_chapter3-2/tree/gh-pages`
   - `index.html` 파일이 있어야 합니다
   - `assets` 폴더가 있어야 합니다

3. **문제가 있다면**:
   - GitHub Actions 워크플로우를 다시 실행
   - 빈 커밋을 만들어 push

### 4️⃣ 저장소 이름 확인

**확인 방법**:

1. 저장소 이름이 정확히 `front_7th_chapter3-2`인지 확인
2. 만약 다르다면, `vite.config.ts`의 base path도 함께 수정:
   ```typescript
   const base: string =
     process.env.NODE_ENV === "production" ? "/실제저장소이름/" : "";
   ```

### 5️⃣ 빌드 로컬 테스트

**로컬에서 빌드 확인**:

```bash
# 빌드 실행
pnpm build:advanced

# 빌드 결과 확인
ls -la dist/
# 다음 파일들이 있어야 합니다:
# - index.html ✅
# - index.advanced.html ✅
# - assets/ 폴더 ✅
```

### 6️⃣ 브라우저 캐시 문제

**해결 방법**:

- 브라우저 캐시를 완전히 지우고 다시 접속
- Windows: `Ctrl + Shift + R` 또는 `Ctrl + F5`
- Mac: `Cmd + Shift + R`
- 또는 시크릿 모드로 접속

## 🔍 단계별 점검 체크리스트

- [ ] GitHub Settings → Pages에서 Source가 "GitHub Actions"로 설정되어 있음
- [ ] GitHub Actions 워크플로우가 성공적으로 실행되었음
- [ ] gh-pages 브랜치가 존재하고, index.html 파일이 있음
- [ ] 저장소 이름이 `front_7th_chapter3-2`와 일치함
- [ ] 로컬 빌드 테스트가 성공함
- [ ] 브라우저 캐시를 지우고 다시 시도함

## 📞 추가 도움이 필요한 경우

위의 모든 단계를 시도했는데도 문제가 해결되지 않으면:

1. GitHub Actions 로그를 자세히 확인
2. gh-pages 브랜치의 실제 파일 구조 확인
3. 브라우저 개발자 도구(F12)에서 네트워크 탭 확인
4. 콘솔 에러 메시지 확인
