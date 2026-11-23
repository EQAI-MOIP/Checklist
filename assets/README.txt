QURI 체크리스트 v1.1.0 — 포함된 이미지의 출처와 사용 정보

원본 저장소: https://github.com/EQAI-MOIP/AI_Reviewer
고정 커밋: 4d078c8256953de164d8b13196502440c0fc30d0
확보일: 2026-11-23 (한국 표준시)

모든 WebP는 위 저장소에서 가져온 원본 바이트입니다. 확대, 축소, 재인코딩하지 않았습니다.
이 패키지는 기존 저작물의 권리를 확장하거나 별도의 공개 라이선스를 부여하지 않습니다.
AI_Reviewer의 원본 출처 표시는 original-notice.txt에 보존했습니다.

1. quri-v3-motion-16frames.webp
   크기: 1254×1254 pixels, RGBA, 4열×4행, 16프레임
   셀: 313.5×313.5 pixels, 비율 좌표로 표시
   크기: 468,350 bytes
   SHA-256: 9d7cefccfffc8c82dca087d980e852e1bf6b948c990c9d30789b06251f1c6738
   인사·안내·원문 검토·점검 완료를 각 4프레임으로 표현합니다.
   한 동작의 재생 순서: 0 → 1 → 2 → 3 → 2 → 1
   앱의 표시 크기: 화면에 따라 72~156 CSS px.
   156px에서도 원본 셀(313.5px)이 표시 크기의 2배 이상입니다.
   원본 프레임 메타데이터: quri-v3-sprites.json

2. quri-v2-guide-6frames.webp
   크기: 1536×1024 pixels, RGBA, 3열×2행, 셀512×512 pixels
   크기: 335,482 bytes
   SHA-256: b47271533a4a6c3d445d865552a17cf6c6fa547dccc2ca844bb21dd946902cf8
   큰 설명 패널에서 사용할 환영·자료정리·대조·확인·설명·정리 포즈입니다.
   원본 메타데이터: quri-v2-sprites.json

3. review-states-6frames.webp
   크기: 1536×1024 pixels, RGBA, 3열×2행, 셀512×512 pixels
   크기: 454,848 bytes
   SHA-256: 2a39312401baf68c53210b63d0428c2eb4761fc00ca666e4b74452625e12e2aa
   자료확보·판본·대조·발견·정리·자료부족 포즈입니다.
   원본 메타데이터와 생성 기록: review-sprites.json

이 앱의 플레이어(js/quri-sprite.js)는 브라우저 기본 기능으로 새로 작성했습니다.
실제 프레임을 바꾸어 재생하며 외부 이미지, 라이브러리, CDN에 연결하지 않습니다.
v1.1.0은 새로운 그림을 생성하지 않고 기존 실제 동작을 점검 상황에 연결합니다.

현재 플레이어의 논리 상태와 실제 동작:
- welcome: 인사 행
- review, evidence, decision: 안내·가리키기 행
- document, compare, thinking: 원문을 읽는 행
- success, complete, save: 완료 행
- attention: 읽기 행의 정지 프레임(기존 API 호환용)

문서 준비·청구항 대조·근거 입력·보완 정리·필수 기록 완료에 따라
안내 문구와 논리 상태가 바뀝니다. 서로 다른 상황이 같은 실제 동작을 사용할 수 있습니다.
보완을 안내하는 현재 화면은 decision 상태의 실제 프레임을 재생합니다.
동일 인스턴스에는 상황별 접근성 설명과 실제 동작 식별자를 함께 표시합니다.

정지 포즈 API에는 기존 v2의 welcome/upload/compare/thoughtful/explain/complete와
검토 상태용 documents/claims/compare-notices/finding/no-findings/missing-documents를
제공합니다. 정지 포즈를 차례로 바꾸어 새 연속 애니메이션이라고 표시하지 않습니다.

운영체제의 동작 줄이기와 앱의 모션 끄기 설정을 따릅니다.
점검 화면의 큐리 안내 옆 멈춤/재생 버튼도 같은 설정을 변경합니다.
운영체제에서 동작 줄이기가 켜져 있으면 앱에서 재생을 선택해도 정지 화면을 유지합니다.
숨겨진 탭과 화면 밖 캐릭터의 재생을 멈추고 제거된 인스턴스의 타이머를 정리합니다.
캐릭터는 안내용이며 자동 법률 판단·AI 분석·검토 성공을 추정하지 않습니다.
