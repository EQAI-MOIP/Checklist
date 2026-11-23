# v1.2.0 입력 내용 저장·전송 검토

검토 기준: `fedcb9bb3e42c5084b57f40b28e6ca0eeaf2d526`에서 시작한 v1.2.0 변경. 검토일: 2026-11-23.

## 확인한 구조

출원번호, 점검 결과, 근거·메모, 청구항별 기록, 변경 이력은 `js/core.js`가 검증한 작업 객체에 포함됩니다. `js/app.js`는 `localStorage`의 `quri.examiner.workspace.v1`에 이를 저장하며, 마지막 점검 위치는 `quri.examiner.cursor.v1`에 따로 저장합니다. 기존 저장소 키와 v1 JSON 백업 형식은 유지했습니다.

실행 코드는 `fetch`, XMLHttpRequest, WebSocket, EventSource, sendBeacon, WebRTC, 서비스 워커, 외부 분석·AI API를 사용하지 않습니다. 모든 실행용 JavaScript·CSS·WebP는 저장소 안에 있습니다. 외부 출처 주소는 기준의 출처 설명 또는 사용자가 직접 누르는 안내 링크이며, 사용자 입력을 링크에 결합하지 않습니다.

백업은 브라우저 `Blob`과 다운로드 링크로 생성합니다. 가져온 JSON은 `File.text()`로 읽고 브라우저에서 검증·복원합니다. 보고서는 브라우저 인쇄 기능으로 출력합니다. 서버로 데이터를 올리는 처리 경로가 없습니다. 출원번호는 브라우저 제목에서 제거했으며, 해시 경로에 내부 사건 식별자만 사용합니다.

## 방어 조치

- CSP의 `connect-src 'none'`, `form-action 'none'`, `script-src 'self'`, `object-src 'none'`, `base-uri 'none'` 유지
- `no-referrer` 정책 적용
- 입력 문자열을 HTML에 넣기 전에 이스케이프
- JSON 스키마·버전·길이·허용 키 검사, 위험 객체 키 거부
- CSV의 수식 시작 문자 이스케이프
- 자동 저장 성공 후 재읽기 검증, 실패·손상·충돌의 명시적 안내
- Web Locks 지원 환경의 단일 편집 탭 보호. 미지원 환경에는 단일 창 사용 안내
- 외부 저장 변경 중 열린 추가 정보·확인 창을 조용히 새 데이터와 혼합하지 않음
- 저장소 전체 삭제 이벤트에서도 화면의 작업을 보존하고 백업·재불러오기를 안내
- 다운로드 요청과 파일의 실제 저장 완료를 구분하는 안내

일반 체크 입력은 메모리의 작업 데이터에도 반영하므로 자동 저장 실패 시 JSON 백업으로 보존할 수 있습니다. 추가 정보 다이얼로그의 미저장 초안은 저장 버튼을 누르기 전까지 작업 JSON에 포함되지 않으며, 충돌 안내에서 별도 보관을 요청합니다.

## 안내 문구의 범위

“이 앱은 입력 내용을 서버로 전송하지 않습니다”는 검토한 앱 코드의 동작을 설명합니다. “아무런 통신도 없다”, “완전히 암호화되어 있다”, “기록이 절대로 사라지지 않는다”, “모든 다른 페이지와 격리된다”는 보장은 하지 않습니다.

웹사이트 방문 시 정적 파일을 내려받으며 GitHub Pages는 보안 목적으로 방문 IP를 기록한다고 설명합니다. 브라우저 확장 프로그램, 브라우저 부가 서비스, 운영체제, 인쇄 대상, 다운로드 폴더의 동기화는 이 앱의 통제 범위 밖입니다. 앱 자체는 저장 데이터와 백업 파일을 암호화하지 않습니다.

`localStorage`는 같은 프로토콜·호스트·포트를 공유하는 페이지가 접근할 수 있습니다. `https://eqai-moip.github.io/Checklist/`와 같은 호스트의 다른 프로젝트는 서로 다른 경로라도 같은 출처입니다. 앱별 키 이름은 보안 격리를 제공하지 않습니다. 별도 격리가 필요한 경우 전용 호스트로 운영하고 기존 JSON 백업을 새 주소에 불러옵니다.

Web Locks는 이 잠금 규칙을 사용하는 탭 사이의 쓰기를 조정합니다. 오래된 버전이나 다른 동일 출처 코드는 잠금을 우회할 수 있으므로 같은 출처에 게시하는 코드의 신뢰와 배포 관리가 필요합니다. 잠금 API가 없는 환경에서는 저장 버전·원문 비교가 모든 동시 쓰기를 원자적으로 보장하지 않습니다.

## 검증 방법

`scripts/check-site.cjs`는 실행 자원과 주요 통신 API·CSP·상대 경로를 검사합니다. `tests/public-site.test.cjs`의 명시적 실제 브라우저 검증은 합성 출원·근거를 사용하여 HTTP 요청 URL·본문, 브라우저 제목, 새로고침·백업, 별도 프로필, 두 탭 편집권과 실제 CSP 차단을 확인합니다. 정적 패턴 검사는 모든 악성 코드 가능성을 증명하는 보안 분석 도구가 아니며, 실제 실행 상태와 결과는 [검증 기록](VALIDATION.md)에 구분합니다.

## 공식 근거

- [GitHub Pages의 정적 호스팅과 IP 기록](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [MDN: localStorage, 출처, 시크릿 창, file 주소의 차이](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: 동일 출처 정책](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)
- [MDN: Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API)
