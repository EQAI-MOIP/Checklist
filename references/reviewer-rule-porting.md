# AI 심사팀장 큐리 — 규칙 이식 명세

## 기준과 보존 범위

- 원본 스킬: **AI 품질진단 시스템** (`kipris-notice-review-portable`).
- `skill.json` 확인 버전: **2026.11.12**, 유형 `diagnostic`, 배포형 `portable`, release ID `diagnostic-portable-2026.11.12`.
- 확인 날짜: 2026-11-22.
- 원본 파일은 `rules/`에 내용 그대로 보존했습니다. `APIKEY.md` 및 실제 키는 읽거나 복사하지 않았습니다.
- `js/rules-data.js`는 원문에서 추출한 데이터와 조건 검증 보조 함수를 담은 독립 JavaScript입니다. 외부 모듈·CDN·실행 중 규칙 다운로드가 없습니다.

| 규칙군 | 범위 | 수 | 적용 대상 |
|---|---|---:|---|
| OA | OA-01–OA-17 | 17 | 각 의견제출통지서·최후통지서를 독립 검토 |
| RD | RD-01–RD-06 | 6 | 거절결정서와 결정 이전의 모든 통지 비교 |
| RC | RC-01–RC-07 | 7 | 특허결정·등록 시점의 전체 유효 청구항 |
| 공식 진단코드 | 01xx–10xx, 12xx–15xx | 84 | 원문 문구의 경과·효과·증거 조건을 확인해 부여 |

OA/RD/RC는 검사 절차의 식별자이며 네 자리 진단코드는 확인된 문제의 유형입니다. 두 체계는 별도로 저장합니다. `11xx` 코드는 원문에 없으므로 만들지 않습니다. 15xx 우수사례 코드는 보존하되 반려사유로 집계하지 않습니다.

공식 코드 문구의 출처는 스킬에 포함된 사용자 제공 「심사품질 진단기준」(2026. 9. 개정)입니다. 해당 파일은 원문 첫 문장 84개와 적용 안내를 제공하며, 원문 사례의 모든 세부 내용을 완전하게 재현한 자료라고 주장하지 않습니다. OA-17의 판례 내용과 사용자 확인 운영 기준을 구별하는 원문도 유지했습니다.

## 결과의 상태와 코드 확정

사용자 화면의 문구는 **반려 검토사항이 있어요**, **적용한 규칙에서 발견되지 않았어요**, **추가 확인이 필요해요**를 구별합니다. '적용한 규칙에서 발견되지 않았어요'는 적용 범위와 확보 범위가 충분하고 확인된 문제가 없을 때 사용합니다. 통지 누락·판본 미확보·인용문헌 미대조·검토 실패를 문제없음으로 변환하면 안 됩니다. 코드 없는 조건부 점검도 결과에서 보존합니다.

다음은 원문의 조건을 구현할 때 특히 보존한 사항입니다.

| 코드·규칙 | 이식 원칙 |
|---|---|
| 0511 | 최종 유효 청구범위에 명확성·해석 하자가 남은 채 특허결정되었는지 확인. RC-07의 단어 발견만으로 확정하지 않음. |
| 0512 / 0521 | 같은 청구범위 오지적이라도 해당 이유로 거절결정했고 다른 정당한 이유가 없는지에 따라 구별. OA-05·11·12 사례의 0521 표기를 결과 경과보다 우선하지 않음. |
| 04xx / 05xx / 06xx | 발명의 설명 기재요건, 청구범위 기재요건, 청구범위 기재방법을 구분. |
| OA-15 / 1024 | 모든 최후통지에 적용. 보정 전후 전체 청구범위와 이유 발생의 인과관계를 비교. |
| 1031 | 최초부터 있던 이유의 분할 통지 및 정당한 사유 예외를 따로 확인. 1024와 자동 중복 집계하지 않음. |
| OA-14 / 1231 | 통지서 자체만으로 명백히 정정되는 단순오기는 제외. 원문을 읽어야 정정되는 오기는 실제 인용발명 대조 후 확정. |
| RD-01–RD-05 | 의견서가 없어도 확보한 통지·결정으로 판정 가능한 사항은 계속 검토. 선행 통지 누락 시 '전부에 없음' 확정 금지. |
| RD-06 / 1311 | 실제 출원인 주장·보정내용과 최종결정에 미친 명백한 영향의 근거 필요. |
| OA-17 / RC-07 | 선호·강조의 이중한정은 필수 검토. 선택적 '임의로'와 구별. 발명의 설명만의 표현·삭제항 제외. |

