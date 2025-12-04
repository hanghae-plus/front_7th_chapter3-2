---
description: 현재 프로젝트 진행 상황을 확인합니다
---

프로젝트의 현재 상태를 확인합니다.

## 확인 항목

1. **현재 페이즈**
   - `.claude/state/progress.json` 읽기
   - 현재 페이즈와 상태 출력

2. **목표 확인**
   - `.claude/state/goals.md` 읽기
   - 남은 태스크 목록 출력

3. **최근 로그**
   - `.claude/state/logs/` 폴더의 최신 로그 확인

## 출력 형식

```
📊 프로젝트 현황

Phase: [현재 페이즈] / [전체 페이즈]
상태: [in-progress / completed]

📋 남은 태스크:
- [ ] 태스크 1
- [ ] 태스크 2

📝 최근 활동:
- ...
```

$ARGUMENTS
