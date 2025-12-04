---
description: 프로젝트 초기 세팅을 시작합니다
---

SETTING.md 파일을 읽고 프로젝트 초기화를 진행합니다.

## 수행할 작업

1. **폴더 구조 생성**

   - `.claude/agents/` 생성
   - `.claude/commands/` 생성
   - `.claude/state/` 생성
   - `.claude/state/logs/` 생성

2. **기본 에이전트 생성** (SETTING.md의 템플릿 참조)

   - orchestrator.md
   - code-writer.md
   - test-writer.md (선택)
   - reviewer.md (선택)

3. **상태 파일 초기화**

   - goals.md
   - references.md
   - progress.json

4. **정보 수집**
   사용자에게 다음을 질문:

   - 프로젝트 목표
   - 세부 태스크
   - 참고 자료
   - 기술 스택
   - 필요한 에이전트

5. **CLAUDE.md 업데이트**

6. **초기화 로그 작성**
   - `.claude/state/logs/phase-0.md`

$ARGUMENTS