`validateFinding()`은 원문의 증거·경과 조건에 대한 보조 검증입니다. 코드가 유효한 목록에 있다는 사실만으로 실체 판단을 대신하지 않으며, 이 함수의 통과가 법적 타당성을 보증하지 않습니다. 판정에는 원문 대조와 모델 검토가 함께 필요합니다.

## 토큰 관리

규칙 원문을 의미 손실이 생기는 글자 수로 잘라내지 않습니다. 규칙 ID 경계를 기준으로 배치를 나누고, 원문 전체·보류 예외·관련 코드 조건을 함께 전달합니다. 별도의 전역 운영 지침은 원본의 핵심 판본·원문·증거·예외 요구를 압축해 반복 전달합니다.

`buildRuleBatches({ group:'OA', maxTokens:16000, reserveTokens:2048 })`는 규칙 경계를 유지한 배치를 생성합니다. 여기서 `maxTokens`는 그 호출의 규칙 배치 예산이며 앱 전체의 기본 50,000 토큰 설정을 변경하는 값이 아닙니다. 증거·출력·API 포맷 여유는 호출자가 따로 배정해야 합니다. `estimatedTokens`는 모델 전용 토크나이저 없이 계산한 UTF-8 바이트 상한이므로 실제 토큰 수가 아닙니다. `oversized:true`인 배치는 그대로 전송하지 말고 입력을 더 작은 범위로 재구성해야 합니다.

문서의 경우 페이지·문헌 식별자·청구항·날짜·짧은 인용을 요약에 함께 보존해야 합니다. 요약만으로 원문 대조 완료를 선언하거나 생략 부분의 부재를 확정하지 않아야 합니다.

## JavaScript 인터페이스

브라우저 전역 `ReviewRules`, Node 테스트에서는 `require('./js/rules-data.js')`로 사용합니다.

```js
ReviewRules.version;                      // '2026.11.12'
ReviewRules.counts;                       // OA:17, RD:6, RC:7, rules:30, codes:84
ReviewRules.groups.OA;                    // 규칙 객체 배열
ReviewRules.byId['OA-15'].fullText;        // 예외까지 포함한 원문
ReviewRules.codes['0512'].description;     // 공식 코드 문구
ReviewRules.selectRules(['OA-14','OA-15']);
ReviewRules.applicabilityFor({documentType:'final_notice'});
ReviewRules.buildRuleBatches({group:'RC',maxTokens:16000});
ReviewRules.validateFinding(finding,context);
```

규칙 객체는 `id`, `group`, `title`, `fullText`, `fields`, `purpose`, `inputs`, `exceptions`, `sourcePath`, `mentionedCodes`를 제공합니다. 코드 객체는 `code`, `title`, `description`, `category`, `conditions`, `sourcePath` 및 일부 코드의 `operatingNote`를 제공합니다.

조건 검증에 사용할 확인값은 `context.verification`에 앱이 원문·메타데이터를 확인한 명시적인 불리언으로 전달합니다. 모델이 생성한 `finding.verification`이나 `conditions`를 증거 검증값으로 신뢰하지 않습니다. 누락된 값을 자동으로 참 또는 거짓으로 가정하지 않습니다. 예: `claimVersionVerified`, `grantDecisionVerified`, `rejectionDecisionVerified`, `hasOtherValidReasons`, `priorNoticesComplete`, `sourceEvidenceVerified`, `documentIdentityVerified`. `evidence` 항목에는 문서 식별자·쪽수 또는 위치·원문을 넣습니다.

## 원문 파일 체크섬

원문 보존 확인용 SHA-256입니다.

| 파일 | SHA-256 |
|---|---|
| `rules/SKILL.md` | `fb29c9292c5d91f8cf2aab3a8ae10ceb15c82c293e9d28f753180523bc61acdf` |
| `rules/references/diagnostic-codes.md` | `c8e001713c59b87d628d4ad40adaae190e33ea1814bec2cd1c2fe91403244031` |
| `rules/references/office-action-rules.md` | `39b3b73d7a1bfc52da957e0fafeaec478f2d30a13e1f532ed5091b85a1dc51ef` |
| `rules/references/registered-claim-rules.md` | `467436605a78a62b7cd664ff605c7d4152b1758ef34af52956d7b14efc8e0ebc` |
| `rules/references/rejection-decision-rules.md` | `59d3dad87ed751435c820e4d58e5dbb0cafd45018f76b8b18d9830183c8e2f1d` |
| `rules/skill.json` | `4545f61ed3717010d2a36e21d98a0cc20b617010421d3e3ceffb59aeb5612c1c` |
