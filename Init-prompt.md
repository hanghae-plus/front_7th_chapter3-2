# Claude Code 초기화 프롬프트 v3

> `claude init` 실행 후 CLAUDE.md가 생성된 시점에서 사용

---

## 🚀 기본 초기화 프롬프트

````
프로젝트 루트에 있는 SETTING.md 파일을 읽고 초기화를 진행해줘.

## 수행할 작업

### 1. 폴더 구조 생성
```bash
mkdir -p .claude/agents
mkdir -p .claude/commands
mkdir -p .claude/state/logs
````

### 2. 서브에이전트 파일 생성

SETTING.md의 "서브에이전트 시스템" 섹션을 참고해서
`.claude/agents/` 폴더에 다음 에이전트들을 생성해줘:

- orchestrator.md (필수)
- code-writer.md (필수)
- test-writer.md (선택)
- reviewer.md (선택)

⚠️ 중요: 각 파일은 반드시 YAML frontmatter를 포함해야 해:

```markdown
---
name: agent-name
description: 에이전트 설명
tools: Read, Write, Edit, Bash, Glob, Grep
---
```

### 3. 슬래시 커맨드 생성

`.claude/commands/` 폴더에:

- setup.md
- status.md
- phase-complete.md

### 4. 상태 파일 초기화

`.claude/state/` 폴더에:

- goals.md
- references.md
- progress.json

### 5. 정보 수집

생성 완료 후 나에게 다음을 물어봐:

- 프로젝트 목표
- 세부 태스크 (선택)
- 참고 자료 (선택)
- 기술 스택

### 6. 파일 업데이트

입력받은 정보로:

- goals.md 업데이트
- references.md 업데이트
- progress.json 초기화

### 7. CLAUDE.md 업데이트

SETTING.md의 "CLAUDE.md 템플릿" 참고해서 업데이트

### 8. 초기화 로그

`.claude/state/logs/phase-0.md` 작성

### 9. 완료 안내

```
✅ 초기화 완료!

⚠️ 중요: /agents 메뉴에서 에이전트를 보려면
   Claude Code를 재시작하세요 (exit 후 claude 다시 실행)

다음 단계:
1. Claude Code 재시작
2. /agents 명령어로 에이전트 확인
3. Phase 1 시작
```

```

---

## 🎯 목표/레퍼런스 포함 버전

```

프로젝트 루트에 있는 SETTING.md 파일을 읽고 초기화를 진행해줘.

## 프로젝트 정보

**목표**: [최종 목표]

**세부 태스크**:

- [ ] [태스크 1]
- [ ] [태스크 2]
- [ ] [태스크 3]

**참고 자료**:

- [문서/링크 1]
- [문서/링크 2]

**기술 스택**: [예: Next.js 14, TypeScript, Tailwind]

**필요한 에이전트**:

- orchestrator (필수)
- code-writer (필수)
- test-writer
- reviewer

---

위 정보를 바탕으로:

1. `.claude/agents/` 폴더에 서브에이전트 파일 생성
   - 각 파일에 YAML frontmatter 필수 (name, description, tools)
2. `.claude/commands/` 폴더에 슬래시 커맨드 생성

3. `.claude/state/` 폴더에 상태 파일 생성 및 입력 정보로 채우기

4. CLAUDE.md 업데이트

5. phase-0.md 로그 작성

6. 완료 후 Claude Code 재시작 안내

```

---

## 🔧 TDD 워크플로우 버전

```

프로젝트 루트에 있는 SETTING.md 파일을 읽고 TDD 워크플로우를 위한 초기화를 진행해줘.

## 프로젝트 정보

**목표**: [목표]
**기술 스택**: [스택]

## TDD 에이전트 구성

`.claude/agents/` 폴더에 다음 에이전트들을 생성해줘:

### 1. orchestrator.md

- 전체 TDD 사이클 조율
- Red → Green → Refactor 순서 관리

### 2. test-designer.md

```markdown
---
name: test-designer
description: 테스트 케이스를 설계합니다. 기능 구현 전 테스트 설계가 필요할 때 호출됩니다.
tools: Read, Grep, Glob
---

