# MCP Git 자동 커밋 설정 가이드

## 설치 완료 ✅
`yl-mcp-git-server`가 전역으로 설치되었습니다.

## Cursor에서 MCP 서버 설정하기

### 방법 1: Cursor 설정 UI 사용 (권장)

1. **Cursor 설정 열기**
   - `Ctrl + ,` (또는 `Cmd + ,` on Mac)
   - 또는 메뉴: `File` → `Preferences` → `Settings`

2. **MCP 설정 찾기**
   - 설정 검색창에 "MCP" 또는 "Model Context Protocol" 검색
   - "MCP Servers" 또는 "MCP Configuration" 섹션 찾기

3. **서버 추가**
   - "Add Server" 또는 "+" 버튼 클릭
   - 다음 설정 입력:

```json
{
  "mcpServers": {
    "yl-git-server": {
      "command": "yl-mcp-git-server"
    }
  }
}
```

### 방법 2: 설정 파일 직접 수정

Windows에서 Cursor 설정 파일 위치:
- `%APPDATA%\Cursor\User\settings.json`
- 또는 `C:\Users\사용자명\AppData\Roaming\Cursor\User\settings.json`

설정 파일에 다음 내용 추가:

```json
{
  "mcpServers": {
    "yl-git-server": {
      "command": "yl-mcp-git-server"
    }
  }
}
```

### 방법 3: npx 사용 (설치 없이 사용)

설정 파일에 다음 내용 추가:

```json
{
  "mcpServers": {
    "yl-git-server": {
      "command": "npx",
      "args": ["-y", "yl-mcp-git-server"]
    }
  }
}
```

## 설정 후

1. **Cursor 재시작**
   - 설정을 저장한 후 Cursor를 완전히 종료하고 다시 시작

2. **확인 방법**
   - AI 채팅에서 "Git 상태 확인" 또는 "코드 변경사항 보여줘"라고 요청
   - MCP 서버가 정상 작동하면 Git 관련 기능을 사용할 수 있습니다

## 사용 방법

### 자동 커밋 요청 예시

```
"내 코드 변경사항을 분석하고 자동으로 커밋해줘"
"변경된 파일을 스테이징하고 커밋 메시지를 생성해서 커밋해줘"
"현재 Git 상태를 확인해줘"
```

### 제공되는 기능

- `git_init`: Git 저장소 초기화
- `git_status`: 저장소 상태 확인
- `git_diff`: 코드 변경사항 확인
- `git_add`: 파일 스테이징
- `git_smart_commit`: AI가 변경사항을 분석하여 자동으로 커밋 메시지 생성 후 커밋 및 푸시

## 문제 해결

### 한글 커밋 메시지가 깨지는 문제

Windows PowerShell에서 한글 커밋 메시지가 깨져서 저장되는 경우, 다음 방법으로 해결할 수 있습니다.

#### 해결 방법 1: Git 인코딩 설정 (권장)

Git의 커밋 메시지 인코딩을 UTF-8로 설정합니다:

```bash
# Git 전역 설정에 UTF-8 인코딩 추가
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8

# Windows에서 콘솔 인코딩 설정
git config --global core.quotepath false
```

#### 해결 방법 2: PowerShell 인코딩 설정

PowerShell 세션 시작 시 인코딩을 UTF-8로 설정합니다:

```powershell
# 현재 세션에만 적용
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

# 영구적으로 적용하려면 PowerShell 프로필에 추가
# 프로필 위치 확인: $PROFILE
# 프로필 파일에 위 명령어 추가
```

#### 해결 방법 3: 환경 변수 설정

시스템 환경 변수에 다음을 추가합니다:

1. **시스템 속성** → **고급** → **환경 변수** 열기
2. **시스템 변수**에서 **새로 만들기** 클릭
3. 변수 이름: `PYTHONIOENCODING`, 변수 값: `utf-8`
4. 변수 이름: `LANG`, 변수 값: `ko_KR.UTF-8`

또는 PowerShell에서:

```powershell
# 사용자 환경 변수에 추가
[System.Environment]::SetEnvironmentVariable('PYTHONIOENCODING', 'utf-8', 'User')
[System.Environment]::SetEnvironmentVariable('LANG', 'ko_KR.UTF-8', 'User')
```

#### 해결 방법 4: Git Bash 사용

PowerShell 대신 Git Bash를 사용하면 한글 인코딩 문제가 발생하지 않습니다:

```bash
# Git Bash에서 커밋
git commit -m "한글 커밋 메시지"
```

#### 해결 방법 5: 커밋 메시지 파일 사용

한글 메시지를 파일로 작성하여 커밋:

```bash
# 메시지를 파일로 작성 (UTF-8 인코딩으로 저장)
echo "한글 커밋 메시지" > commit-message.txt

# 파일을 사용하여 커밋
git commit -F commit-message.txt
```

#### 확인 방법

설정이 제대로 적용되었는지 확인:

```bash
# Git 인코딩 설정 확인
git config --global --get i18n.commitencoding
git config --global --get i18n.logoutputencoding

# 테스트 커밋 (실제로 커밋하지 않음)
git commit --dry-run -m "테스트: 한글 메시지 확인"
```

#### 참고사항

- MCP 서버를 통한 자동 커밋 시에도 위 설정이 적용됩니다
- 설정 후 Cursor를 재시작하면 변경사항이 반영됩니다
- 여전히 문제가 발생하면 영어로 커밋 메시지를 작성하는 것을 권장합니다

### MCP 서버가 작동하지 않는 경우

1. **Node.js 버전 확인**
   ```bash
   node --version
   ```
   - Node.js >= 16.0.0 필요

2. **패키지 재설치**
   ```bash
   npm uninstall -g yl-mcp-git-server
   npm install -g yl-mcp-git-server
   ```

3. **경로 확인**
   ```bash
   which yl-mcp-git-server
   # 또는 Windows에서:
   where yl-mcp-git-server
   ```

4. **Cursor 로그 확인**
   - Cursor 개발자 도구에서 콘솔 로그 확인
   - `Help` → `Toggle Developer Tools`

## 참고 자료

- [yl-mcp-git-server npm 패키지](https://www.npmjs.com/package/yl-mcp-git-server)
- [Model Context Protocol 공식 문서](https://modelcontextprotocol.io/)

