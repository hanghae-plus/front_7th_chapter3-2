---
description: 현재 페이즈를 완료하고 로그를 작성합니다
---

현재 페이즈를 완료 처리합니다.

## 필수 수행 작업

1. **로그 작성**
   `.claude/state/logs/phase-[현재번호].md` 생성:

   - 완료된 작업 목록
   - 생성/수정된 파일
   - 발생한 이슈와 해결
   - 다음 단계

2. **progress.json 업데이트**

   - 현재 페이즈 status: "completed"
   - currentPhase 증가
   - lastUpdated 갱신

3. **완료 메시지 출력**

```
✅ Phase [N] 완료
📝 로그: .claude/state/logs/phase-[n].md
📊 진행률: [X/Y] 페이즈 완료
➡️ 다음: Phase [N+1] - [이름]
```

$ARGUMENTS
