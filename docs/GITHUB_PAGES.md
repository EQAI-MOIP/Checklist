# GitHub Pages 공개 방법

이 저장소의 루트 `index.html`이 시작 화면입니다. HTML·CSS·JavaScript·WebP 파일을 그대로 제공하는 정적 사이트이며 빌드, 서버 프로그램, API 키가 필요하지 않습니다. 사용자의 심사 기록을 받는 API나 서버 데이터베이스는 없습니다.

## 처음 공개할 때

1. GitHub 저장소의 **Settings → Pages**로 이동합니다.
2. **Build and deployment → Source**에서 **Deploy from a branch**를 선택합니다.
3. Branch는 **main**, 폴더는 **/(root)**로 지정하고 **Save**를 누릅니다.
4. GitHub가 표시하는 배포 진행과 최종 사이트 주소를 확인합니다. 기본 프로젝트 주소는 `https://eqai-moip.github.io/Checklist/`입니다. 이 문서는 해당 주소의 활성화를 확인했다는 의미가 아닙니다.
5. **Enforce HTTPS**가 활성화되었는지 확인합니다.

`.nojekyll`은 Jekyll 변환 없이 정적 파일을 제공하기 위한 표시입니다. 루트에 이미 시작 파일이 있으므로 `/docs`를 공개 폴더로 선택하지 않습니다. 별도 배포용 GitHub Actions 설정은 필요하지 않습니다. 저장소의 `Checklist verification` workflow는 코드와 합성 자료를 검증하며 사이트를 배포하지 않습니다. GitHub 자체의 Pages 배포 작업은 Actions 탭에 따로 표시될 수 있습니다.

현재 계정의 요금제와 저장소 공개 범위에 따라 Pages 사용 가능 여부가 달라집니다. 비공개 저장소에서 공개 웹사이트를 만들 수 있는 요금제도 있으므로, 사이트 공개를 위해 저장소 자체를 반드시 공개로 바꿀 필요는 없습니다. Pages에서 제공할 파일에는 실제 심사 기록이나 내려받은 백업 파일을 커밋하지 않습니다.

## 이용자가 알아야 할 저장 방식

- 출원번호, 점검 결과, 근거, 메모는 이용 중인 컴퓨터의 해당 브라우저 저장소에 저장됩니다. 다른 사람의 브라우저에 동기화하거나 GitHub에 업로드하는 기능은 없습니다.
- 사이트에 접속할 때는 HTML·JavaScript·CSS·이미지를 받아야 하므로 호스팅 서버와 통신합니다. GitHub는 보안 목적으로 방문자의 IP 주소를 기록한다고 안내합니다. 이것은 앱에 입력한 심사 내용의 업로드와 구별됩니다.
- 자동 저장은 같은 브라우저 프로필과 같은 사이트 주소에서 이어집니다. 브라우저 데이터 삭제, 시크릿 창 종료, 저장 차단 등에 대비해 JSON 백업을 보관합니다.
- `localStorage`는 사이트의 경로별이 아니라 **출처(프로토콜·호스트·포트)**별 공간입니다. 같은 `eqai-moip.github.io` 출처의 다른 앱과 기술적으로 격리된 저장소가 아닙니다. 운영자가 같은 출처에 게시하는 다른 코드도 신뢰할 수 있어야 합니다. 별도 출처가 필요하면 별도 호스트의 전용 사용자 지정 도메인을 검토합니다.
- 앱 자체는 브라우저 기록이나 JSON 백업을 암호화하지 않습니다. 같은 PC·브라우저 프로필을 사용하는 사람과 다운로드 폴더에 접근하는 사람은 기록을 볼 수 있으므로 개인 업무용 프로필에서 사용합니다.
- 이전에 `file://`로 사용한 기록이 웹사이트에 자동으로 나타나지는 않습니다. 기존 앱에서 전체 JSON 백업을 내려받은 뒤 새 사이트의 **백업·설정**에서 불러옵니다. 주소나 브라우저를 옮길 때도 같은 절차를 사용합니다.

## 변경 후 확인

개발 환경의 Node.js에서 아래 명령을 실행합니다. 이 검증 도구는 배포된 앱의 실행 의존성이 아닙니다.

```sh
node scripts/check-site.cjs
node --test tests/*.test.cjs
```

설치된 Chromium과 Playwright를 사용할 수 있는 개발 환경에서는 실제 브라우저 검증도 실행합니다. 테스트가 패키지를 설치하거나 인터넷에서 가져오지는 않습니다.

```sh
QURI_BROWSER_TEST=1 node --test tests/browser-flow.test.cjs tests/public-site.test.cjs
```

Windows PowerShell에서는 다음과 같이 실행합니다.

```powershell
$env:QURI_BROWSER_TEST = "1"
$env:QURI_CHROMIUM = "C:\Program Files\Google\Chrome\Application\chrome.exe"
node --test tests/browser-flow.test.cjs tests/public-site.test.cjs
```

`scripts/check-site.cjs`는 `/Checklist/` 아래의 상대 자원 경로, 파일 존재, WebP 형식, 주요 CSP 제한, Referrer 정책과 명시적인 네트워크 API 사용 여부를 검사합니다. 이는 변경 실수를 잡는 검증이며 모든 형태의 악성 코드나 브라우저 확장 프로그램을 검증하는 도구는 아닙니다.

`public-site.test.cjs`의 브라우저 검증은 합성 자료만 사용하여 프로젝트 하위 경로에서 실행, 새로고침 후 기록 보존, JSON 백업, 별도 브라우저 프로필의 분리, HTTP 요청에 입력 내용이 포함되지 않는지, CSP가 실제 POST 전송을 차단하는지 확인합니다. 실제 GitHub 공개 주소의 운영 상태는 배포 후 별도로 확인합니다.

GitHub의 **Actions → Checklist verification**에서도 같은 검증을 실행합니다. 푸시와 PR 변경 시 Node.js 24에서 로직 검증과 실제 Chromium의 `file://`·HTTP 검증을 수행합니다. 브라우저 검증 도구는 CI 임시 폴더에 고정 버전 `playwright@1.62.1`로 설치하며 사이트에서 내려받거나 실행하지 않습니다. 공식 GitHub Actions는 확인한 커밋으로 고정했습니다. 실행 로그와 합성 화면 PNG는 해당 실행의 `checklist-verification-…` 아티팩트에서 확인합니다.

## 운영 시 유의점

해시 경로(`#case/...`, `#privacy` 등)를 사용하므로 점검 화면을 새로고침할 때 별도 서버 라우팅 설정이 필요하지 않습니다. 앱 자원 경로는 상대 경로라 저장소 이름 아래에서도 작동합니다. 파일을 받아 오프라인으로 이용할 때는 폴더 구조를 유지하고 `index.html`을 엽니다.

자동 저장 공간의 키나 백업 형식을 바꾸는 경우에는 기존 사용자 기록을 먼저 고려해야 합니다. 보안 정책의 `connect-src 'none'` 및 `form-action 'none'`을 완화하거나 분석 도구·외부 스크립트를 추가하려면 입력 내용의 처리 방식과 화면 안내를 다시 검토해야 합니다.

## 공식 문서

- [GitHub Pages 공개 원본 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pages 및 방문 정보 수집](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Pages HTTPS 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [MDN: localStorage와 출처·브라우저별 저장 동작](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

문서 확인일: 2026-11-23.