테스트 케이스 설계 전문가입니다.
기능 요구사항을 분석하고 테스트 케이스를 정의합니다.
```

### 3. test-writer.md

```markdown
---
name: test-writer
description: 테스트 코드를 작성합니다. 테스트 설계 완료 후 실제 테스트 코드가 필요할 때 호출됩니다.
tools: Read, Write, Edit, Bash, Glob, Grep
---

테스트 코드 작성 전문가입니다.
설계된 테스트 케이스를 실제 코드로 구현합니다.
```

### 4. code-writer.md

```markdown
---
name: code-writer
description: 테스트를 통과하는 코드를 구현합니다. 실패하는 테스트가 있을 때 호출됩니다.
tools: Read, Write, Edit, Bash, Glob, Grep
---

코드 구현 전문가입니다.
테스트를 통과하는 최소한의 코드를 작성합니다.
```

### 5. refactorer.md

```markdown
---
name: refactorer
description: 코드 리팩토링을 담당합니다. 테스트 통과 후 코드 개선이 필요할 때 호출됩니다.
tools: Read, Write, Edit, Bash, Glob, Grep
---

리팩토링 전문가입니다.
테스트가 통과하는 상태를 유지하면서 코드를 개선합니다.
```

---

나머지 초기화 (state, commands, CLAUDE.md)도 진행하고
Claude Code 재시작 안내해줘.

```

---

## 📋 기존 프로젝트에 추가

```

프로젝트 루트에 있는 SETTING.md 파일을 읽고
기존 프로젝트에 에이전트 시스템을 추가해줘.

## 현재 상태

- [완료된 작업]
- [남은 작업]

## 요청사항

1. `.claude/` 폴더 구조만 추가 (기존 파일 수정 X)

2. 에이전트 생성:

   - orchestrator.md
   - code-writer.md

3. 상태 파일에 현재 상태 반영:

   - progress.json의 currentPhase를 [N]으로 설정
   - goals.md에 남은 작업 기록

4. CLAUDE.md에 에이전트 시스템 섹션만 추가 (기존 내용 유지)

5. Claude Code 재시작 안내

```

---

## ⚡ 빠른 초기화 (최소 버전)

```

SETTING.md를 읽고 최소한의 에이전트 시스템을 설정해줘.

필요한 것:

1. `.claude/agents/orchestrator.md` - YAML frontmatter 포함
2. `.claude/agents/code-writer.md` - YAML frontmatter 포함
3. `.claude/state/progress.json` - 빈 상태로 초기화

목표: [한 줄 목표]
기술: [기술 스택]

설정 완료 후 Claude Code 재시작 안내해줘.

```

---

## 🔍 초기화 후 확인 프롬프트

Claude Code 재시작 후:

```

/agents 명령어로 등록된 에이전트 목록을 확인하고,
각 에이전트가 제대로 설정됐는지 알려줘.

확인 항목:

1. orchestrator가 보이는가?
2. code-writer가 보이는가?
3. 다른 에이전트들은?

문제가 있다면 해결 방법도 알려줘.

```

---

## 🛠️ 트러블슈팅 프롬프트

### 에이전트가 안 보일 때

```

.claude/agents/ 폴더의 파일들을 확인해줘.

확인할 것:

1. 파일이 존재하는가?
2. YAML frontmatter가 올바른가?
   - --- 로 시작하고 끝나는가?
   - name, description 필드가 있는가?
   - 콜론(:) 뒤에 공백이 있는가?

문제가 있으면 수정해줘.

```

### 에이전트가 규칙을 안 따를 때

```

.claude/agents/[에이전트명].md 파일을 열어서
시스템 프롬프트를 더 명확하게 수정해줘.

추가할 것:

- "## 금지사항" 섹션에 구체적인 규칙
- "## 필수사항" 섹션에 반드시 해야 할 것
- description을 더 구체적으로

````

---

## 📌 핵심 포인트

1. **YAML frontmatter 필수**
   ```markdown
   ---
   name: agent-name
   description: 설명
   tools: Read, Write
   ---
````

2. **Claude Code 재시작 필수**

   - 에이전트 파일 생성/수정 후
   - `exit` → `claude` 다시 실행

3. **/agents로 확인**

   - 에이전트가 제대로 등록됐는지 확인

4. **description이 중요**
   - Claude가 언제 이 에이전트를 호출할지 결정하는 기준
