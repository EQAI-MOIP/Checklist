/* QURI Examiner Checklist — self-review catalog. No external dependencies.
   Questions/guidance are an editorial adaptation; reference texts preserve repository sources. */
(function (root) {
  'use strict';
  root.QURI_RULES = {
  "version": "1.0.0",
  "sourceDate": "2026-11-23",
  "catalogNotice": "체크 질문과 안내문은 저장소의 규칙을 수동 자기점검용으로 재구성한 것입니다. 공식 진단기준의 전체 매뉴얼이나 최신 법령을 대체하지 않습니다. 4자리 코드는 자동 부여하지 않으며, 원문의 결정 경과·증거·예외 조건을 확인해 기록합니다.",
  "sources": [
    {
      "name": "EQAI_sheet / 2026-Q3.v1",
      "commit": "25fe5aaf25ad1dd6169cb4237723bb8c94b98e58",
      "url": "https://github.com/EQAI-MOIP/EQAI_sheet/tree/25fe5aaf25ad1dd6169cb4237723bb8c94b98e58"
    },
    {
      "name": "AI_Reviewer / 내장 진단규칙 2026.11.12",
      "commit": "4d078c8256953de164d8b13196502440c0fc30d0",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/tree/4d078c8256953de164d8b13196502440c0fc30d0"
    }
  ],
  "categories": [
    {
      "id": "preparation",
      "title": "01 · 자료와 점검 범위",
      "shortTitle": "자료 준비",
      "description": "출원번호, 문서 시점, 전체 청구항과 검토 범위를 먼저 고정합니다.",
      "perspective": "공통 준비",
      "items": [
        {
          "id": "PREP-01",
          "title": "출원번호와 대상 사건",
          "question": "출원번호와 문서의 사건번호가 일치하고, 점검할 단계·문서일자를 기록했나요?",
          "standard": "자료의 사건 동일성과 대상 문서·시점을 확인합니다.",
          "guidance": "최초 통지, 최후 통지, 거절결정, 등록검토 중 실제 점검 대상을 선택하세요. 다른 사건의 자료가 섞이지 않았는지 확인합니다.",
          "evidenceHint": "출원번호 / 문서 종류 / 문서일자 / 문서 식별자",
          "codeRefs": [],
          "sourceRefs": [
            "codes",
            "sheet-rules"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "PREP-02",
          "title": "행정처리·문서 연혁",
          "question": "통지·보정·의견서·결정을 날짜순으로 정리하고 누락 자료를 표시했나요?",
          "standard": "확보하지 못한 문서의 내용·존재 여부를 추정하지 않습니다.",
          "guidance": "문서 목록의 발송·접수 순서를 기록하세요. 이전 통지가 하나라도 빠졌다면 '모든 통지에 없음'으로 결론 내리지 않습니다.",
          "evidenceHint": "문서 종류별 일자·번호 / 누락 목록 / 추가 확인 계획",
          "codeRefs": [
            "1011",
            "1022",
            "1031"
          ],
          "sourceRefs": [
            "RD-05",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "PREP-03",
          "title": "해당 시점의 청구범위",
          "question": "현재 점검할 문서 직전의 청구범위와 보정 전후 판본을 구분했나요?",
          "standard": "통지 당시 청구범위와 등록·결정 당시 청구범위를 혼용하지 않습니다.",
          "guidance": "청구항 번호만 비교하지 말고 문언·추가/삭제 구성·인용관계로 대응시키세요. 판본이 없으면 미확인 상태를 유지합니다.",
          "evidenceHint": "청구범위 판본일 / 보정 접수일 / 항별 대응표",
          "codeRefs": [
            "0511",
            "1024"
          ],
          "sourceRefs": [
            "OA-15",
            "RC-07"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "PREP-04",
          "title": "전체 청구항·인용관계",
          "question": "유효한 전체 청구항을 확인하고 독립항·종속항의 직접·간접 인용관계를 기록했나요?",
          "standard": "공통 이유와 간접 지정 범위를 판단하려면 전체 청구항 집합이 필요합니다.",
          "guidance": "취소·삭제항은 유효항과 분리하세요. 다중 인용 경로를 펼쳐 누락항·존재하지 않는 항을 찾습니다.",
          "evidenceHint": "유효 청구항 목록 / 직접·간접 인용항 / 삭제항",
          "codeRefs": [
            "0533",
            "0622"
          ],
          "sourceRefs": [
            "OA-01",
            "RC-01",
            "RC-02"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "PREP-05",
          "title": "명세서·도면 확보",
          "question": "발명의 설명과 도면의 확보 범위 및 읽은 부분을 기록했나요?",
          "standard": "설명·도면이 필요한 판단을 청구항 일부만으로 확정하지 않습니다.",
          "guidance": "모든 자료를 읽었다고 일괄 표시하지 마세요. 검토한 문단·도면을 적고 미확보 자료가 판단에 미치는 범위를 남깁니다.",
          "evidenceHint": "명세서 문단 / 도면 번호 / 확보·미확보 범위",
          "codeRefs": [
            "0411",
            "0412",
            "0511"
          ],
          "sourceRefs": [
            "OA-05",
            "OA-08",
            "RC-04"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "PREP-06",
          "title": "인용문헌 원문 확보",
          "question": "각 인용문헌의 원문·공개번호·공개일 및 첨부 상태를 확인했나요?",
          "standard": "인용발명의 내용·식별번호·수치를 대조하지 못하면 원문 확인 완료로 처리하지 않습니다.",
          "guidance": "요약문이나 통지서의 재인용만으로 대조를 끝내지 마세요. 원문이 없는 문헌과 아직 읽지 않은 문헌을 구별합니다.",
          "evidenceHint": "D1·D2별 문헌번호 / 공개일 / 원문 확보 여부 / 관련 위치",
          "codeRefs": [
            "1223",
            "1224",
            "1232",
            "1231"
          ],
          "sourceRefs": [
            "OA-04",
            "OA-14",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "PREP-07",
          "title": "기준의 적용시점",
          "question": "이 사건에 적용할 심사기준·법령 시점을 확인하고 별도 검토가 필요한 범위를 적었나요?",
          "standard": "앱은 2026-11-23에 확인한 저장소 내장 규칙 사본을 제공하며 법령 최신성을 자동 확인하지 않습니다.",
          "guidance": "업무 환경에서 확보한 해당 시점의 공식 법령·심사기준과 대조하세요. 외부 확인이 아직 필요한 사항은 보완필요로 남깁니다.",
          "evidenceHint": "적용 기준명 / 시행·개정일 / 확보한 원문 위치 / 미확인 범위",
          "codeRefs": [],
          "sourceRefs": [
            "sheet-scoring",
            "codes",
            "OA-15",
            "RC-01"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        }
      ]
    },
    {
      "id": "process",
      "title": "02 · 절차의 효율성",
      "shortTitle": "절차",
      "description": "일괄 통지, 의견제출기회, 최후 지정과 보정의 실제 인과관계를 점검합니다.",
      "perspective": "절차의 효율성",
      "items": [
        {
          "id": "PROC-01",
          "title": "일괄 통지와 뒤늦은 이유",
          "question": "처음부터 존재한 이유를 나누어 통지하거나 뒤늦게 통지한 사정과 정당한 사유를 확인했나요?",
          "standard": "통지 기회·최초 존재 시점·예외 사유를 각각 확인해야 합니다.",
          "guidance": "현재 이유가 최초 청구범위에서도 성립했는지 대조하세요. 단일성 등 정당한 사유가 있는 경우를 일률적인 절차 하자로 보지 않습니다.",
          "evidenceHint": "이유별 최초 존재 시점 / 통지 횟수 / 정당한 사유",
          "codeRefs": [
            "1022",
            "1031",
            "1032"
          ],
          "sourceRefs": [
            "OA-15",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "PROC-02",
          "title": "동일 이유 반복",
          "question": "실질적으로 동일한 이유나 동일 선행기술의 최초 이유를 반복 통지하지 않았나요?",
          "standard": "반복 통지의 실질과 정당한 사유를 구별합니다.",
          "guidance": "문구만 다른지, 보정으로 새로운 쟁점이 생겼는지 확인하세요. 반복으로 보이는 사유마다 앞선 통지 위치를 적습니다.",
          "evidenceHint": "앞선 통지 / 현재 통지 / 동일·차이점 / 반복 사유",
          "codeRefs": [
            "1023",
            "1033"
          ],
          "sourceRefs": [
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "PROC-03",
          "title": "최후통지의 보정 인과관계",
          "question": "최후 이유마다 실제로 어떤 보정 때문에 새 이유가 발생했는지 설명할 수 있나요?",
          "standard": "새 문헌·새 법조항·나중 발견만으로 보정에 따른 발생을 인정하지 않습니다.",
          "guidance": "보정 전후 전체 청구범위를 비교하고 '보정에 따른 발생 / 보정 전부터 존재 / 확인 불가'를 이유별로 기록하세요.",
          "evidenceHint": "최후통지 쪽 / 변경 구성 / 이유 발생 인과관계 / 보정 전 대응항",
          "codeRefs": [
            "1024",
            "1031"
          ],
          "sourceRefs": [
            "OA-15",
            "codes"
          ],
          "appliesTo": [
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "PROC-04",
          "title": "의견제출기회",
          "question": "결정에 사용한 각 거절이유에 대해 앞서 적절한 의견제출기회를 부여했나요?",
          "standard": "같은 법조문이라는 이유만으로 같은 거절이유로 보지 않습니다.",
          "guidance": "문헌·조합·청구항·핵심 사실까지 비교하세요. 모든 선행 통지를 확보하지 못했다면 누락 범위를 기록합니다.",
          "evidenceHint": "결정 이유별 선행 통지일·쪽 / 문헌 조합 / 대응항",
          "codeRefs": [
            "1011"
          ],
          "sourceRefs": [
            "RD-01",
            "RD-02",
            "RD-03",
            "RD-05"
          ],
          "appliesTo": [
            "rejection"
          ],
          "critical": true
        },
        {
          "id": "PROC-05",
          "title": "보정의 적법성과 효과",
          "question": "보정 허용·불허의 근거와 최종결정에 미친 실제 영향을 확인했나요?",
          "standard": "보정요건 위배 여부와 최종결정에 대한 명백한 영향을 구별합니다.",
          "guidance": "추가·삭제·변경 내용을 원문에서 대조하세요. 보정이 있었다는 사실만으로 적법성이나 영향 유무를 단정하지 않습니다.",
          "evidenceHint": "보정 전후 문구 / 판단 근거 / 결정 영향",
          "codeRefs": [
            "0811",
            "0812",
            "0821",
            "0835"
          ],
          "sourceRefs": [
            "codes",
            "RD-06"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "PROC-06",
          "title": "분할·변경·협의 절차",
          "question": "분할·변경출원 요건과 필요한 협의요구 절차를 점검했나요?",
          "standard": "대상 절차가 실제 적용되는 사건인지 먼저 확인합니다.",
          "guidance": "해당이 없으면 이유를 적고 제외하세요. 원출원·분할출원의 대상 범위와 절차 자료를 대조합니다.",
          "evidenceHint": "원출원·분할 정보 / 해당 요건 / 협의요구 일자",
          "codeRefs": [
            "0911",
            "0912",
            "0921",
            "0931",
            "0935",
            "1025"
          ],
          "sourceRefs": [
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "PROC-07",
          "title": "기타 통지·직권보정",
          "question": "보정요구·보정각하·불인정예고·직권보정의 내용과 절차가 명확하고 적절한가요?",
          "standard": "기타 통지서의 오류와 일반 의견제출통지서 오류를 구분합니다.",
          "guidance": "실제 발송한 통지 종류와 원문을 확인하세요. 직권보정의 오지적으로 절차가 지연된 경우에는 지연 경과도 기록합니다.",
          "evidenceHint": "통지 종류·일자·쪽 / 대상 보정 / 지연 경과",
          "codeRefs": [
            "1021",
            "1034",
            "1421",
            "1422",
            "1423",
            "1435"
          ],
          "sourceRefs": [
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "PROC-08",
          "title": "절차상 보완사항 해소",
          "question": "절차상 미확인 사항과 추가 자료 요청·수정 계획이 모두 기록되었나요?",
          "standard": "자료 부족을 '문제없음' 또는 '해당없음'으로 대체하지 않습니다.",
          "guidance": "확인할 자료, 할 일, 완료 조건을 구체적으로 남기세요. 같은 사실에 여러 절차 코드를 자동 중복 적용하지 않습니다.",
          "evidenceHint": "미확인 목록 / 후속 조치 / 완료 조건 / 중복 여부",
          "codeRefs": [
            "1035"
          ],
          "sourceRefs": [
            "codes",
            "OA-15"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        }
      ]
    },
    {
      "id": "interpretation",
      "title": "03 · 명세서 해석의 정확성",
      "shortTitle": "명세서·청구항",
      "description": "표현 자체보다 실제 해석 장애와 법조항의 요건을 확인합니다. 오지적과 미지적을 함께 살핍니다.",
      "perspective": "명세서 해석의 정확성",
      "items": [
        {
          "id": "INT-01",
          "title": "발명의 설명과 실시용이성",
          "question": "발명의 설명을 근거로 실시할 수 있는지 검토하고 구체적 장애와 설명 부족을 연결했나요?",
          "standard": "뜻이 명확한 구성의 제조·작동·재현 문제는 명확성 문제와 구분합니다.",
          "guidance": "실시가 어렵다는 인상만 적지 마세요. 해당 기술적 장애, 명세서의 해결 설명 유무, 필요한 근거를 적습니다.",
          "evidenceHint": "명세서 문단·도면 / 실시 장애 / 설명 부족 / 적용 조항",
          "codeRefs": [
            "0411",
            "0412",
            "0421",
            "0431"
          ],
          "sourceRefs": [
            "OA-08",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "INT-02",
          "title": "배경기술·경미한 기재사항",
          "question": "배경기술 기재요건과 발명의 설명의 미지적·경미한 사항을 각각 확인했나요?",
          "standard": "실시불가능, 배경기술 누락, 경미한 기재사항은 같은 유형이 아닙니다.",
          "guidance": "심사 중 자연 해소된 문제는 최종 잔존 하자와 분리하세요. 원문 조건과 결정 경과를 함께 기록합니다.",
          "evidenceHint": "해당 문단 / 문제 영향 / 통지·보정·결정 경과",
          "codeRefs": [
            "0422",
            "0432",
            "0433",
            "0435"
          ],
          "sourceRefs": [
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "INT-03",
          "title": "명확성·실시용이성·뒷받침 구분",
          "question": "지적한 문제와 적용 법조항이 서로 맞고 다른 기재요건을 혼동하지 않았나요?",
          "standard": "발명의 설명 04xx, 청구범위 기재요건 05xx, 기재방법 06xx를 구분합니다.",
          "guidance": "의미가 불명확한지, 실시가 어려운지, 설명의 뒷받침이 부족한지 각각의 실제 논거를 적습니다. 같은 사실에 두 요건이 관련되면 별도 논증합니다.",
          "evidenceHint": "문제 문구 / 해석·실시·뒷받침 논거 / 법조항",
          "codeRefs": [
            "0412",
            "0421",
            "0512",
            "0521",
            "0612",
            "0621"
          ],
          "sourceRefs": [
            "OA-08",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "INT-04",
          "title": "단어만으로 불명확성 지적 금지",
          "question": "'포함·치환·약' 등의 단어 자체가 아니라 실제 복수 해석이나 이해 장애를 확인했나요?",
          "standard": "청구항 전체와 관련 종속항·명세서의 문맥을 먼저 확인합니다.",
          "guidance": "오지적 의심이면 가능한 해석을 구체적으로 비교하세요. 문맥을 충분히 읽지 않은 상태에서 명확함도 불명확함도 단정하지 않습니다.",
          "evidenceHint": "문제 단어 앞뒤 문장 / 관련 항 / 복수 해석 유무",
          "codeRefs": [
            "0512",
            "0521",
            "0535"
          ],
          "sourceRefs": [
            "OA-05",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "INT-05",
          "title": "선행기재·지시대상·관계",
          "question": "'상기' 구성, 동일 명칭, 수량·위치·결합관계가 문맥상 특정되나요?",
          "standard": "표현상의 어색함과 보호범위가 달라지는 실질적인 해석 장애를 구분합니다.",
          "guidance": "문제 구성의 선행 근거를 찾고 인용항의 구성까지 포함해 읽으세요. 설명·도면을 더 봐야 하는 부분은 보완필요로 기록합니다.",
          "evidenceHint": "해당항·인용항 / 선행 기재 / 가능한 해석 / 도면",
          "codeRefs": [
            "0511",
            "0512",
            "0521",
            "0531"
          ],
          "sourceRefs": [
            "RC-04",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "INT-06",
          "title": "작동·기능 한정의 정합성",
          "question": "작동 방향·단계·조건·수단 사이에 양립 불가능한 한정이 없는지 확인했나요?",
          "standard": "서로 다른 상태·시점·수단은 공존할 수 있습니다.",
          "guidance": "같은 조건에서 모순인지 먼저 확인하세요. 별도 작동 수단이나 실시형태라는 설명을 확인하지 않고 내부 모순으로 처리하지 않습니다.",
          "evidenceHint": "각 조건·상태·방향 / 같은 시점 여부 / 설명·도면",
          "codeRefs": [
            "0511",
            "0521",
            "0531"
          ],
          "sourceRefs": [
            "RC-05"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "INT-07",
          "title": "경화물의 문맥",
          "question": "'경화물' 등이 무엇의 결과물인지 청구항 체계와 종속항에서 확인했나요?",
          "standard": "문맥상 특정되는 대상을 근거 없이 다른 물질의 결과물로 재해석하지 않습니다.",
          "guidance": "조성물·화합물·경화 후 물성의 연결을 확인하세요. 서로 다른 경화 대상이 병렬로 등장하는 실제 사정이 있는지도 확인합니다.",
          "evidenceHint": "대상항 / 조성물 정의 / 관련 종속항 / 지시 대상",
          "codeRefs": [
            "0512",
            "0521"
          ],
          "sourceRefs": [
            "OA-11",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "INT-08",
          "title": "선택적 표현과 선호 표현",
          "question": "'임의로·선택적으로'의 선택적 구성과 '바람직하게·특히'의 이중한정을 구별했나요?",
          "standard": "선택적 포함이 명확한 표현과 넓고 좁은 범위의 효력이 갈리는 표현을 혼동하지 않습니다.",
          "guidance": "단어 검색 결과만으로 결론 내리지 마세요. 수식 범위와 보호범위가 실제로 달라지는지 기록합니다.",
          "evidenceHint": "표현 앞뒤 / 필수·선택 관계 / 넓은·좁은 한정",
          "codeRefs": [
            "0511",
            "0512",
            "0521",
            "0534"
          ],
          "sourceRefs": [
            "OA-12",
            "OA-17",
            "RC-07"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "INT-09",
          "title": "의약용도 대상의 특정",
          "question": "의약용도 청구항의 질병명·약효·정의로 대상이 특정되는지 확인했나요?",
          "standard": "표적·활성 관련 질환이라는 표현과 구체적 질병·약효의 특정은 구분합니다.",
          "guidance": "청구항의 다른 부분에서 구체화되는지 확인하세요. 통지서 문구상 논리와 명세서·기술상식을 포함한 최종 위반 판단을 나누어 적습니다.",
          "evidenceHint": "용도 문구 / 구체적 질병·약효 / 정의 / 미확인 자료",
          "codeRefs": [
            "0511",
            "0512",
            "0521"
          ],
          "sourceRefs": [
            "OA-09"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "INT-10",
          "title": "PBP 물건과 제조 경로",
          "question": "제조방법으로 특정된 물건에서 최종 물건과 제조 경로를 구별해 판단했나요?",
          "standard": "다른 문헌으로 결과물 동일성을 판단했다는 사실만으로 인용발명 누락이라 하지 않습니다.",
          "guidance": "물건인지 방법인지 먼저 확인하세요. 제조 경로가 결과물의 구조·성질에 주는 차이와 그 차이를 처리한 논증을 적습니다.",
          "evidenceHint": "청구대상 / 제조·유래 표현 / 결과물 특성 / 대비 문헌",
          "codeRefs": [
            "0112",
            "0121",
            "0212",
            "0221",
            "1225"
          ],
          "sourceRefs": [
            "OA-07",
            "OA-03"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "INT-11",
          "title": "청구대상·택일 표현",
          "question": "청구항 말미의 대상과 'A 또는 B'가 실제 어떤 발명·구성을 청구하는지 확인했나요?",
          "standard": "별개 물건의 택일, 동일 물건의 구성 대안, 용도 한정 물건과 '용도' 자체의 청구를 구분합니다.",
          "guidance": "모든 '또는'에 같은 결론을 적용하지 마세요. 의약용 조성물과 청구대상이 용도인 경우를 분리하고 적용 근거를 기록합니다.",
          "evidenceHint": "항 말미 / 발명 카테고리 / 선택 대상 관계",
          "codeRefs": [
            "0511",
            "0521",
            "0612",
            "0621",
            "0622"
          ],
          "sourceRefs": [
            "OA-10",
            "OA-16",
            "RC-03"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "INT-12",
          "title": "종속항 미지적·기재방법",
          "question": "인용항의 하자가 종속항에도 남는지와 번호·인용방식의 적정성을 전수 확인했나요?",
          "standard": "상위항에 대한 지적만으로 모든 종속항의 이유가 자동 설명되는 것은 아닙니다.",
          "guidance": "각 종속항이 하자를 해소하거나 그대로 승계하는지 확인하세요. 다중 인용과 별개 실시형태의 병렬 기재도 구분합니다.",
          "evidenceHint": "항별 하자 승계·해소 / 인용 경로 / 기재방법",
          "codeRefs": [
            "0533",
            "0612",
            "0621",
            "0622",
            "0631",
            "0632",
            "0635"
          ],
          "sourceRefs": [
            "OA-01",
            "RC-01",
            "RC-02",
            "RC-03"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "INT-13",
          "title": "기타 특허요건",
          "question": "산업상 이용가능성·권리능력·권리자·공동출원·조약·단일성 등 적용 요건을 확인했나요?",
          "standard": "07xx의 각 요건은 별개이므로 대상 사실과 적용 조건을 따로 확인합니다.",
          "guidance": "해당되는 요건에 대해서만 자료와 근거를 남기세요. 자료 부족은 해당없음으로 바꾸지 않고 추가 확인 대상으로 기록합니다.",
          "evidenceHint": "적용 요건 / 대상 사실 / 근거 문서 / 예외 여부",
          "codeRefs": [
            "0711",
            "0712",
            "0713",
            "0714",
            "0715",
            "0716",
            "0717",
            "0721",
            "0722",
            "0731",
            "0735"
          ],
          "sourceRefs": [
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "INT-14",
          "title": "오지적·미지적의 경과",
          "question": "부당 지적, 미지적 잔존, 경미한 사항, 심사 중 자연 해소를 구분했나요?",
          "standard": "결정 경과와 다른 정당한 거절이유의 유무가 코드 선택을 바꿉니다.",
          "guidance": "통지만 한 사건에 거절결정 전제 코드를 확정하지 마세요. 현재 남은 하자와 과거 통지의 적정성을 각각 기록합니다.",
          "evidenceHint": "당시 문제 / 통지 여부 / 보정 결과 / 최종 경과 / 다른 정당한 이유",
          "codeRefs": [
            "0412",
            "0421",
            "0433",
            "0511",
            "0512",
            "0521",
            "0531",
            "0532",
            "0534"
          ],
          "sourceRefs": [
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        }
      ]
    },
    {
      "id": "search",
      "title": "04 · 검색의 적절성",
      "shortTitle": "검색·인용문헌",
      "description": "검색 범위와 이력을 남기고, 인용한 실제 문헌의 구성·식별번호·수치까지 직접 대조합니다.",
      "perspective": "검색의 적절성",
      "items": [
        {
          "id": "SEARCH-01",
          "title": "검색 범위와 이력",
          "question": "청구발명의 핵심 구성·차이점을 반영한 검색 범위와 검색 이력을 기록했나요?",
          "standard": "검색의 적절성과 우수사례 판단은 적절한 선행기술 활용 및 이력의 근거가 필요합니다.",
          "guidance": "실제로 사용한 검색식·분류·대상·검색일을 적으세요. 검색하지 않은 범위를 검색 완료로 표시하지 않습니다.",
          "evidenceHint": "핵심 구성 / 검색식·분류 / 검색일 / 검색 범위·제한",
          "codeRefs": [
            "0111",
            "0211",
            "0311",
            "1521"
          ],
          "sourceRefs": [
            "codes",
            "sheet-scoring"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "SEARCH-02",
          "title": "문헌 동일성·시점",
          "question": "본문·첨부·대비표의 문헌번호가 같은 실제 문헌을 가리키며 관련 날짜를 확인했나요?",
          "standard": "번호 표기 차이와 실제 문헌 교체를 구별하고 적용 가능한 시점을 확인합니다.",
          "guidance": "국가코드·공개/등록번호·공개일을 원문 표지와 맞추세요. 우선일 등 기준일이 판단을 가르면 근거 자료도 기록합니다.",
          "evidenceHint": "문헌 식별자 / 공개일 / 관련 기준일 / 동일성 확인 위치",
          "codeRefs": [
            "0112",
            "0121",
            "0312",
            "0321",
            "1223"
          ],
          "sourceRefs": [
            "OA-04",
            "RD-02",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "SEARCH-03",
          "title": "인용 위치·수치 실제 대조",
          "question": "통지서가 인용한 문단·도면·식별번호·수치범위를 실제 인용문헌과 대조했나요?",
          "standard": "인용문헌 원문 미확보 상태에서는 인용 내용의 정확성이나 오기를 확정하지 않습니다.",
          "guidance": "각 문헌에서 지적한 구성이 실제 있는 위치와 수치를 기록하세요. 통지서의 문구와 원문 위치를 양쪽 모두 남깁니다.",
          "evidenceHint": "통지서 쪽·문구 ↔ 원문 문단·도면·수치 / 차이",
          "codeRefs": [
            "1231",
            "1223",
            "1225"
          ],
          "sourceRefs": [
            "OA-14",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "SEARCH-04",
          "title": "신규성 구성 대비",
          "question": "신규성 판단에서 전체 구성과 해당 문헌의 실제 개시 내용을 빠짐없이 대비했나요?",
          "standard": "신규성 판단의 적합성 및 특허·거절결정 경과는 각각의 코드 조건으로 확인합니다.",
          "guidance": "같은 구성이라고 본 근거 위치를 적고 개시되지 않은 구성은 숨기지 마세요. 다른 정당한 이유의 유무도 최종 코드 선택에 반영합니다.",
          "evidenceHint": "청구항별 전체 구성 / 문헌 개시 위치 / 차이 / 결정 경과",
          "codeRefs": [
            "0111",
            "0112",
            "0121",
            "0135"
          ],
          "sourceRefs": [
            "codes",
            "OA-06"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "SEARCH-05",
          "title": "진보성 차이·결합 논리",
          "question": "차이점마다 어떤 문헌·근거로 용이도출을 설명하는지 구체적으로 확인했나요?",
          "standard": "결합·조합이라는 단어 자체보다 문헌별 역할과 실제 논증을 검토합니다.",
          "guidance": "차이점을 인정한 뒤 설명 없이 결론짓지 않았는지 읽으세요. 기술적 사실·효과를 원문 근거 없이 추정하지 않습니다.",
          "evidenceHint": "차이점 / D1·D2 역할 / 결합 근거 / 효과 검토 위치",
          "codeRefs": [
            "0211",
            "0212",
            "0221",
            "0235",
            "1225"
          ],
          "sourceRefs": [
            "OA-06",
            "OA-13",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "SEARCH-06",
          "title": "선출원·확대된 선출원",
          "question": "선출원 관련 판단의 대상·동일성·시점 및 필요한 절차를 확인했나요?",
          "standard": "03xx의 특허결정·거절결정 조건과 1025의 협의요구는 서로 다른 확인 사항입니다.",
          "guidance": "선출원 사건과 판단 대상의 관계를 문서로 확인하세요. 해당 제도를 사용하지 않는 경우 그 사유로 제외합니다.",
          "evidenceHint": "관련 출원번호 / 시점 / 동일성 대비 / 협의 자료",
          "codeRefs": [
            "0311",
            "0312",
            "0321",
            "0335",
            "1025"
          ],
          "sourceRefs": [
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "SEARCH-07",
          "title": "청구항별 문헌 조합",
          "question": "독립항·종속항의 실제 대비 문헌과 결론에 적은 조합이 일치하나요?",
          "standard": "선행항의 문헌 번호가 종속항 결론에 항상 있어야 한다고 기계적으로 판단하지 않습니다.",
          "guidance": "각 항의 전체 구성 근거를 표시하세요. 별도 단독문헌 대비와 PBP 결과물 판단은 예외 조건을 확인하고, '또는' 조합은 나누어 기록합니다.",
          "evidenceHint": "항별 실제 문헌 집합 / 결론 집합 / 차이·예외",
          "codeRefs": [
            "1222",
            "1225",
            "1231"
          ],
          "sourceRefs": [
            "OA-03",
            "OA-07"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "SEARCH-08",
          "title": "추가 검색·미확보 자료",
          "question": "검색·인용문헌 관련 미확인 사항을 후속 조치와 연결했나요?",
          "standard": "확보 범위가 제한된 '발견 없음'을 모든 선행기술의 부재로 확대하지 않습니다.",
          "guidance": "추가 검색어, 열람할 원문, 확인할 구성과 완료 조건을 적으세요. 등록 사실 자체를 검색의 충분성 증거로 사용하지 않습니다.",
          "evidenceHint": "추가 검색 계획 / 미확보 문헌 / 확인할 위치·구성",
          "codeRefs": [],
          "sourceRefs": [
            "codes",
            "RC-04"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        }
      ]
    },
    {
      "id": "notice",
      "title": "05 · 의견제출통지서 기재 적정성",
      "shortTitle": "통지서",
      "description": "주문, 청구항, 법조항, 인용문헌과 결론이 같은 이유 단위로 연결되는지 점검합니다.",
      "perspective": "의견제출통지서 기재 적정성",
      "items": [
        {
          "id": "OA-CHECK-01",
          "title": "주문과 세부 이유의 청구항",
          "question": "주문에 적은 대상 청구항과 세부 이유에서 설명한 청구항 집합이 일치하나요?",
          "standard": "법조문별·거절이유별 같은 단위에서 비교합니다.",
          "guidance": "공통 이유·종속항의 간접 지정을 포함해 대조하세요. 문맥으로 범위를 확정할 수 없으면 추정 집합으로 표시합니다.",
          "evidenceHint": "주문 행·쪽 / 세부 이유 쪽 / 대상항 집합 / 누락·추가",
          "codeRefs": [
            "1222",
            "1225",
            "1231",
            "0533"
          ],
          "sourceRefs": [
            "OA-01"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "OA-CHECK-02",
          "title": "법조항·제목·결론",
          "question": "주문·세부 제목·본문·결론의 법조항과 이유 종류가 서로 일치하나요?",
          "standard": "복수 법조항의 별도 적용과 법조항 불일치를 구분합니다.",
          "guidance": "관련 위치를 함께 적으세요. 법조항 오류를 일반적인 단순오기 제외 기준으로 일괄 제외하지 않습니다.",
          "evidenceHint": "각 위치의 법조항 / 이유 종류 / 일치 여부",
          "codeRefs": [
            "1221"
          ],
          "sourceRefs": [
            "OA-02",
            "OA-08",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "OA-CHECK-03",
          "title": "문헌 번호와 첨부",
          "question": "인용발명 번호 정의, 본문의 호칭, 첨부목록과 실제 첨부문헌이 일치하나요?",
          "standard": "첨부 문제가 있어 문헌 특정이 불가능한 경우와 가능한 경우를 구분합니다.",
          "guidance": "같은 번호가 다른 문헌을 가리키거나 미정의 번호를 사용하지 않았는지 확인하세요. 누락 첨부는 목록·원문으로 확인합니다.",
          "evidenceHint": "최초 정의 / 사용 위치 / 첨부 번호·실제 문헌",
          "codeRefs": [
            "1223",
            "1224",
            "1232"
          ],
          "sourceRefs": [
            "OA-04",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "OA-CHECK-04",
          "title": "대상·논증·결론의 연결",
          "question": "각 문단의 청구항, 실제 설명한 구성, 차이점 처리와 결론이 논리적으로 이어지나요?",
          "standard": "복사 오류, 논증 생략, 차이 인정 후 동일 결론을 구별합니다.",
          "guidance": "앞 문단을 원용한 경우에도 해당 항에 적용 가능한지 확인하세요. 외부 기술적 사실의 참·거짓을 문서만으로 추정하지 않습니다.",
          "evidenceHint": "대상항 / 본문 구성 / 차이점 / 결론 / 원용 근거",
          "codeRefs": [
            "1222",
            "1225",
            "1231"
          ],
          "sourceRefs": [
            "OA-06"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "OA-CHECK-05",
          "title": "결합·조합 표현",
          "question": "'조합·결합'의 의미와 각 문헌의 역할을 문맥상 일관되게 이해할 수 있나요?",
          "standard": "단어 선택만으로 오류를 부여하지 않으며 실제 의미 혼용과 설명 부족을 구별합니다.",
          "guidance": "의미가 분명해도 구성 대비가 충분한지는 별도로 확인하세요. 혼용이라면 해당 위치와 해석 장애를 적습니다.",
          "evidenceHint": "표현 위치 / 문헌 역할 / 실제 의미 / 이해 장애",
          "codeRefs": [
            "1222",
            "1225",
            "1231"
          ],
          "sourceRefs": [
            "OA-13"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "OA-CHECK-06",
          "title": "오기와 원문 확인 부담",
          "question": "오기를 통지서만으로 명백히 정정할 수 있는지, 원문을 읽어야 하는지 구별했나요?",
          "standard": "오기 유형·크기만으로 제외하거나 코드를 부여하지 않습니다.",
          "guidance": "정답이 통지서 내부에서 명백하면 비집계 편집 메모로 남기세요. 원문 대조가 필요하면 실제 원문으로 정확한 의미를 확인합니다.",
          "evidenceHint": "문제 문구 / 통지서 내 정정 가능성 / 원문 대조 / 영향",
          "codeRefs": [
            "1231"
          ],
          "sourceRefs": [
            "OA-14",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "OA-CHECK-07",
          "title": "명확성 지적의 설명",
          "question": "명확성 이유가 실제 보호범위 해석 장애를 설명하고, 문맥상 명확한 표현을 오지적하지 않았나요?",
          "standard": "실체 판단의 타당성과 통지서 설명의 충분성은 별개의 검토 대상입니다.",
          "guidance": "경화물, 선택적 포함, 선호 이중한정, 의약용도, 청구대상 등을 실제 문맥에 맞춰 판단하세요. 해당 없는 개별 사례를 억지로 적용하지 않습니다.",
          "evidenceHint": "청구항 전문 / 실제 해석 장애 / 법조항 / 통지 문구",
          "codeRefs": [
            "0512",
            "0521",
            "1222"
          ],
          "sourceRefs": [
            "OA-05",
            "OA-09",
            "OA-10",
            "OA-11",
            "OA-12",
            "OA-16",
            "OA-17"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "OA-CHECK-08",
          "title": "출원인이 대응할 수 있는 설명",
          "question": "어느 항의 어떤 구성에 무슨 이유가 있는지 출원인이 이해하고 대응할 수 있나요?",
          "standard": "포괄적·모호한 이유, 구성대비 미흡과 경미한 기재사항은 영향에 따라 구분합니다.",
          "guidance": "문구가 길고 짧은 것만 평가하지 마세요. 문제 위치, 근거, 적용 요건과 필요한 설명이 드러나는지 확인합니다.",
          "evidenceHint": "문제 대상 / 적용 요건 / 구성대비 위치 / 부족한 설명",
          "codeRefs": [
            "1222",
            "1225",
            "1231",
            "1235"
          ],
          "sourceRefs": [
            "codes",
            "OA-06"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "OA-CHECK-09",
          "title": "통지서 전체의 재확인",
          "question": "전체 통지서의 문헌·수치·항 번호와 최종 수정본을 다시 확인했나요?",
          "standard": "나중에 정정됐다는 사실이 최초 문서의 하자를 자동으로 없애지는 않습니다.",
          "guidance": "수정한 위치를 마지막 저장·출력본과 맞추세요. 과거 문서의 평가와 이번 발송본의 개선 결과를 구분해 기록합니다.",
          "evidenceHint": "검토한 최종본 / 변경 위치 / 확인일 / 남은 사항",
          "codeRefs": [
            "1231",
            "1235"
          ],
          "sourceRefs": [
            "OA-14",
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        }
      ]
    },
    {
      "id": "rejection",
      "title": "06 · 거절결정서 기재 적정성",
      "shortTitle": "거절결정",
      "description": "거절결정에 사용한 이유를 결정 이전의 모든 통지와 비교하고, 출원인 주장의 처리 결과를 확인합니다.",
      "perspective": "거절결정서 기재 적정성",
      "items": [
        {
          "id": "RD-CHECK-01",
          "title": "새 법조문·이유의 사용",
          "question": "결정의 법조문·거절이유·대상항에 대응하는 선행 통지가 있나요?",
          "standard": "동일 법조문이어도 독립적인 새 쟁점이면 별도 검토합니다.",
          "guidance": "단순 정정·상세화와 새 이유를 구분하세요. 청구항 보정으로 번호가 바뀌었다면 문언 대응표로 비교합니다.",
          "evidenceHint": "결정 쪽·이유 ↔ 선행 통지 쪽·이유 / 차이",
          "codeRefs": [
            "1011",
            "1321"
          ],
          "sourceRefs": [
            "RD-01"
          ],
          "appliesTo": [
            "rejection"
          ],
          "critical": true
        },
        {
          "id": "RD-CHECK-02",
          "title": "문헌·조합·대상항 변경",
          "question": "결정에서 추가·교체한 문헌, 조합 또는 대상항에 대해 이전 대응 기회가 있었나요?",
          "standard": "문헌 번호 재배열과 실제 문헌·역할 변경은 다릅니다.",
          "guidance": "1→1+2, 1+2→1+3 등의 변화를 이유별로 적으세요. 다른 선행 통지에서 이미 같은 항·조합을 알린 경우도 확인합니다.",
          "evidenceHint": "항별 결정 문헌 집합 / 선행 통지 집합 / 실제 식별자",
          "codeRefs": [
            "1011",
            "1321"
          ],
          "sourceRefs": [
            "RD-02",
            "OA-07"
          ],
          "appliesTo": [
            "rejection"
          ],
          "critical": true
        },
        {
          "id": "RD-CHECK-03",
          "title": "핵심 사실·논리의 변경",
          "question": "같은 법조문·문헌이라도 결정에서 새로운 불리한 핵심 사실이나 결합 논리를 처음 사용하지 않았나요?",
          "standard": "기존 논거의 상세화와 독립적인 새 핵심 논리를 구분합니다.",
          "guidance": "의견서가 없어도 통지·결정 원문으로 확인되는 차이는 검토하세요. 확인하지 못한 출원인 주장이나 보정 효과만 추정하지 않습니다.",
          "evidenceHint": "통지의 차이점·논리 / 결정의 핵심 논리 / 변화 근거",
          "codeRefs": [
            "1011",
            "1321"
          ],
          "sourceRefs": [
            "RD-03"
          ],
          "appliesTo": [
            "rejection"
          ],
          "critical": true
        },
        {
          "id": "RD-CHECK-04",
          "title": "결정 내부의 근거 연결",
          "question": "결정의 주문·이유·결론이 청구항·법조문·인용문헌에 관해 일치하나요?",
          "standard": "결정 내부 불일치는 선행 통지와의 비교 결과와 별도로 기록합니다.",
          "guidance": "공통 이유의 명시적 일괄 적용 여부를 확인하세요. 문헌·항 번호 오기와 실질적 근거 단절을 구분합니다.",
          "evidenceHint": "주문 표 / 본문 이유 / 결론 / 관련 항·문헌",
          "codeRefs": [
            "1321",
            "1331",
            "1335"
          ],
          "sourceRefs": [
            "RD-04"
          ],
          "appliesTo": [
            "rejection"
          ],
          "critical": false
        },
        {
          "id": "RD-CHECK-05",
          "title": "선행 통지 전부 대조",
          "question": "최초 통지뿐 아니라 결정 이전의 모든 통지·최후통지와 각 결정 이유를 대조했나요?",
          "standard": "통지가 하나라도 누락되면 '선행 통지 전부에 없음'을 확정하지 않습니다.",
          "guidance": "날짜순 통지 목록과 이유별 대응 위치를 남기세요. 뒤의 최후통지에서 이미 알린 이유를 새 이유로 잘못 표시하지 않습니다.",
          "evidenceHint": "선행 통지 전체 목록 / 이유별 대응표 / 누락 여부",
          "codeRefs": [
            "1011"
          ],
          "sourceRefs": [
            "RD-05"
          ],
          "appliesTo": [
            "rejection"
          ],
          "critical": true
        },
        {
          "id": "RD-CHECK-06",
          "title": "출원인 주장·보정 검토",
          "question": "확인된 핵심 주장·보정에 대한 검토결과와 최종결정 영향이 결정서에 나타나나요?",
          "standard": "1311은 검토 누락뿐 아니라 최종결정에 대한 명백한 영향도 확인해야 합니다.",
          "guidance": "실제 의견서 또는 결정서에 특정된 주장으로 검토하세요. 의견서가 없으면 존재하지 않는 주장을 만들지 말고 확인 가능한 범위와 한계를 적습니다.",
          "evidenceHint": "주장·보정 원문 위치 / 결정 검토 위치 / 누락·영향 근거",
          "codeRefs": [
            "1311",
            "1321"
          ],
          "sourceRefs": [
            "RD-06",
            "codes"
          ],
          "appliesTo": [
            "rejection"
          ],
          "critical": true
        }
      ]
    },
    {
      "id": "registration",
      "title": "07 · 등록청구항 최종 점검",
      "shortTitle": "등록청구항",
      "description": "등록·특허결정 시점의 전체 유효 청구항을 대상으로 남은 기재 하자를 살핍니다.",
      "perspective": "명세서 해석의 정확성 · 등록 추가 점검",
      "items": [
        {
          "id": "RC-CHECK-01",
          "title": "종속관계와 인용항",
          "question": "유효 등록청구항의 인용 번호와 인용항의 구성에 대한 한정·부가 관계가 맞나요?",
          "standard": "존재하지 않거나 후행하는 항의 인용 및 실질적 종속관계 문제를 확인합니다.",
          "guidance": "다른 실시형태·작동 상태라는 이유만으로 모순이라고 하지 마세요. 해당항과 인용항의 전체 구성을 나란히 비교합니다.",
          "evidenceHint": "등록 판본 / 항 번호 / 인용 문구 / 한정·부가 관계",
          "codeRefs": [
            "0511",
            "0622"
          ],
          "sourceRefs": [
            "RC-01"
          ],
          "appliesTo": [
            "registration"
          ],
          "critical": true
        },
        {
          "id": "RC-CHECK-02",
          "title": "다중 인용 경로",
          "question": "모든 다중 인용의 택일성과 직접·간접 중첩을 펼쳐 확인했나요?",
          "standard": "단일항을 거쳐 간접 인용하는 다중 인용 경로도 확인합니다.",
          "guidance": "각 항에서 최상위 인용항까지 경로를 기록하세요. 별개 실시형태를 병렬로 기재한 것과 다중 인용을 혼동하지 않습니다.",
          "evidenceHint": "직접 인용 집합 / 전체 경로 / 중첩 여부",
          "codeRefs": [
            "0622"
          ],
          "sourceRefs": [
            "RC-02"
          ],
          "appliesTo": [
            "registration"
          ],
          "critical": true
        },
        {
          "id": "RC-CHECK-03",
          "title": "항 번호·독립항·청구대상",
          "question": "등록 원문의 항 번호·독립항·기재 단위와 말미 청구대상을 확인했나요?",
          "standard": "상세정보 화면의 변환된 줄바꿈을 공보 원문 형식으로 단정하지 않습니다.",
          "guidance": "등록공보나 최종 청구범위 원문에서 확인하세요. 별개 물건·방법 혼재, 청구대상 '용도'와 용도 한정 물건을 구분합니다.",
          "evidenceHint": "공보 쪽 / 유효 번호 / 독립항 / 말미 대상",
          "codeRefs": [
            "0511",
            "0622"
          ],
          "sourceRefs": [
            "RC-03",
            "OA-10",
            "OA-16"
          ],
          "appliesTo": [
            "registration"
          ],
          "critical": false
        },
        {
          "id": "RC-CHECK-04",
          "title": "선행기재와 보호범위",
          "question": "등록청구항의 용어·대상·수량·위치·관계가 한 가지 기술적 의미로 읽히나요?",
          "standard": "문맥상 특정 가능한 표현과 실질적인 범위 불명확을 구분합니다.",
          "guidance": "청구항과 인용항, 필요한 설명·도면을 함께 읽으세요. 자료가 없으면 해당 판단을 보완필요로 남깁니다.",
          "evidenceHint": "등록항·인용항 / 문제 문구 / 해석 차이 / 관련 도면",
          "codeRefs": [
            "0511",
            "0532"
          ],
          "sourceRefs": [
            "RC-04"
          ],
          "appliesTo": [
            "registration"
          ],
          "critical": true
        },
        {
          "id": "RC-CHECK-05",
          "title": "기능·작동의 내부 정합성",
          "question": "등록청구항에서 같은 조건의 작동·방향·결과가 서로 모순되지 않나요?",
          "standard": "별도 시점·상태·수단의 공존과 양립 불가능한 한정을 구분합니다.",
          "guidance": "명확성, 실시가능성, 뒷받침의 논거를 나누세요. 실제 보호범위에 미치는 영향을 함께 기록합니다.",
          "evidenceHint": "조건·단계·수단 / 서로 다른 해석 / 설명·도면",
          "codeRefs": [
            "0511",
            "0411"
          ],
          "sourceRefs": [
            "RC-05"
          ],
          "appliesTo": [
            "registration"
          ],
          "critical": false
        },
        {
          "id": "RC-CHECK-06",
          "title": "문법·반복과 실질 하자",
          "question": "긴 문장·반복·조사·오탈자를 실질적 범위 불명확과 구분했나요?",
          "standard": "편집상 아쉬움만으로 위반 또는 중대한 하자를 선언하지 않습니다.",
          "guidance": "상충 한정이나 실제 복수 보호범위가 생기는지 확인하세요. 편집 메모는 법적 하자와 구별해 기록합니다.",
          "evidenceHint": "표현 문맥 / 범위 영향 / 편집 메모 여부",
          "codeRefs": [
            "0511",
            "0532"
          ],
          "sourceRefs": [
            "RC-06"
          ],
          "appliesTo": [
            "registration"
          ],
          "critical": false
        },
        {
          "id": "RC-CHECK-07",
          "title": "선호·강조 이중한정 잔존",
          "question": "'바람직하게·특히'가 남은 모든 등록항에서 넓고 좁은 한정의 효력과 해석 장애를 확인했나요?",
          "standard": "발명의 설명에만 있는 표현·삭제항은 등록청구항 하자로 집계하지 않습니다.",
          "guidance": "유효 등록항의 표현 앞뒤를 기록하세요. 단어만으로 확정하지 않되, 판본·해석 하자가 확인되면 막연한 문맥 가능성만으로 미루지 않습니다.",
          "evidenceHint": "유효 등록항 / 두 한정 / 보호범위 해석 장애 / 결정 경과",
          "codeRefs": [
            "0511",
            "0534"
          ],
          "sourceRefs": [
            "RC-07",
            "OA-17",
            "codes"
          ],
          "appliesTo": [
            "registration"
          ],
          "critical": true
        }
      ]
    },
    {
      "id": "closing",
      "title": "08 · 출원인 관점과 마무리",
      "shortTitle": "최종 점검",
      "description": "관점별 근거와 남은 할 일을 정리하고, 완료 표시의 의미와 코드 선택 조건을 재확인합니다.",
      "perspective": "출원인 수용가능성 · 공통 최종 점검",
      "items": [
        {
          "id": "CLOSE-01",
          "title": "출원인 관점의 이해 가능성",
          "question": "출원인의 핵심 주장과 보정 의도를 확인하고 판단 이유를 이해할 수 있게 정리했나요?",
          "standard": "실제 주장에 대한 검토 없이 출원인이 수용할 것이라고 추정하지 않습니다.",
          "guidance": "확보한 주장과 판단 근거를 연결하세요. 등록 검토에서도 미해소 해석 문제를 등록 사실만으로 정상 처리하지 않습니다.",
          "evidenceHint": "출원인 주장 위치 / 판단 근거 / 설명할 핵심 쟁점",
          "codeRefs": [
            "1222",
            "1225",
            "1311",
            "1321"
          ],
          "sourceRefs": [
            "RD-06",
            "codes",
            "sheet-scoring"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "CLOSE-02",
          "title": "관점별 근거와 기록",
          "question": "각 관점의 확인 결과에 문서·쪽수·청구항·법조항과 판단 이유를 남겼나요?",
          "standard": "체크 표시 자체는 원문 대조와 판단 근거를 대신하지 않습니다.",
          "guidance": "문제없다고 확인한 범위도 무엇을 읽었는지 남기세요. 같은 하자를 여러 관점에서 발견했다면 서로 연결해 중복 집계를 피합니다.",
          "evidenceHint": "관점별 확인 문서 / 쪽수 / 청구항 / 판단·후속 조치",
          "codeRefs": [],
          "sourceRefs": [
            "codes",
            "sheet-scoring"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "CLOSE-03",
          "title": "코드 후보와 확정 조건",
          "question": "기록한 진단코드마다 결정 경과·다른 정당한 이유·영향·증거 조건을 확인했나요?",
          "standard": "OA/RD/RC는 절차 ID이고 4자리 코드는 진단유형입니다. 참고 코드가 자동 적용을 뜻하지 않습니다.",
          "guidance": "코드의 전체 문구를 읽으세요. 특히 xx12·xx21, 1311·1321, 1224·1232의 조건을 구분하고 확인되지 않으면 후보로 남깁니다.",
          "evidenceHint": "선택 코드 / 원문 조건 / 대상 문서·시점 / 증거 / 선택 이유",
          "codeRefs": [
            "0512",
            "0521",
            "1311",
            "1321",
            "1224",
            "1232"
          ],
          "sourceRefs": [
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "CLOSE-04",
          "title": "해당없음·자료부족 구분",
          "question": "해당없음의 사유가 실제 비적용이고, 미확보·미검토 항목은 남아 있지 않나요?",
          "standard": "판단에 필요한 자료가 없다는 것은 해당없음이나 확인완료의 근거가 아닙니다.",
          "guidance": "대상이 없는 규칙은 이유를 적고 제외하세요. 남은 자료 부족·검토 보류는 필요한 자료와 완료 조건을 함께 기록합니다.",
          "evidenceHint": "해당없음 이유 / 자료부족 목록 / 추가 확보 계획",
          "codeRefs": [],
          "sourceRefs": [
            "codes",
            "RD-05"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        },
        {
          "id": "CLOSE-05",
          "title": "중복·편집 메모·우수사례 구분",
          "question": "동일 하자의 중복 적용을 피하고, 편집 메모와 우수사례를 하자에서 구분했나요?",
          "standard": "15xx는 우수사례이며 세 번째 숫자를 이용한 일반 하자 분류에 넣지 않습니다.",
          "guidance": "1511·1521·1522는 전체 기준의 공통사항과 세부 요건을 확인해야 합니다. 내장 첫 문장만으로 우수사례 요건 충족을 확정하지 않습니다.",
          "evidenceHint": "동일 사실 연결 / 비집계 편집 메모 / 우수사례 근거·추가 기준",
          "codeRefs": [
            "1511",
            "1521",
            "1522"
          ],
          "sourceRefs": [
            "codes",
            "OA-14"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "CLOSE-06",
          "title": "보완 조치 완료 여부",
          "question": "보완필요로 표시했던 항목의 수정·추가 확인 결과와 남은 조치를 정리했나요?",
          "standard": "검토 완료와 오류 없음은 다릅니다. 해결되지 않은 보완은 완료 처리하지 않습니다.",
          "guidance": "완료 조건을 확인한 뒤 상태를 변경하고 조치 결과를 기록하세요. 필요한 재점검을 생략하지 않습니다.",
          "evidenceHint": "보완 항목 / 실제 조치 / 확인 근거 / 남은 할 일",
          "codeRefs": [],
          "sourceRefs": [
            "codes"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": false
        },
        {
          "id": "CLOSE-07",
          "title": "최종 범위와 기록 보존",
          "question": "점검 범위·미확인 한계를 최종 확인하고 기록을 보존할 준비가 되었나요?",
          "standard": "자기점검 완료는 특허성 보증이나 공식 심사품질 등급 확정이 아닙니다.",
          "guidance": "출원번호·점검일·문서 버전을 확인하세요. 필요한 파일 백업과 최종 요약을 남기고 이후 청구범위가 바뀌면 다시 점검합니다.",
          "evidenceHint": "검토 완료일 / 대상 판본 / 최종 요약 / 남은 한계 / 백업 파일명",
          "codeRefs": [],
          "sourceRefs": [
            "codes",
            "sheet-scoring"
          ],
          "appliesTo": [
            "notice",
            "final",
            "rejection",
            "registration"
          ],
          "critical": true
        }
      ]
    }
  ],
  "codebook": [
    {
      "code": "0111",
      "title": "실질적으로 동일한 선행기술이 있음에도 불구하고 특허결정한 경우",
      "category": "검색의 충실성 — 신규성",
      "description": "실질적으로 동일한 선행기술이 있음에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0112",
      "title": "신규성 판단에 적합하지 않은 사항이 있음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "category": "검색의 충실성 — 신규성",
      "description": "신규성 판단에 적합하지 않은 사항이 있음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0121",
      "title": "진단코드 0112에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "category": "검색의 충실성 — 신규성",
      "description": "진단코드 0112에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0135",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "검색의 충실성 — 신규성",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0211",
      "title": "진보성을 부정할만한 선행기술이 있음에도 불구하고 특허결정한 경우",
      "category": "검색의 충실성 — 진보성",
      "description": "진보성을 부정할만한 선행기술이 있음에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0212",
      "title": "진보성 판단에 적합하지 않은 사항이 있음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "category": "검색의 충실성 — 진보성",
      "description": "진보성 판단에 적합하지 않은 사항이 있음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0221",
      "title": "진단코드 0212에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "category": "검색의 충실성 — 진보성",
      "description": "진단코드 0212에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0235",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "검색의 충실성 — 진보성",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0311",
      "title": "실질적으로 동일한 선출원이 있음에도 불구하고 특허결정한 경우",
      "category": "검색의 충실성 — 선출원·확대된 선출원",
      "description": "실질적으로 동일한 선출원이 있음에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0312",
      "title": "동일성 판단에서 적합하지 않은 사항이 있음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "category": "검색의 충실성 — 선출원·확대된 선출원",
      "description": "동일성 판단에서 적합하지 않은 사항이 있음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0321",
      "title": "진단코드 0312에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "category": "검색의 충실성 — 선출원·확대된 선출원",
      "description": "진단코드 0312에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0335",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "검색의 충실성 — 선출원·확대된 선출원",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0411",
      "title": "“발명의 설명 기재요건”에 위배되어 통상의 지식을 가진 자가 청구범위에 기재된 발명을 쉽게 실시할 수 없음에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 발명의 설명 기재요건",
      "description": "“발명의 설명 기재요건”에 위배되어 통상의 지식을 가진 자가 청구범위에 기재된 발명을 쉽게 실시할 수 없음에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0412",
      "title": "“발명의 설명 기재요건”에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "category": "명세서 해석의 정확성 — 발명의 설명 기재요건",
      "description": "“발명의 설명 기재요건”에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0421",
      "title": "진단코드 0412에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "category": "명세서 해석의 정확성 — 발명의 설명 기재요건",
      "description": "진단코드 0412에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0422",
      "title": "“배경기술 기재요건”에 위배됨에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 발명의 설명 기재요건",
      "description": "“배경기술 기재요건”에 위배됨에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0431",
      "title": "거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우",
      "category": "명세서 해석의 정확성 — 발명의 설명 기재요건",
      "description": "거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0432",
      "title": "등록결정하였으나 기타 지적하지 않은 경미한 사항이 있는 경우",
      "category": "명세서 해석의 정확성 — 발명의 설명 기재요건",
      "description": "등록결정하였으나 기타 지적하지 않은 경미한 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0433",
      "title": "의견제출통지에서 지적하지 않은 거절이유가 남아있었으나, 심사과정에서 자연적으로 해소된 경우(다만, 단일성 위배 통지 등 정당한 사유가 있는 경우 제외)",
      "category": "명세서 해석의 정확성 — 발명의 설명 기재요건",
      "description": "의견제출통지에서 지적하지 않은 거절이유가 남아있었으나, 심사과정에서 자연적으로 해소된 경우(다만, 단일성 위배 통지 등 정당한 사유가 있는 경우 제외)",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0435",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "명세서 해석의 정확성 — 발명의 설명 기재요건",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0511",
      "title": "“청구범위 기재요건”에 위배되어 청구범위가 불명확하거나 해석에 문제가 있음에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재요건",
      "description": "“청구범위 기재요건”에 위배되어 청구범위가 불명확하거나 해석에 문제가 있음에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0512",
      "title": "“청구범위 기재요건”에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재요건",
      "description": "“청구범위 기재요건”에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0521",
      "title": "진단코드 0512에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재요건",
      "description": "진단코드 0512에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0531",
      "title": "거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재요건",
      "description": "거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0532",
      "title": "등록결정하였으나 기타 지적하지 않은 경미한 사항이 있는 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재요건",
      "description": "등록결정하였으나 기타 지적하지 않은 경미한 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0533",
      "title": "거절이유가 있는 청구항을 인용하는 청구항에 대해 거절이유를 지적하지 않은 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재요건",
      "description": "거절이유가 있는 청구항을 인용하는 청구항에 대해 거절이유를 지적하지 않은 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0534",
      "title": "의견제출통지에서 지적하지 않은 거절이유가 남아있었으나, 심사과정에서 자연적으로 해소된 경우(다만, 단일성 위배 통지 등 정당한 사유가 있는 경우 제외)",
      "category": "명세서 해석의 정확성 — 청구범위 기재요건",
      "description": "의견제출통지에서 지적하지 않은 거절이유가 남아있었으나, 심사과정에서 자연적으로 해소된 경우(다만, 단일성 위배 통지 등 정당한 사유가 있는 경우 제외)",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0535",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재요건",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0612",
      "title": "“청구범위 기재방법”에 위배된 것이 아님에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재방법",
      "description": "“청구범위 기재방법”에 위배된 것이 아님에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0621",
      "title": "진단코드 0612에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재방법",
      "description": "진단코드 0612에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0622",
      "title": "“청구범위 기재방법”에 위배됨에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재방법",
      "description": "“청구범위 기재방법”에 위배됨에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0631",
      "title": "거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재방법",
      "description": "거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0632",
      "title": "의견제출통지에서 지적하지 않은 거절이유가 남아있었으나, 심사과정에서 자연적으로 해소된 경우(다만, 단일성 위배 통지 등 정당한 사유가 있는 경우 제외)",
      "category": "명세서 해석의 정확성 — 청구범위 기재방법",
      "description": "의견제출통지에서 지적하지 않은 거절이유가 남아있었으나, 심사과정에서 자연적으로 해소된 경우(다만, 단일성 위배 통지 등 정당한 사유가 있는 경우 제외)",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0635",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "명세서 해석의 정확성 — 청구범위 기재방법",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0711",
      "title": "“산업상 이용할 수 있는 발명”이 아님에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 기타 특허요건",
      "description": "“산업상 이용할 수 있는 발명”이 아님에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0712",
      "title": "“외국인의 권리능력 요건”에 위배됨에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 기타 특허요건",
      "description": "“외국인의 권리능력 요건”에 위배됨에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0713",
      "title": "“특허를 받을 수 없는 발명”임에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 기타 특허요건",
      "description": "“특허를 받을 수 없는 발명”임에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0714",
      "title": "“특허받을 수 있는 자의 요건”에 위배됨에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 기타 특허요건",
      "description": "“특허받을 수 있는 자의 요건”에 위배됨에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0715",
      "title": "“공동출원의 요건”에 위배됨에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 기타 특허요건",
      "description": "“공동출원의 요건”에 위배됨에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0716",
      "title": "“조약”에 위반됨에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 기타 특허요건",
      "description": "“조약”에 위반됨에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0717",
      "title": "“기타 특허요건”에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "category": "명세서 해석의 정확성 — 기타 특허요건",
      "description": "“기타 특허요건”에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0721",
      "title": "진단코드 0717에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "category": "명세서 해석의 정확성 — 기타 특허요건",
      "description": "진단코드 0717에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0722",
      "title": "“1특허출원 범위 요건”에 위배됨에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 기타 특허요건",
      "description": "“1특허출원 범위 요건”에 위배됨에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0731",
      "title": "거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우",
      "category": "명세서 해석의 정확성 — 기타 특허요건",
      "description": "거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0735",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "명세서 해석의 정확성 — 기타 특허요건",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0811",
      "title": "보정요건에 위배됨에도 불구하고 이를 인정하여 최종결정에 명백하게 영향을 미친 경우",
      "category": "명세서 해석의 정확성 — 보정",
      "description": "보정요건에 위배됨에도 불구하고 이를 인정하여 최종결정에 명백하게 영향을 미친 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0812",
      "title": "보정요건에 위배되지 않음에도 불구하고 이를 불인정하여 최종결정에 명백하게 영향을 미친 경우",
      "category": "명세서 해석의 정확성 — 보정",
      "description": "보정요건에 위배되지 않음에도 불구하고 이를 불인정하여 최종결정에 명백하게 영향을 미친 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0821",
      "title": "진단코드 0811, 0812에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "category": "명세서 해석의 정확성 — 보정",
      "description": "진단코드 0811, 0812에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0835",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "명세서 해석의 정확성 — 보정",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0911",
      "title": "분할, 변경출원의 요건에 위배됨에도 불구하고 특허결정한 경우",
      "category": "명세서 해석의 정확성 — 분할·변경출원",
      "description": "분할, 변경출원의 요건에 위배됨에도 불구하고 특허결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0912",
      "title": "분할, 변경출원의 요건에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "category": "명세서 해석의 정확성 — 분할·변경출원",
      "description": "분할, 변경출원의 요건에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0921",
      "title": "진단코드 0912에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "category": "명세서 해석의 정확성 — 분할·변경출원",
      "description": "진단코드 0912에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0931",
      "title": "거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우",
      "category": "명세서 해석의 정확성 — 분할·변경출원",
      "description": "거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "0935",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "명세서 해석의 정확성 — 분할·변경출원",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1011",
      "title": "의견제출기회를 부여하지 않고 거절결정한 경우",
      "category": "절차의 효율성 — 심사절차",
      "description": "의견제출기회를 부여하지 않고 거절결정한 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1021",
      "title": "절차 또는 방식에 위배된 경우",
      "category": "절차의 효율성 — 심사절차",
      "description": "절차 또는 방식에 위배된 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1022",
      "title": "의견제출통지 기회가 2회 이상 있었음에도 거절이유를 나중에 통지한 경우. 다만, 정당한 사유가 있는 경우에는 제외",
      "category": "절차의 효율성 — 심사절차",
      "description": "의견제출통지 기회가 2회 이상 있었음에도 거절이유를 나중에 통지한 경우. 다만, 정당한 사유가 있는 경우에는 제외",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1023",
      "title": "실질적으로 동일한 거절이유를 2회 이상 통지하는 경우. 다만, 정당한 사유가 있는 경우에는 제외",
      "category": "절차의 효율성 — 심사절차",
      "description": "실질적으로 동일한 거절이유를 2회 이상 통지하는 경우. 다만, 정당한 사유가 있는 경우에는 제외",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1024",
      "title": "최초거절이유와 최후거절이유를 혼동하여 잘못 통지한 경우",
      "category": "절차의 효율성 — 심사절차",
      "description": "최초거절이유와 최후거절이유를 혼동하여 잘못 통지한 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1025",
      "title": "선출원 적용과정에서 협의요구를 보내지 않은 경우",
      "category": "절차의 효율성 — 심사절차",
      "description": "선출원 적용과정에서 협의요구를 보내지 않은 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1031",
      "title": "최초부터 있던 거절이유를 2회 나누어 통지한 경우. 다만, 정당한 사유가 있는 경우는 제외",
      "category": "절차의 효율성 — 심사절차",
      "description": "최초부터 있던 거절이유를 2회 나누어 통지한 경우. 다만, 정당한 사유가 있는 경우는 제외",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1032",
      "title": "최후거절이유를 일괄하여 통지하지 않고 2회 나누어 통지한 경우. 다만, 정당한 사유가 있는 경우는 제외",
      "category": "절차의 효율성 — 심사절차",
      "description": "최후거절이유를 일괄하여 통지하지 않고 2회 나누어 통지한 경우. 다만, 정당한 사유가 있는 경우는 제외",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1033",
      "title": "동일 선행기술로 진보성 등의 최초 거절이유를 2회 통지한 경우. 다만, 정당한 사유가 있는 경우는 제외",
      "category": "절차의 효율성 — 심사절차",
      "description": "동일 선행기술로 진보성 등의 최초 거절이유를 2회 통지한 경우. 다만, 정당한 사유가 있는 경우는 제외",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1034",
      "title": "직권보정하였으나 명백하게 잘못 지적하여 절차를 지연시킨 경우",
      "category": "절차의 효율성 — 심사절차",
      "description": "직권보정하였으나 명백하게 잘못 지적하여 절차를 지연시킨 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1035",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "절차의 효율성 — 심사절차",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1221",
      "title": "적용 법조항이 명확히 기재되지 않거나 거절이유와 일치하지 않는 경우",
      "category": "고객지향성 — 의견제출통지서 내용",
      "description": "적용 법조항이 명확히 기재되지 않거나 거절이유와 일치하지 않는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1222",
      "title": "거절이유가 불명료한 경우",
      "category": "고객지향성 — 의견제출통지서 내용",
      "description": "거절이유가 불명료한 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1223",
      "title": "인용발명의 실체가 불명확한 경우",
      "category": "고객지향성 — 의견제출통지서 내용",
      "description": "인용발명의 실체가 불명확한 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1224",
      "title": "인용문헌의 첨부가 부적절하여 인용발명을 특정할 수 없는 경우",
      "category": "고객지향성 — 의견제출통지서 내용",
      "description": "인용문헌의 첨부가 부적절하여 인용발명을 특정할 수 없는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1225",
      "title": "양발명의 대비에 대한 기재가 미흡한 경우",
      "category": "고객지향성 — 의견제출통지서 내용",
      "description": "양발명의 대비에 대한 기재가 미흡한 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1231",
      "title": "거절이유의 기재에 경미한 사항이 있는 경우",
      "category": "고객지향성 — 의견제출통지서 내용",
      "description": "거절이유의 기재에 경미한 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1232",
      "title": "인용문헌의 첨부가 부적절하나 인용발명을 특정할 수 있는 경우",
      "category": "고객지향성 — 의견제출통지서 내용",
      "description": "인용문헌의 첨부가 부적절하나 인용발명을 특정할 수 있는 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1235",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "고객지향성 — 의견제출통지서 내용",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1311",
      "title": "거절결정서에 출원인의 주장 또는 보정사항에 대한 검토결과가 기재되어 있지 않아 최종결정에 명백하게 영향을 미친 경우",
      "category": "고객지향성 — 거절결정서 내용",
      "description": "거절결정서에 출원인의 주장 또는 보정사항에 대한 검토결과가 기재되어 있지 않아 최종결정에 명백하게 영향을 미친 경우",
      "kind": "diagnostic",
      "severity": "부적합",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1321",
      "title": "거절결정서에 진단코드 1311에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "category": "고객지향성 — 거절결정서 내용",
      "description": "거절결정서에 진단코드 1311에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1331",
      "title": "거절결정서에 경미한 사항이 있는 경우",
      "category": "고객지향성 — 거절결정서 내용",
      "description": "거절결정서에 경미한 사항이 있는 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1335",
      "title": "기타 바람직하지 않은 거절결정이유를 통지한 경우",
      "category": "고객지향성 — 거절결정서 내용",
      "description": "기타 바람직하지 않은 거절결정이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1421",
      "title": "보정요구서에 기재된 내용이 잘못되거나 불명확한 경우",
      "category": "고객지향성 — 기타 통지서 내용",
      "description": "보정요구서에 기재된 내용이 잘못되거나 불명확한 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1422",
      "title": "보정각하결정서에 기재된 내용이 잘못되거나 불명확한 경우",
      "category": "고객지향성 — 기타 통지서 내용",
      "description": "보정각하결정서에 기재된 내용이 잘못되거나 불명확한 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1423",
      "title": "분할, 변경출원에 대한 불인정예고통지서에 기재된 내용이 잘못되거나 불명확한 경우",
      "category": "고객지향성 — 기타 통지서 내용",
      "description": "분할, 변경출원에 대한 불인정예고통지서에 기재된 내용이 잘못되거나 불명확한 경우",
      "kind": "diagnostic",
      "severity": "주의",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1435",
      "title": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "category": "고객지향성 — 기타 통지서 내용",
      "description": "기타 바람직하지 않은 거절이유를 통지한 경우",
      "kind": "diagnostic",
      "severity": "하자",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1511",
      "title": "아래 1521 내지 1522 요건을 모두 충족하는 경우로서, 심사내용이 우수하여 타 심사관의 모범이 되는 심사사례",
      "category": "우수사례",
      "description": "아래 1521 내지 1522 요건을 모두 충족하는 경우로서, 심사내용이 우수하여 타 심사관의 모범이 되는 심사사례",
      "kind": "excellent",
      "severity": "우수사례",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1521",
      "title": "적절한 선행기술을 활용하고 아래 공통사항을 모두 충족하는 경우",
      "category": "우수사례",
      "description": "적절한 선행기술을 활용하고 아래 공통사항을 모두 충족하는 경우",
      "kind": "excellent",
      "severity": "우수사례",
      "sourceRefs": [
        "codes"
      ]
    },
    {
      "code": "1522",
      "title": "심사통지서가 논리적이고 간결하게 작성된 경우로서, 다음 (1) 내지 (4)의 내용을 만족하고 아래 공통사항을 모두 충족하는 경우",
      "category": "우수사례",
      "description": "심사통지서가 논리적이고 간결하게 작성된 경우로서, 다음 (1) 내지 (4)의 내용을 만족하고 아래 공통사항을 모두 충족하는 경우",
      "kind": "excellent",
      "severity": "우수사례",
      "sourceRefs": [
        "codes"
      ]
    }
  ],
  "references": [
    {
      "id": "sheet-rules",
      "title": "EQAI_sheet: 관점·등급·검증 규칙",
      "source": "references/eqai-sheet-rules.mjs",
      "url": "https://github.com/EQAI-MOIP/EQAI_sheet/blob/25fe5aaf25ad1dd6169cb4237723bb8c94b98e58/lib/eqai/rules.mjs",
      "text": "export const VERSION = '2026-Q3.v1';\nexport const decisions = { refusal: '거절결정', registration: '등록결정' };\nexport const perspectives = {\n  process: '절차의 효율성', interpretation: '명세서 해석의 정확성', search: '검색의 적절성',\n  refusalNotice: '거절결정서 기재 적정성', applicant: '출원인 수용가능성', notice: '의견제출통지서 기재 적정성'\n};\nexport const weights = {\n  refusal: { process: 2, interpretation: 6, search: 12, refusalNotice: 4, notice: 6 },\n  registration: { process: 4, interpretation: 6, search: 8, applicant: 6, notice: 6 }\n};\nexport const grades = ['상', '중상', '중', '중하', '하', '주의', '부적합'];\nexport const sourceGrade = { 주의: '비교적 중요한 하자', 부적합: '결론 변경 필요한 하자' };\nexport const states = { draft: '작성중', discussion: '협의중', final: '확정', reopened: '수정중', archived: '보관' };\nexport const codeStates = { assigned: '부여', candidate: '후보', withdrawn: '철회' };\nconst factors = { 상: 3, 중상: 2.5, 중: 2, 중하: 1.5, 하: 1, 주의: 1, 부적합: 1 };\nconst deductions = { 주의: 15, 부적합: 30 };\nconst buckets = ['부적합', '주의', '하자'];\n\nexport function allowedGrades(key) {\n  const exceptions = { process: ['중하'], interpretation: ['중상', '중하'] };\n  return grades.filter((grade) => !exceptions[key]?.includes(grade));\n}\nexport function normalizeNumber(value) {\n  if (typeof value !== 'string') return null;\n  const input = value.trim();\n  return /^(\\d{13}|\\d{2}-\\d{4}-\\d{7})$/.test(input) ? input.replaceAll('-', '') : null;\n}\nexport function displayNumber(value) {\n  const clean = normalizeNumber(value);\n  return clean ? clean.replace(/^(\\d{2})(\\d{4})(\\d{7})$/, '$1-$2-$3') : value;\n}\nexport function nowPeriod(date = new Date()) {\n  const [year, month] = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit' }).format(date).split('-');\n  return year + '-Q' + Math.ceil(Number(month) / 3);\n}\nexport function normalizeGrade(value) {\n  const input = String(value ?? '').trim();\n  return Object.keys(sourceGrade).find((key) => sourceGrade[key] === input) ?? input;\n}\nexport function classify(code) {\n  if (typeof code !== 'string' || !/^\\d{4}$/.test(code)) return null;\n  return code[2] === '1' ? '부적합' : code[2] === '2' ? '주의' : '하자';\n}\nexport function blank() {\n  return { number: '', type: 'refusal', period: nowPeriod(), round: 1, group: 'default', assignee: '', bonus: 0, bonusReason: '',\n    scores: {}, codes: [], reviewed: false, reviewReason: '', changeReason: '', extra: [], importStatus: '' };\n}\nexport function evaluate(input) {\n  const parts = Object.entries(weights[input.type] ?? {}).map(([key, weight]) => {\n    const grade = input.scores?.[key]?.grade ?? '';\n    const valid = allowedGrades(key).includes(grade);\n    return { key, weight, grade, score: valid ? factors[grade] * weight - (deductions[grade] ?? 0) : null };\n  });\n  const completed = parts.filter((part) => part.score !== null).length;\n  const bonusValid = Number.isInteger(input.bonus) && input.bonus >= 0 && input.bonus <= 10;\n  const total = completed === 5 && bonusValid ? parts.reduce((sum, part) => sum + part.score, input.bonus) : null;\n  const assigned = (input.codes ?? []).filter((item) => item.status === 'assigned' && classify(item.code));\n  const present = new Set(assigned.map((item) => classify(item.code)));\n  const representative = buckets.find((item) => present.has(item)) ?? (input.reviewed ? '검토 후 코드 없음' : '미검토');\n  const linked = new Map();\n  for (const item of assigned) {\n    const category = classify(item.code);\n    if (!linked.has(item.perspective)) linked.set(item.perspective, new Set());\n    linked.get(item.perspective).add(category);\n  }\n  const warnings = [];\n  if (assigned.some((item) => !item.perspective)) warnings.push('관점 미연결 코드가 있습니다.');\n  for (const { key, grade } of parts) {\n    const gradeClass = buckets.includes(grade) ? grade : null;\n    const codeClass = buckets.find((category) => linked.get(key)?.has(category));\n    if ((gradeClass || codeClass === '주의' || codeClass === '부적합') && gradeClass !== codeClass && !(!codeClass && linked.has(''))) {\n      warnings.push(perspectives[key] + '의 등급과 코드 분류를 확인하세요.');\n    }\n  }\n  return { parts, completed, bonusValid, total, assigned, present: [...present], representative, warnings };\n}\nexport function validate(input, { final = false, requireReasons = true } = {}) {\n  const errors = [];\n  if (!normalizeNumber(input.number)) errors.push('진단번호는 숫자 13자리 또는 NN-NNNN-NNNNNNN 형식으로 입력하세요.');\n  if (!/^\\d{4}-Q[1-4]$/.test(input.period)) errors.push('진단기간은 YYYY-Q1~Q4 형식으로 입력하세요.');\n  if (!Number.isInteger(input.round) || input.round < 1 || input.round > 999) errors.push('회차는 1~999 정수로 입력하세요.');\n  if (!weights[input.type]) errors.push('결정유형을 선택하세요.');\n  if (!/^[a-z0-9-]{1,40}$/.test(input.group)) errors.push('업무그룹을 선택하세요.');\n  const result = evaluate(input);\n  if (!result.bonusValid) errors.push('가점은 0~10 정수로 입력하세요.');\n  for (const { key, grade } of result.parts) {\n    if (grade && !allowedGrades(key).includes(grade)) errors.push(perspectives[key] + '에 사용할 수 없는 등급입니다.');\n    if (final && !grade) errors.push(perspectives[key] + '의 등급을 선택하세요.');\n    if (final && requireReasons && !input.scores[key]?.reason?.trim()) errors.push(perspectives[key] + '의 사유를 입력하세요.');\n  }\n  if (final && input.bonus > 0 && !input.bonusReason.trim()) errors.push('가점 사유를 입력하세요.');\n  const keys = new Set();\n  for (const item of input.codes) {\n    if (!classify(item.code)) errors.push('진단코드는 정확한 숫자 4자리로 입력하세요.');\n    if (item.perspective && weights[input.type]?.[item.perspective] == null) errors.push('해당 결정유형에 적용되는 관점을 선택하세요.');\n    if (!Object.hasOwn(codeStates, item.status)) errors.push('코드 부여상태를 선택하세요.');\n    const key = item.perspective + ':' + item.code;\n    if (keys.has(key)) errors.push(item.code + ' 코드는 같은 관점에 한 번만 부여할 수 있습니다. 발생 사유를 추가하세요.');\n    keys.add(key);\n  }\n  if (final && !input.reviewed) errors.push('진단코드 검토 완료를 확인하세요.');\n  if (final && result.warnings.length && !input.reviewReason.trim()) errors.push('코드 정합성을 확인하고 예외 승인 사유를 입력하세요.');\n  if (final && input.importStatus === 'pending') errors.push('Excel에서 이관한 내용을 검토 완료로 표시하세요.');\n  return [...new Set(errors)];\n}\nexport function reviewSignature(input) {\n  return JSON.stringify([input.type, input.scores, input.codes, input.bonus, input.bonusReason]);\n}\nexport function selectRows(rows, filter = {}) {\n  const latest = new Map();\n  const candidates = rows.filter((row) => (!filter.period || row.period === filter.period)\n    && (!filter.asOf || row.period <= filter.asOf)\n    && (filter.mode === 'official' || filter.archive || row.state !== 'archived'));\n  for (const row of candidates) {\n    const existing = latest.get(row.number);\n    if (!existing || row.period > existing.period || (row.period === existing.period\n      && (row.round > existing.round || (row.round === existing.round && row.id > existing.id)))) latest.set(row.number, row);\n  }\n  const work = [...latest.values()];\n  const official = filter.mode === 'official';\n  const selected = work.flatMap((row) => {\n    const rev = official ? row.final : row.working;\n    return rev ? [{ ...row, revision: rev }] : [];\n  }).filter((row) => (!filter.type || row.revision.input.type === filter.type)\n    && (!filter.assignee || row.revision.input.assignee.includes(filter.assignee))\n    && (!filter.version || row.revision.version === filter.version)\n    && (!filter.query || displayNumber(row.number).includes(filter.query) || row.number.includes(filter.query)));\n  const base = selected.map((row) => ({ ...row, result: row.revision.result ?? evaluate(row.revision.input) }));\n  const status = (row) => official ? 'final' : row.state;\n  const metrics = {\n    attention: (row) => row.result.present.includes('주의'),\n    unsuitable: (row) => row.result.present.includes('부적합'),\n    either: (row) => row.result.present.some((value) => value !== '하자'),\n    both: (row) => row.result.present.includes('주의') && row.result.present.includes('부적합'),\n    complete: (row) => row.result.total !== null,\n    incomplete: (row) => row.result.total === null,\n    review: (row) => !row.revision.input.reviewed,\n    warning: (row) => row.result.warnings.length > 0\n  };\n  const filtered = base.filter((row) => {\n    if (filter.metric?.startsWith('state:')) return status(row) === filter.metric.slice(6);\n    if (filter.metric?.startsWith('representative:')) return row.result.representative === filter.metric.slice(15);\n    if (filter.metric?.startsWith('perspective:')) {\n      const [, key, grade] = filter.metric.split(':');\n      return row.result.parts.some((part) => part.key === key && (part.grade || '미입력') === grade);\n    }\n    if (filter.metric?.startsWith('linked:')) {\n      return row.result.assigned.some((item) => (item.perspective || 'none') === filter.metric.slice(7));\n    }\n    return (!filter.metric || !metrics[filter.metric] || metrics[filter.metric](row))\n      && (!filter.code || row.result.assigned.some((code) => code.code === filter.code));\n  });\n  return { rows: filtered, excluded: work.length - selected.length, unfinalized: official ? work.filter((row) => !row.final).length : 0 };\n}\nexport function summarize(rows) {\n  const reviewed = rows.filter((row) => row.revision.input.reviewed);\n  const totals = rows.map((row) => row.result.total).filter((value) => value !== null).sort((a, b) => a - b);\n  const count = (category, set = rows) => set.filter((row) => row.result.present.includes(category)).length;\n  const codes = (category, set = rows) => set.reduce((sum, row) => sum + row.result.assigned.filter((item) => classify(item.code) === category).length, 0);\n  const union = (set) => set.filter((row) => row.result.present.some((value) => value !== '하자')).length;\n  const codeRows = new Map();\n  const representatives = {};\n  const distributions = {};\n  const linked = {};\n  const scoreBands = {};\n  const jobs = {};\n  for (const row of rows) {\n    const { result, revision } = row;\n    representatives[result.representative] = (representatives[result.representative] ?? 0) + 1;\n    jobs[row.state] = (jobs[row.state] ?? 0) + 1;\n    if (result.total !== null) {\n      const from = Math.floor(result.total / 10) * 10;\n      scoreBands[from] = (scoreBands[from] ?? 0) + 1;\n    }\n    for (const part of result.parts) {\n      distributions[part.key] ??= {};\n      const grade = part.grade || '미입력';\n      distributions[part.key][grade] = (distributions[part.key][grade] ?? 0) + 1;\n    }\n    const counted = new Set();\n    for (const item of result.assigned) {\n      const key = revision.version + ':' + item.code;\n      const entry = codeRows.get(key) ?? { version: revision.version, code: item.code, category: classify(item.code), count: 0, holdings: 0 };\n      entry.count++;\n      if (!counted.has(key)) entry.holdings++;\n      counted.add(key);\n      codeRows.set(key, entry);\n      linked[item.perspective || 'none'] = (linked[item.perspective || 'none'] ?? 0) + 1;\n    }\n  }\n  return {\n    total: rows.length, complete: totals.length, reviewed: reviewed.length, attention: count('주의'), unsuitable: count('부적합'),\n    attentionCodes: codes('주의'), unsuitableCodes: codes('부적합'), either: union(rows),\n    both: rows.filter((row) => row.result.present.includes('주의') && row.result.present.includes('부적합')).length,\n    reviewedAttention: count('주의', reviewed), reviewedUnsuitable: count('부적합', reviewed),\n    reviewedEither: union(reviewed), reviewedAttentionCodes: codes('주의', reviewed),\n    mean: totals.length ? totals.reduce((a, b) => a + b, 0) / totals.length : null,\n    median: totals.length ? (totals[Math.floor((totals.length - 1) / 2)] + totals[Math.floor(totals.length / 2)]) / 2 : null,\n    representatives, distributions, scoreBands, jobs, linked, codeRows: [...codeRows.values()].sort((a, b) => a.code.localeCompare(b.code)),\n    warnings: rows.filter((row) => row.result.warnings.length > 0).length\n  };\n}\n"
    },
    {
      "id": "sheet-manual",
      "title": "EQAI_sheet: 기본 매뉴얼 생성 코드",
      "source": "references/eqai-sheet-manual.mjs",
      "url": "https://github.com/EQAI-MOIP/EQAI_sheet/blob/25fe5aaf25ad1dd6169cb4237723bb8c94b98e58/lib/eqai/manual.mjs",
      "text": "import { grades, perspectives, weights } from './rules.mjs';\n\nexport const manualTitles = ['진단기준표', '세부입력기준'];\n\nexport function defaultManual() {\n  const cells = [];\n  const put = (r,c,value) => cells.push({r,c,value,ref:String.fromCharCode(64+c)+r});\n  const merges = [];\n  const factors = [3,2.5,2,1.5,1];\n  for (const [type,top,title] of [['refusal',2,'거절결정'],['registration',14,'등록결정']]) {\n    put(top,2,title);\n    const keys = Object.keys(weights[type]);\n    for (const [index,key] of keys.entries()) put(top,index+3,perspectives[key]);\n    const [start,end] = [top+2,top+8];\n    for (let row=start;row<=end;row++) {\n      const grade=grades[row-start];\n      if (row-start<5) put(row,2,grade);\n      if (row-start<5) {\n        for (const [index,key] of keys.entries()) put(row,index+3,'가중치 '+weights[type][key]+' × '+factors[row-start]);\n      }\n    }\n    put(end-1,2,'주의 · 가중치에서 15점 감점');\n    put(end,2,'부적합 · 가중치에서 30점 감점');\n    merges.push([top,2,top+1,2]);\n  }\n  return [\n    {title:manualTitles[0],top:2,left:2,cells,merges,rows:22,cols:8,widths:[5,27,29,29,29,29,29,19]},\n    {title:manualTitles[1],top:2,left:1,cells:[{r:2,c:1,ref:'A2',value:'원문 매뉴얼을 등록해야 볼 수 있습니다.'}],merges:[],rows:2,cols:1,widths:[55]}\n  ];\n}\n"
    },
    {
      "id": "sheet-scoring",
      "title": "EQAI_sheet: 점수와 코드 판정",
      "source": "references/eqai-sheet-scoring-rules.md",
      "url": "https://github.com/EQAI-MOIP/EQAI_sheet/blob/25fe5aaf25ad1dd6169cb4237723bb8c94b98e58/docs/scoring-rules.md",
      "text": "# 점수와 코드 판정\n\n기준 버전은 2026-Q3.v1, 매뉴얼 적용기간은 2026년 3분기다. `lib/eqai/rules.mjs`는 서버와 화면에서 공유한다. 원본 근거는 진단기준표 B2:H10·B14:H22, 거절결정건 L5, 등록 진단시트 L4, 각 시트의 셀 유효성 검사다.\n\n| 관점 | 거절 | 등록 |\n|---|---:|---:|\n| 절차의 효율성 | 2 | 4 |\n| 명세서 해석의 정확성 | 6 | 6 |\n| 검색의 적절성 | 12 | 8 |\n| 거절결정서 기재 적정성 | 4 | |\n| 출원인 수용가능성 | | 6 |\n| 의견제출통지서 기재 적정성 | 6 | 6 |\n\n상의 점수는 가중치 × 3이다. 중상·중·중하·하에는 각각 2.5, 2, 1.5, 1을 곱한다. 주의는 가중치−15, 부적합은 가중치−30을 적용한다. 두 유형 모두 합계 가중치는 30이다. 가점은 0~10 정수이며 5개 관점이 갖춰지면 총점에 더한다. 점수 범위는 −120~100이다. 절차는 중하, 명세서 해석은 중상·중하를 선택할 수 없다.\n\n주의의 원문 별칭은 ‘비교적 중요한 하자’, 부적합은 ‘결론 변경 필요한 하자’다. 등급과 코드는 별도로 저장한다. 코드의 3번째 숫자 1은 부적합, 2는 주의, 그 외는 하자로 분류한다. 부여한 코드만 집계하며 대표판정은 부적합, 주의, 하자 순서다.\n\n기본 운영 정책은 확정 전에 관점별 사유, 양수 가점의 사유, 코드 검토, 필요한 이관 검토와 예외 승인 사유를 요구한다. 관점별 사유 정책과 공식 코드 사전 등록 시 기준 버전을 추가한다. 이전 버전의 확정 점수·사유·코드 검토는 revision에 보존한다.\n"
    },
    {
      "id": "codes",
      "title": "진단코드 84개와 조건·운영 기준",
      "source": "references/diagnostic-codes.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/diagnostic-codes.md",
      "text": "# 특허·실용신안 심사품질 진단코드\n\n출처: 사용자 제공 「심사품질 진단기준」(2026. 9. 개정), Ⅰ. 특허·실용신안 심사품질 진단 항목. 아래 84개 코드는 원문의 진단유형 첫 문장을 따른다. 원문의 ①·② 등은 **예시이며 한정 열거가 아니다**. 원문 일러두기는 심사문서 작성 시기와 관계없이 적용하고, 특허·실용신안 항목은 2024. 4. 23. 이후 심사품질진단부터 적용한다고 명시한다. 이 파일은 특허·실용신안 전용이며 상표·디자인 코드를 포함하지 않는다. 원문에 없는 `11xx` 코드를 만들지 않는다.\n\nOA/RD/RC 규칙 ID는 검사 절차를, 네 자리 진단코드는 확인된 진단유형을 가리킨다. 진단 결과에 **대상 문서·시점, 청구항, 조항, 근거 쪽수, 결정 경과 및 코드 선택 근거**를 붙인다. 코드별 문구의 `특허결정`, `거절결정`, `최종결정에 명백하게 영향`, `다른 정당한 거절이유` 같은 조건을 생략하지 않는다. 통지서만 확보했거나 후속 결정을 확인하지 못하면 거절결정 전제 코드를 확정하지 않는다. 동일 사안을 중복 집계하지 않도록 실체적 오류와 통지서의 기재 오류를 구별한다. 공식 문구와 예시를 더 확인해야 하면 제공받은 기준 원문을 대조한다.\n\n## 결정 경과에 따른 코드 선택\n\n- **잘못된 거절이유의 결론:** 해당 이유로 거절결정하고 다른 정당한 거절이유가 없으면 해당 분야의 `xx12`(기타 특허요건 `0717`, 보정 `0812` 등 별도 문구 참조)를 검토한다. 거절결정 전 통지에 그쳤거나 다른 정당한 거절이유가 있다면 해당 `xx21`을 검토한다. 단순히 틀린 이유가 있다는 사실만으로 `xx12`를 부여하지 않는다.\n- **놓친 하자:** 특허결정에도 남은 중대한 하자(`xx11` 또는 그 분야의 특허결정 코드), 거절결정 시 미지적 사유(`xx31`), 등록결정의 경미한 사항(`xx32`), 통지하지 않았지만 심사 중 자연 해소된 사유(`xx33`/`xx34`)를 각 코드의 명시 조건에 맞춰 구별한다. 숫자 끝자리만으로 기계적으로 일반화하지 않는다.\n- **기재의 품질:** 실체 판단 오류(`01`–`09`)와 의견제출통지서 문구·인용문헌·대비의 오류(`12`), 결정서(`13`), 기타통지서(`14`), 절차(`10`)는 각자의 요건을 따로 확인한다. `xx35`는 해당 분야의 '기타 바람직하지 않은 거절이유'에만 쓴다.\n- **증거 부족:** 결정 경과, 당시 청구항, 명세서 또는 인용문헌을 확인하지 못하면 `조건부 점검`/`확인 불가`로 두고 확정 코드를 억지로 부여하지 않는다.\n\n## 공식 진단유형 목록\n### 검색의 충실성 — 신규성\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `0111` | 실질적으로 동일한 선행기술이 있음에도 불구하고 특허결정한 경우 |\n| `0112` | 신규성 판단에 적합하지 않은 사항이 있음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우 |\n| `0121` | 진단코드 0112에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우 |\n| `0135` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 검색의 충실성 — 진보성\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `0211` | 진보성을 부정할만한 선행기술이 있음에도 불구하고 특허결정한 경우 |\n| `0212` | 진보성 판단에 적합하지 않은 사항이 있음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우 |\n| `0221` | 진단코드 0212에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우 |\n| `0235` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 검색의 충실성 — 선출원·확대된 선출원\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `0311` | 실질적으로 동일한 선출원이 있음에도 불구하고 특허결정한 경우 |\n| `0312` | 동일성 판단에서 적합하지 않은 사항이 있음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우 |\n| `0321` | 진단코드 0312에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우 |\n| `0335` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 명세서 해석의 정확성 — 발명의 설명 기재요건\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `0411` | “발명의 설명 기재요건”에 위배되어 통상의 지식을 가진 자가 청구범위에 기재된 발명을 쉽게 실시할 수 없음에도 불구하고 특허결정한 경우 |\n| `0412` | “발명의 설명 기재요건”에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우 |\n| `0421` | 진단코드 0412에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우 |\n| `0422` | “배경기술 기재요건”에 위배됨에도 불구하고 특허결정한 경우 |\n| `0431` | 거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우 |\n| `0432` | 등록결정하였으나 기타 지적하지 않은 경미한 사항이 있는 경우 |\n| `0433` | 의견제출통지에서 지적하지 않은 거절이유가 남아있었으나, 심사과정에서 자연적으로 해소된 경우(다만, 단일성 위배 통지 등 정당한 사유가 있는 경우 제외) |\n| `0435` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 명세서 해석의 정확성 — 청구범위 기재요건\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `0511` | “청구범위 기재요건”에 위배되어 청구범위가 불명확하거나 해석에 문제가 있음에도 불구하고 특허결정한 경우 |\n| `0512` | “청구범위 기재요건”에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우 |\n| `0521` | 진단코드 0512에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우 |\n| `0531` | 거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우 |\n| `0532` | 등록결정하였으나 기타 지적하지 않은 경미한 사항이 있는 경우 |\n| `0533` | 거절이유가 있는 청구항을 인용하는 청구항에 대해 거절이유를 지적하지 않은 경우 |\n| `0534` | 의견제출통지에서 지적하지 않은 거절이유가 남아있었으나, 심사과정에서 자연적으로 해소된 경우(다만, 단일성 위배 통지 등 정당한 사유가 있는 경우 제외) |\n| `0535` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 명세서 해석의 정확성 — 청구범위 기재방법\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `0612` | “청구범위 기재방법”에 위배된 것이 아님에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우 |\n| `0621` | 진단코드 0612에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우 |\n| `0622` | “청구범위 기재방법”에 위배됨에도 불구하고 특허결정한 경우 |\n| `0631` | 거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우 |\n| `0632` | 의견제출통지에서 지적하지 않은 거절이유가 남아있었으나, 심사과정에서 자연적으로 해소된 경우(다만, 단일성 위배 통지 등 정당한 사유가 있는 경우 제외) |\n| `0635` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 명세서 해석의 정확성 — 기타 특허요건\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `0711` | “산업상 이용할 수 있는 발명”이 아님에도 불구하고 특허결정한 경우 |\n| `0712` | “외국인의 권리능력 요건”에 위배됨에도 불구하고 특허결정한 경우 |\n| `0713` | “특허를 받을 수 없는 발명”임에도 불구하고 특허결정한 경우 |\n| `0714` | “특허받을 수 있는 자의 요건”에 위배됨에도 불구하고 특허결정한 경우 |\n| `0715` | “공동출원의 요건”에 위배됨에도 불구하고 특허결정한 경우 |\n| `0716` | “조약”에 위반됨에도 불구하고 특허결정한 경우 |\n| `0717` | “기타 특허요건”에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우 |\n| `0721` | 진단코드 0717에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우 |\n| `0722` | “1특허출원 범위 요건”에 위배됨에도 불구하고 특허결정한 경우 |\n| `0731` | 거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우 |\n| `0735` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 명세서 해석의 정확성 — 보정\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `0811` | 보정요건에 위배됨에도 불구하고 이를 인정하여 최종결정에 명백하게 영향을 미친 경우 |\n| `0812` | 보정요건에 위배되지 않음에도 불구하고 이를 불인정하여 최종결정에 명백하게 영향을 미친 경우 |\n| `0821` | 진단코드 0811, 0812에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우 |\n| `0835` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 명세서 해석의 정확성 — 분할·변경출원\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `0911` | 분할, 변경출원의 요건에 위배됨에도 불구하고 특허결정한 경우 |\n| `0912` | 분할, 변경출원의 요건에 위배되지 않음에도 불구하고 거절결정한 경우로서 다른 정당한 거절이유가 없는 경우 |\n| `0921` | 진단코드 0912에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우 |\n| `0931` | 거절결정하였으나 지적하지 않은 거절이유가 남아있는 경우 |\n| `0935` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 절차의 효율성 — 심사절차\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `1011` | 의견제출기회를 부여하지 않고 거절결정한 경우 |\n| `1021` | 절차 또는 방식에 위배된 경우 |\n| `1022` | 의견제출통지 기회가 2회 이상 있었음에도 거절이유를 나중에 통지한 경우. 다만, 정당한 사유가 있는 경우에는 제외 |\n| `1023` | 실질적으로 동일한 거절이유를 2회 이상 통지하는 경우. 다만, 정당한 사유가 있는 경우에는 제외 |\n| `1024` | 최초거절이유와 최후거절이유를 혼동하여 잘못 통지한 경우 |\n| `1025` | 선출원 적용과정에서 협의요구를 보내지 않은 경우 |\n| `1031` | 최초부터 있던 거절이유를 2회 나누어 통지한 경우. 다만, 정당한 사유가 있는 경우는 제외 |\n| `1032` | 최후거절이유를 일괄하여 통지하지 않고 2회 나누어 통지한 경우. 다만, 정당한 사유가 있는 경우는 제외 |\n| `1033` | 동일 선행기술로 진보성 등의 최초 거절이유를 2회 통지한 경우. 다만, 정당한 사유가 있는 경우는 제외 |\n| `1034` | 직권보정하였으나 명백하게 잘못 지적하여 절차를 지연시킨 경우 |\n| `1035` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 고객지향성 — 의견제출통지서 내용\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `1221` | 적용 법조항이 명확히 기재되지 않거나 거절이유와 일치하지 않는 경우 |\n| `1222` | 거절이유가 불명료한 경우 |\n| `1223` | 인용발명의 실체가 불명확한 경우 |\n| `1224` | 인용문헌의 첨부가 부적절하여 인용발명을 특정할 수 없는 경우 |\n| `1225` | 양발명의 대비에 대한 기재가 미흡한 경우 |\n| `1231` | 거절이유의 기재에 경미한 사항이 있는 경우 |\n| `1232` | 인용문헌의 첨부가 부적절하나 인용발명을 특정할 수 있는 경우 |\n| `1235` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 고객지향성 — 거절결정서 내용\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `1311` | 거절결정서에 출원인의 주장 또는 보정사항에 대한 검토결과가 기재되어 있지 않아 최종결정에 명백하게 영향을 미친 경우 |\n| `1321` | 거절결정서에 진단코드 1311에 해당하지 않으나 심사기준에 부합되지 않는 사항이 있는 경우 |\n| `1331` | 거절결정서에 경미한 사항이 있는 경우 |\n| `1335` | 기타 바람직하지 않은 거절결정이유를 통지한 경우 |\n\n### 고객지향성 — 기타 통지서 내용\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `1421` | 보정요구서에 기재된 내용이 잘못되거나 불명확한 경우 |\n| `1422` | 보정각하결정서에 기재된 내용이 잘못되거나 불명확한 경우 |\n| `1423` | 분할, 변경출원에 대한 불인정예고통지서에 기재된 내용이 잘못되거나 불명확한 경우 |\n| `1435` | 기타 바람직하지 않은 거절이유를 통지한 경우 |\n\n### 우수사례\n\n| 코드 | 진단유형 (공식 기준) |\n|---|---|\n| `1511` | 아래 1521 내지 1522 요건을 모두 충족하는 경우로서, 심사내용이 우수하여 타 심사관의 모범이 되는 심사사례 |\n| `1521` | 적절한 선행기술을 활용하고 아래 공통사항을 모두 충족하는 경우 |\n| `1522` | 심사통지서가 논리적이고 간결하게 작성된 경우로서, 다음 (1) 내지 (4)의 내용을 만족하고 아래 공통사항을 모두 충족하는 경우 |\n\n## 특히 혼동하기 쉬운 유형\n\n### 제42조 기재요건의 오지적: `0412`/`0421`과 `0512`/`0521`\n\n- **발명의 설명** 기재요건(제42조제3항 등)을 잘못 지적한 경우는 `04xx`, **청구범위** 기재요건(제42조제4항)은 `05xx`이다. 제42조 전체를 `0521`로 묶지 않는다. 시행령 제5조의 **청구범위 기재방법**은 `06xx`다.\n- 청구범위 기재요건 위반이 아닌데 이를 이유로 **거절결정했고 다른 정당한 거절이유가 없다면** `0512`다. 잘못 통지했지만 그 이유로 거절결정하지 않았거나, 거절결정에 다른 정당한 거절이유가 있다면 `0521`이다(원문 `0521` ①·②). 발명의 설명은 동일한 경과를 원문 `0412`/`0421` 조건에 맞춰 검토한다.\n- 과거 사례의 `경화물`(경화성 엘라스토머 조성물의 경화물임이 청구항과 관련 종속항에서 명확한 경우), `임의로`(선택적 포함이라는 뜻이 명확한 경우)에 대한 제42조제4항제2호 불명확성 지적은, **통지 단계의 오지적이라면 `0521`**이다. 그 이유만으로 다른 정당한 사유 없이 거절결정했다면 `0512`로 바꾼다. 해당 시점의 청구항 전체·종속항·명세서와 결정서를 대조한 후 판정한다. 예시는 자동 판정 규칙이 아니다.\n\n### 내용의 오류와 표현의 오류\n\n- 법조항 미기재·오기 또는 이유와 법조항의 불일치는 `1221`; 이유가 포괄적·모호하여 정당한 의견제출 기회를 제공하지 못하면 `1222`; 인용발명의 실체 불명은 `1223`; 첨부문헌 문제로 인용발명 특정이 **불가능**하면 `1224`, 특정은 **가능**하면 `1232`; 양발명의 대비 기재 미흡은 `1225`와 경미한 `1231`의 기준·영향을 원문 예시에 비추어 구별한다.\n- `1231`은 문헌 조합·기술대비의 미흡, 과도한 축소 유도, 자의적인 진보성 논리 및 아래 적용 기준에 해당하는 오기 등 원문 ①–⑫의 **경미한 사항**을 포함한다. 이유 자체가 성립하지 않는 실체적 판단과 혼동하지 않는다.\n- 거절결정서가 출원인의 핵심 주장·보정 검토를 누락하여 **최종결정에 명백하게 영향**을 주면 `1311`, 그 조건을 충족하지 않는 심사기준 불부합은 `1321`, 경미한 기재사항은 `1331`이다. 통지되지 않은 새 이유만으로 거절결정했는지 등 의견제출기회 문제는 `1011`도 확인한다.\n- `1511`은 `1521`과 `1522`를 모두 만족하고 타 심사관의 모범인 사례다. `1521`은 적절한 선행기술 활용, `1522`는 논리적이고 간결한 심사통지서의 (1)–(4) 요건을 요구하며, 두 코드에는 원문 공통사항(일괄 통지·적절한 거절이유·검색이력·등록이유·바람직하지 않은 심사행위 부재)을 모두 확인한다.\n\n### `1231`의 오기 적용 기준 — 통지서만으로 정정 가능한지\n\n사용자 평가관이 2026-10-11에 확인한 운영 기준이다. 위 공식 진단유형의 문구를 변경하는 것이 아니라, 의견제출통지서의 오기에 대한 적용 범위를 구체화한다. 검사 절차는 OA-14를 따른다.\n\n- **원칙적으로 제외:** 통지서 자체의 표·앞뒤 기재·기술적 문맥만으로 오기라는 사실과 올바른 의미를 명백하게 알 수 있는 단순오기는 `1231`을 부여하거나 진단 문제 건수에 포함하지 않는다. 필요하면 비집계 편집 메모로만 표시한다. 예: 표와 문맥이 `300 nm`임을 명백히 보여주는데 본문 한 곳이 `300 m`인 경우.\n- **예외적으로 부여:** 통지서만으로는 단순오기를 확정·정정할 수 없고, 해당 구성의 존재 위치나 정확한 수치범위를 알기 위해 인용발명 원문을 읽어야 하며 실제 오기가 확인되면, 출원인의 추가 확인 부담을 발생시킨 경미한 기재 하자로 `1231`을 부여한다. 예: 구성의 식별번호 오기, 실제 `0.01~10 μm`인 범위를 `0.01~1.0 μm`로 옮긴 경우. 첨부된 인용문헌을 읽어야 하는 경우도 이 예외에 포함한다.\n- **적용 범위:** 단위·숫자·식별번호라는 오류 유형만으로 자동 판정하지 않는다. 통지서만으로 올바른 내용을 명백히 복원할 수 있는지를 개별 확인한다. 두 수치범위가 겹치지 않는다는 내부 모순을 알아챌 수 있더라도, 어느 수치 또는 결론이 잘못됐는지 원문을 읽어야 알 수 있다면 단순오기로 제외하지 않는다. 나중 결정서에서 정정됐다는 이유로 최초 통지의 고객지향성 하자가 없어지는 것은 아니다.\n- **증거와 코드 구별:** 인용발명 원문을 확보하지 못했다면 오기 의심·조건부 점검으로 남기고 `1231`을 확정하지 않는다. 법조항의 불일치, 거절이유 불명료, 대비의 실질적 부족, 실체 판단 오류는 해당 코드의 요건으로 별도 평가한다. 같은 오기를 다른 코드와 중복 집계하지 않고, 이 단순오기 제외 기준을 법조항 오류나 실체적 오류 전반으로 확대하지 않는다.\n\n\n### 최초부터 존재한 이유를 최후로 통지한 경우 — `1024`와 `1031`\n\n- 최후통지가 있으면 OA-15를 필수 적용한다. 보정 전부터 존재하며 보정으로 발생하지 않은 거절이유를 최후로 통지한 것이 확인되면 공식 유형 `1024`(최초거절이유와 최후거절이유의 혼동)를 적용한다. 새 문헌·새 법조항·나중 발견이라는 사실만으로 보정에 따른 발생을 인정하지 않는다.\n- 최초부터 있던 이유를 일괄 통지하지 않고 나누어 통지한 문제는 `1031`의 정당한 사유 제외 조건을 따로 확인한다. 같은 사실에 두 코드를 자동 중복 집계하지 말고 별개 절차 하자인지와 선택 근거를 적는다.\n- 보정으로 추가·삭제·변경된 구성과 해당 이유의 발생 사이에 실제 인과관계가 있는지 보정 전후 전체 청구범위로 판단한다. 필요한 판본·증거가 부족한 사항에 확정 코드를 붙이지 않는다.\n\n\n### `바람직하게`·`특히`의 잔존 기재불비 — `0511`\n\n- OA-17·RC-07에 따라 선호·강조 표현과 이중한정을 필수 점검한다. 청구범위에 남지 않도록 정리해야 할 중요 사항이며, 명확성·해석 하자가 남은 채 특허결정된 경우 공식 유형 `0511`로 표시한다. 발명의 설명에 사용된 표현을 같은 하자로 집계하지 않는다.\n- 이중한정에 대한 정당한 명확성 통지에 `0521`을 붙이지 않는다. `임의로`·`선택적으로`의 명확한 선택적 구성과 혼동하지 않는다. 심사 중 해소된 경우 최종 잔존 하자 `0511`을 적용하지 않으며, 미지적 후 자연 해소 유형은 `0534`의 조건을 별도 확인한다.\n"
    },
    {
      "id": "porting",
      "title": "AI_Reviewer: 규칙 이식 명세",
      "source": "references/reviewer-rule-porting.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/docs/RULES.md",
      "text": "# AI 심사팀장 큐리 — 규칙 이식 명세\n\n## 기준과 보존 범위\n\n- 원본 스킬: **AI 품질진단 시스템** (`kipris-notice-review-portable`).\n- `skill.json` 확인 버전: **2026.11.12**, 유형 `diagnostic`, 배포형 `portable`, release ID `diagnostic-portable-2026.11.12`.\n- 확인 날짜: 2026-11-22.\n- 원본 파일은 `rules/`에 내용 그대로 보존했습니다. `APIKEY.md` 및 실제 키는 읽거나 복사하지 않았습니다.\n- `js/rules-data.js`는 원문에서 추출한 데이터와 조건 검증 보조 함수를 담은 독립 JavaScript입니다. 외부 모듈·CDN·실행 중 규칙 다운로드가 없습니다.\n\n| 규칙군 | 범위 | 수 | 적용 대상 |\n|---|---|---:|---|\n| OA | OA-01–OA-17 | 17 | 각 의견제출통지서·최후통지서를 독립 검토 |\n| RD | RD-01–RD-06 | 6 | 거절결정서와 결정 이전의 모든 통지 비교 |\n| RC | RC-01–RC-07 | 7 | 특허결정·등록 시점의 전체 유효 청구항 |\n| 공식 진단코드 | 01xx–10xx, 12xx–15xx | 84 | 원문 문구의 경과·효과·증거 조건을 확인해 부여 |\n\nOA/RD/RC는 검사 절차의 식별자이며 네 자리 진단코드는 확인된 문제의 유형입니다. 두 체계는 별도로 저장합니다. `11xx` 코드는 원문에 없으므로 만들지 않습니다. 15xx 우수사례 코드는 보존하되 반려사유로 집계하지 않습니다.\n\n공식 코드 문구의 출처는 스킬에 포함된 사용자 제공 「심사품질 진단기준」(2026. 9. 개정)입니다. 해당 파일은 원문 첫 문장 84개와 적용 안내를 제공하며, 원문 사례의 모든 세부 내용을 완전하게 재현한 자료라고 주장하지 않습니다. OA-17의 판례 내용과 사용자 확인 운영 기준을 구별하는 원문도 유지했습니다.\n\n## 결과의 상태와 코드 확정\n\n사용자 화면의 문구는 **반려 검토사항이 있어요**, **적용한 규칙에서 발견되지 않았어요**, **추가 확인이 필요해요**를 구별합니다. '적용한 규칙에서 발견되지 않았어요'는 적용 범위와 확보 범위가 충분하고 확인된 문제가 없을 때 사용합니다. 통지 누락·판본 미확보·인용문헌 미대조·검토 실패를 문제없음으로 변환하면 안 됩니다. 코드 없는 조건부 점검도 결과에서 보존합니다.\n\n다음은 원문의 조건을 구현할 때 특히 보존한 사항입니다.\n\n| 코드·규칙 | 이식 원칙 |\n|---|---|\n| 0511 | 최종 유효 청구범위에 명확성·해석 하자가 남은 채 특허결정되었는지 확인. RC-07의 단어 발견만으로 확정하지 않음. |\n| 0512 / 0521 | 같은 청구범위 오지적이라도 해당 이유로 거절결정했고 다른 정당한 이유가 없는지에 따라 구별. OA-05·11·12 사례의 0521 표기를 결과 경과보다 우선하지 않음. |\n| 04xx / 05xx / 06xx | 발명의 설명 기재요건, 청구범위 기재요건, 청구범위 기재방법을 구분. |\n| OA-15 / 1024 | 모든 최후통지에 적용. 보정 전후 전체 청구범위와 이유 발생의 인과관계를 비교. |\n| 1031 | 최초부터 있던 이유의 분할 통지 및 정당한 사유 예외를 따로 확인. 1024와 자동 중복 집계하지 않음. |\n| OA-14 / 1231 | 통지서 자체만으로 명백히 정정되는 단순오기는 제외. 원문을 읽어야 정정되는 오기는 실제 인용발명 대조 후 확정. |\n| RD-01–RD-05 | 의견서가 없어도 확보한 통지·결정으로 판정 가능한 사항은 계속 검토. 선행 통지 누락 시 '전부에 없음' 확정 금지. |\n| RD-06 / 1311 | 실제 출원인 주장·보정내용과 최종결정에 미친 명백한 영향의 근거 필요. |\n| OA-17 / RC-07 | 선호·강조의 이중한정은 필수 검토. 선택적 '임의로'와 구별. 발명의 설명만의 표현·삭제항 제외. |\n\n`validateFinding()`은 원문의 증거·경과 조건에 대한 보조 검증입니다. 코드가 유효한 목록에 있다는 사실만으로 실체 판단을 대신하지 않으며, 이 함수의 통과가 법적 타당성을 보증하지 않습니다. 판정에는 원문 대조와 모델 검토가 함께 필요합니다.\n\n## 토큰 관리\n\n규칙 원문을 의미 손실이 생기는 글자 수로 잘라내지 않습니다. 규칙 ID 경계를 기준으로 배치를 나누고, 원문 전체·보류 예외·관련 코드 조건을 함께 전달합니다. 별도의 전역 운영 지침은 원본의 핵심 판본·원문·증거·예외 요구를 압축해 반복 전달합니다.\n\n`buildRuleBatches({ group:'OA', maxTokens:16000, reserveTokens:2048 })`는 규칙 경계를 유지한 배치를 생성합니다. 여기서 `maxTokens`는 그 호출의 규칙 배치 예산이며 앱 전체의 기본 50,000 토큰 설정을 변경하는 값이 아닙니다. 증거·출력·API 포맷 여유는 호출자가 따로 배정해야 합니다. `estimatedTokens`는 모델 전용 토크나이저 없이 계산한 UTF-8 바이트 상한이므로 실제 토큰 수가 아닙니다. `oversized:true`인 배치는 그대로 전송하지 말고 입력을 더 작은 범위로 재구성해야 합니다.\n\n문서의 경우 페이지·문헌 식별자·청구항·날짜·짧은 인용을 요약에 함께 보존해야 합니다. 요약만으로 원문 대조 완료를 선언하거나 생략 부분의 부재를 확정하지 않아야 합니다.\n\n## JavaScript 인터페이스\n\n브라우저 전역 `ReviewRules`, Node 테스트에서는 `require('./js/rules-data.js')`로 사용합니다.\n\n```js\nReviewRules.version;                      // '2026.11.12'\nReviewRules.counts;                       // OA:17, RD:6, RC:7, rules:30, codes:84\nReviewRules.groups.OA;                    // 규칙 객체 배열\nReviewRules.byId['OA-15'].fullText;        // 예외까지 포함한 원문\nReviewRules.codes['0512'].description;     // 공식 코드 문구\nReviewRules.selectRules(['OA-14','OA-15']);\nReviewRules.applicabilityFor({documentType:'final_notice'});\nReviewRules.buildRuleBatches({group:'RC',maxTokens:16000});\nReviewRules.validateFinding(finding,context);\n```\n\n규칙 객체는 `id`, `group`, `title`, `fullText`, `fields`, `purpose`, `inputs`, `exceptions`, `sourcePath`, `mentionedCodes`를 제공합니다. 코드 객체는 `code`, `title`, `description`, `category`, `conditions`, `sourcePath` 및 일부 코드의 `operatingNote`를 제공합니다.\n\n조건 검증에 사용할 확인값은 `context.verification`에 앱이 원문·메타데이터를 확인한 명시적인 불리언으로 전달합니다. 모델이 생성한 `finding.verification`이나 `conditions`를 증거 검증값으로 신뢰하지 않습니다. 누락된 값을 자동으로 참 또는 거짓으로 가정하지 않습니다. 예: `claimVersionVerified`, `grantDecisionVerified`, `rejectionDecisionVerified`, `hasOtherValidReasons`, `priorNoticesComplete`, `sourceEvidenceVerified`, `documentIdentityVerified`. `evidence` 항목에는 문서 식별자·쪽수 또는 위치·원문을 넣습니다.\n\n## 원문 파일 체크섬\n\n원문 보존 확인용 SHA-256입니다.\n\n| 파일 | SHA-256 |\n|---|---|\n| `rules/SKILL.md` | `fb29c9292c5d91f8cf2aab3a8ae10ceb15c82c293e9d28f753180523bc61acdf` |\n| `rules/references/diagnostic-codes.md` | `c8e001713c59b87d628d4ad40adaae190e33ea1814bec2cd1c2fe91403244031` |\n| `rules/references/office-action-rules.md` | `39b3b73d7a1bfc52da957e0fafeaec478f2d30a13e1f532ed5091b85a1dc51ef` |\n| `rules/references/registered-claim-rules.md` | `467436605a78a62b7cd664ff605c7d4152b1758ef34af52956d7b14efc8e0ebc` |\n| `rules/references/rejection-decision-rules.md` | `59d3dad87ed751435c820e4d58e5dbb0cafd45018f76b8b18d9830183c8e2f1d` |\n| `rules/skill.json` | `4545f61ed3717010d2a36e21d98a0cc20b617010421d3e3ceffb59aeb5612c1c` |\n"
    },
    {
      "id": "OA-01",
      "title": "OA-01 주문 ↔ 세부 거절이유의 청구항 집합",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-01 주문 ↔ 세부 거절이유의 청구항 집합\n\n- **목적:** 주문(심사결과 표)의 각 법조문별 대상 청구항과 대응 세부 거절이유 전체의 대상 청구항을 비교한다.\n- **필요 입력:** 주문 각 행의 법조문·청구항, 대응 세부 이유의 제목과 하위 문단별 청구항.\n- **검출:** 주문에는 포함되지만 세부 이유에서 설명이 빠진 청구항; 세부 이유에서는 거절하지만 주문에서 빠진 청구항; 같은 법조문 아래 청구항 범위의 모순.\n- **보류·예외:** 세부 이유가 종속항까지 명시적으로 포괄하거나 공통 이유를 일괄 설명하는 경우. '제1항을 인용하는 항'의 범위를 통지서만으로 확정할 수 없는 경우에는 추정 집합으로 표시하고 단정하지 않는다.\n- **보고 예시:** '주문은 제1~5항인데 세부 이유는 제1~4항만 언급; 제5항 설명 위치를 찾지 못함.'"
    },
    {
      "id": "OA-02",
      "title": "OA-02 법조문·거절이유 종류의 일치",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-02 법조문·거절이유 종류의 일치\n\n- **목적:** 주문, 세부 제목, 결론의 법조문과 이유 종류를 대조한다.\n- **필요 입력:** 각 위치의 법조문과 주장의 내용.\n- **검출:** 같은 이유가 주문에서 제29조제2항인데 세부에서는 제29조제1항으로 적힌 경우; 표의 청구항과 다른 법조문에만 설명이 있는 경우.\n- **보류·예외:** 하나의 청구항에 복수 법조문을 별도로 적용한 경우. 단순 표기 오타와 적용 법조항의 실질적 불일치를 구별하고, 오기로 `1231`을 검토할 때는 OA-14를 먼저 적용한다.\n- **보고 예시:** '주문 3번의 제42조제4항제2호가 대응 세부 이유에서 제1호로 표시됨.'"
    },
    {
      "id": "OA-03",
      "title": "OA-03 인용발명 조합의 계승·추가·교체",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-03 인용발명 조합의 계승·추가·교체\n\n- **목적:** 독립항과 종속항 또는 세부 이유의 앞뒤 문단에서 실제 사용한 인용발명 집합이 결론에 정확히 반영됐는지 확인한다.\n- **필요 입력:** 청구항별 각 문단의 인용발명 번호, 비교 대상 구성, 결론 문구(예: '1에 의하여', '1과 2의 결합').\n- **검출:** 제1항을 인용발명 1로 대비하고 종속항의 부가구성을 2로 대비한 뒤 결론에는 1만 적거나 1+3으로 적음; 본문에서 1+2를 논증했는데 해당 청구항의 결론에는 2만 적음; 서로 다른 이유를 복사해 번호가 어긋남.\n- **보류·예외:** 종속항 전체 구성의 근거를 인용발명 2 단독으로 **별도로** 설명한 경우; 인용발명 1의 구성을 2가 명시적으로 포함한다고 서술한 경우. 특히 제조방법·출발물·중간물 청구항을 인용하더라도 최종 **물건**을 청구하는 PBP형 청구항은 아래 OA-07을 먼저 적용한다. 종속관계만으로 선행항의 인용발명 번호가 후행항 결론에 반드시 포함되어야 한다고 판정하지 않는다. 다만 정확한 청구범위와 결과물에 대한 영향이 통지서에 충분히 나타나지 않으면 OA-07의 **조건부 점검**으로 남긴다. '또는'으로 제시된 대안 조합은 각각 구분한다.\n- **보고 예시:** '제8항의 추가 구성은 2에서 대비했지만 결론은 1 단독으로 적혀 있어 근거 조합이 일치하지 않음.'"
    },
    {
      "id": "OA-04",
      "title": "OA-04 청구항별 인용발명 번호·첨부 목록의 안정성",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-04 청구항별 인용발명 번호·첨부 목록의 안정성\n\n- **목적:** 인용발명 1·2·3의 정의와 이후 문단의 호칭·공보번호·첨부목록을 문서 내부에서 대조한다.\n- **필요 입력:** 최초 정의, 각 문단의 번호와 식별자, 첨부 목록.\n- **검출:** 같은 '인용발명 2'에 서로 다른 문헌번호를 부여하거나, 미정의 인용발명 3을 사용하거나, 첨부 번호가 본문 정의와 뒤바뀜.\n- **보류·예외:** 문헌의 약칭·공개번호 표기가 다르지만 문서 안에서 동일성 연결이 명시된 경우. 첨부가 없다는 사실만으로 외부 문헌의 부재를 단정하지 않는다.\n- **보고 예시:** '앞부분의 인용발명 2는 WO-A이나 제6항 이유에서 동일 번호를 KR-B로 표기.'"
    },
    {
      "id": "OA-05",
      "title": "OA-05 제42조제4항제2호: 표현만을 문제 삼았는지",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-05 제42조제4항제2호: 표현만을 문제 삼았는지\n\n- **목적:** 문맥에서 뜻을 특정할 수 있는 표현에 대해 단어 자체의 존재만 지적한 명확성 거절이유인지 검토한다.\n- **필요 입력:** 지적 표현, 통지서에 인용된 청구항 앞뒤 문맥, 심사관이 제시한 둘 이상의 해석·경계 불명확성 또는 구체적인 이해 장애.\n- **검출:** '치환', '포함', '약' 등의 단어를 지적하면서 왜 청구범위가 불명확해지는지 설명하지 않거나, 통지서에 적힌 정의·선행 문맥을 고려하지 않은 듯한 경우. 문맥이 일부만 확보되면 **설명상 의문**으로 표시한다. 해당 청구항 및 관련 종속항에서 대상이 명확하게 특정되고 지적된 복수 해석이 성립하지 않으면 제42조제4항제2호 **오지적**으로 판정하고 진단코드 `0521`을 붙인다.\n- **보류·예외:** 동일 표현이 복수의 실질적 해석을 허용하거나 대상·범위·관계가 특정되지 않는다고 통지서가 구체적으로 설명한 경우. 발명의 설명을 보지 않은 상태에서 '문맥으로 충분히 명확하다'고 확정하지 않는다. 표현의 의미는 특정되지만 그 구조를 **실시할 수 있는지** 의심하는 논증이면 OA-08을 함께 적용한다.\n- **보고 예시:** '단어 자체만 문제 삼고 청구항에 인용된 정의를 검토한 흔적이 없어 명확성 이유의 설명이 부족할 가능성.'"
    },
    {
      "id": "OA-06",
      "title": "OA-06 이유 내 대상·논증·결론의 연결",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-06 이유 내 대상·논증·결론의 연결\n\n- **목적:** 각 문단의 대상 청구항과 실제 논증, 끝의 결론이 서로 맞는지 확인한다.\n- **필요 입력:** 이유 머리말, 문단별 대상 청구항, 차이점·인용발명 설명, 결론.\n- **검출:** 제9항을 검토한다면서 제10항의 한정만 설명하거나, 부가구성을 차이로 적은 뒤 해소 논증 없이 '동일'이라고 결론짓는 등 문서 내부의 비약·복사 오류.\n- **보류·예외:** 앞 문단을 명시적으로 원용하고 그 논증이 해당 청구항에도 적용되는 경우. 최종 물건이 제조방법·유래물로 특정된 경우에는 OA-07의 결과물 중심 판단을 먼저 적용한다. 기술적 사실의 참·거짓을 외부 자료 없이 판단하지 않는다.\n- **보고 예시:** '제7항의 추가 구성은 차이점으로 인정했으나 해당 차이를 처리하는 설명 없이 인용발명 1과 동일하다고 결론.'"
    },
    {
      "id": "OA-07",
      "title": "OA-07 PBP형 물건 청구항의 제조 경로와 인용발명",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-07 PBP형 물건 청구항의 제조 경로와 인용발명\n\n- **목적:** 방법·출발물·중간물 청구항을 인용하여 '그 방법으로 얻어진', '그 배양물로부터 분리된' 등으로 특정한 **물건 청구항**에서, 제조 경로와 최종 물건을 구별한다. PBP는 통상 *product-by-process* 청구항을 가리킨다. 방법이 다른 인용발명으로 최종 물건의 동일성을 판단하는 것만으로 오류로 표시하지 않는다.\n- **필요 입력:** 대상항의 청구대상이 물건인지 방법인지, 인용하는 항과 제조·유래 표현, 통지서가 주장하는 최종 물건의 구성·성질, 그 물건에 대비한 인용발명 번호와 논증, 제조 경로가 결과물에 미치는 차이를 통지서 스스로 인정·설명했는지.\n- **검토 순서:** (1) 청구대상이 최종 물건인지 확인한다. (2) 인용한 방법·중간물은 제조 경로로 따로 표시한다. (3) 거절이유가 **결과물 자체의 동일성**을 인용발명 2 등으로 논증하는지 읽는다. (4) 통지서 안에 제조 경로가 결과물의 구조·조성·성질에 차이를 만든다는 설명이 있는지 확인한다. (5) OA-03의 인용발명 계승 여부를 판단한다.\n- **정상·보류:** 제10항의 배양배지조성물이 제7항의 배양물에서 얻어진다고 해도, 거절이유가 인용발명 2의 배지조성물과 **결과물 자체**를 대비한다면 제7항에 사용한 인용발명 1을 제10항 결론에 더하지 않았다는 이유만으로 오류라고 하지 않는다. 제15항이 제5항 방법으로 얻어진 물건인 경우도 같다. 다만 통지서에 정확한 청구범위나 제조 경로가 결과물에 미치는 영향이 충분히 드러나지 않으면 **조건부 점검**으로 남긴다. 이는 확정 오류도, 완전히 해소된 항목도 아니다. 통지서에 결과물 차이가 없다는 논증이 충분히 보일 때에만 '문제 발견 없음'으로 처리한다. 문서 외 자료를 추정하지 않는다.\n- **검출:** 거절이유 **자체가** 제조 경로 때문에 결과물의 구성·성질이 달라진다고 명시하면서 그 차이를 처리하지 않고 물건이 동일하다고 결론짓는 내부 모순; 또는 최종 물건의 구성·성질을 전혀 특정하지 않고 제조 경로만의 유사성을 근거로 결과물 동일성을 단정하여 통지서상 대비 대상이 드러나지 않는 경우. 후자는 먼저 **설명상 의문**으로 분류한다.\n- **보고 예시:** '제10·15항은 선행 방법·배양물과 다른 인용발명 2로 대비되어 처음에는 조합 누락이 의심된다. 다만 물건인 배지조성물의 결과적 동일성을 판단한 PBP형 설명으로 읽힌다. 통지서만으로는 제조 경로가 최종 조성에 영향을 주는지 확정할 수 없어 조건부 점검으로 남기며, 인용발명 조합 오류라고 단정하지 않는다.'"
    },
    {
      "id": "OA-08",
      "title": "OA-08 주장한 문제와 적용 법조항의 정합성: 명확성 vs 실시용이성",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-08 주장한 문제와 적용 법조항의 정합성: 명확성 vs 실시용이성\n\n- **목적:** 제42조제4항제2호(청구범위의 명확·간결성)를 내세우면서 실제 논거는 특정 가능한 구조·폭·배치가 **제조·작동·재현될 수 있는지**에 관한 것인지 구분한다. 실시의 어려움을 주장하려면 제42조제3항제1호(발명의 설명에 의한 실시용이성)에 맞는 구체적 장애와 설명의 부족을 논증했는지 점검한다.\n- **필요 입력:** 주문·세부 이유의 법조항, 지적된 청구항 문구, 통지서가 제시한 해석과 실시상의 장애, 발명의 설명·도면을 언급한 부분, 결론 문장.\n- **검토 순서:** (1) 문구의 뜻·경계·관계가 둘 이상으로 읽힌다는 **의미의 불명확성**을 실제로 설명했는지 확인한다. (2) 뜻은 특정하면서 '일반적이지 않다', '그렇게 만들면 노출·간섭이 생긴다'는 **기술적 실현성**을 문제 삼는지 구분한다. (3) 기술적 장애가 있다면 무엇 때문에 통상의 기술자가 실시할 수 없는지, 발명의 설명이 그 해결 수단을 제공하지 않는다는 연결이 통지서에 있는지 본다. (4) 주장·증거·결론·법조항의 일치 정도를 판정한다.\n- **검출:** 폭의 대소관계를 통지서가 정확히 인용해 한 가지로 읽으면서 '일반적인 기술 사항이 아니다'라는 이유만으로 곧바로 불명확하다고 결론; 제조 불가능·작동 불능을 암시하면서 구체적인 실시 장애와 발명의 설명의 부족을 설명하지 않음. **법조항 적용 또는 논리 구성의 의문**으로 보고, 실시용이성 이유가 더 적합할 가능성을 제시한다.\n- **보류·예외:** 통지서에 정말로 복수 해석이나 경계 불명이 구체적으로 제시되면 명확성 이유도 성립 가능하다. 하나의 사실이 명확성과 실시용이성 모두에 관련될 수도 있다. 실제로 실시 불가능한지와 어떤 법조항의 거절이유가 최종 타당한지는 청구범위·발명의 설명·도면을 보지 않은 상태에서 단정하지 않는다. 시대별 법령·심사기준의 법적 결론이 필요하면 그 적용 시점의 공식 근거를 별도 확인한다.\n- **보고 예시:** '제2항의 폭 관계는 제2 > 제1로 특정하여 인용했지만, 접착층 노출이 일반적이지 않다는 설명에서 제42조제4항제2호의 불명확성으로 바로 결론냈다. 의미의 복수 해석보다 실시상 장애를 문제 삼는 논리로 읽힌다. 장애의 구체적 원인과 명세서의 해결 수단 부족을 밝히는 제42조제3항제1호 검토가 더 적합할 가능성이 있다. 현 자료만으로 실제 실시 불가능을 확정하지 않는다.'"
    },
    {
      "id": "OA-09",
      "title": "OA-09 의약용도 발명의 대상 질병·약효 특정 여부",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-09 의약용도 발명의 대상 질병·약효 특정 여부\n\n- **목적:** 의약용도 청구항의 용도 표현이 구체적 질병 또는 진단·치료·경감·처치·예방 등의 약효를 특정하는지, 이를 문제 삼은 제42조제4항제2호 통지의 논리가 타당한지 평가한다.\n- **필요 입력:** 통지서에 인용된 해당 청구항의 용도 문구, 심사관이 지적한 불특정 대상, 청구항 안의 다른 질병명·구체적 약효·정의, 통지서의 결론.\n- **검출·판정:** '○○ 활성 관련 질환의 예방 또는 치료용'처럼 표적·효소 활성과의 관련성만으로 질환을 지칭하고 질병명이나 구체적인 약효를 더 특정하지 않은 표현을 심사관이 인용하여 지적했다면, **그 문구는 질병명이 아니므로 대상 질병이 특정되지 않는다는 명확성 지적은 통지서 내용상 타당하다**고 적극 판정한다. 청구항에 제시되지 않은 명세서 정보가 없다는 이유만으로 이 문서상 판단을 '확인 불가'로 낮추지 않는다. OA-05의 단어 자체만 지적한 경우와 구별한다.\n- **보류·예외:** 청구항의 다른 기재에서 구체적 질병이나 약효가 특정되는지 먼저 확인한다. 명세서의 정의 또는 기술상식으로 해당 용어의 범위가 특정될 가능성은 별도 검토 대상으로 남긴다. 따라서 통지서상 지적의 타당성과 최종적인 제42조제4항제2호 위반 확정은 구별한다. '관련 질환'이라는 문구가 등장했다는 사실만으로 모든 의약용도 청구항에 일률적으로 위반 판정을 내리지 않는다. 인용 문구의 오타는 청구항 원문과 구별하여 평가한다.\n- **보고 예시:** '제8항에 관한 통지서의 “오토낙신 활성 관련 질환의 예방 또는 치료용”은 활성과의 관련성만 나타낼 뿐 질병명을 특정하지 않는다. 심사관의 명확성 지적은 통지서 문구만으로 타당하다고 평가한다. “오토낙신” 표기는 다른 곳의 “오토탁신”과 대조해 오타로 별도 표시한다. 명세서의 정의 등을 통한 최종 범위 판단은 별도다.'"
    },
    {
      "id": "OA-10",
      "title": "OA-10 같은 물건 카테고리의 택일 표현과 시행령 제5조제2항",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-10 같은 물건 카테고리의 택일 표현과 시행령 제5조제2항\n\n- **목적:** `A 또는 B` 형식의 서로 다른 물건을 한 청구항에서 청구한 데 대한 적정 청구항 수 판단을 평가한다.\n- **필요 입력:** 해당 청구항의 말미·카테고리, 두 선택 대상의 관계, 통지서의 제42조제8항·시행령 제5조제2항 이유.\n- **검토:** `전자 부품 또는 표시 장치`처럼 별개의 두 물건을 택일적으로 청구한 것이 명확하면, 심사 실무상 이를 두 발명이라고 간략히 지적한 것만으로 법조항 적용·논증 오류로 세지 않는다. 이 결론을 청구항 원문과 물건의 구별 없이 모든 `또는` 표현에 확대하지 않는다.\n- **보류·예외:** 두 선택지가 동일 물건의 명칭·하위 유형·동일 발명의 구성 대안인지에 따라 판단이 달라질 구체적 사정이 확인되면 그 차이를 검토한다. 다른 카테고리의 물건·방법을 혼재한 경우도 별도로 판단한다.\n- **보고 예시:** '제10항의 전자 부품 또는 표시 장치를 각각 별개의 물건으로 본 간략한 제5조제2항 이유는 실무상 수용 가능. 설명이 짧다는 이유만으로 오류를 부여하지 않음.'"
    },
    {
      "id": "OA-11",
      "title": "OA-11 `경화물`의 지시 대상은 청구항 체계로 확인",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-11 `경화물`의 지시 대상은 청구항 체계로 확인\n\n- **목적:** `경화물`이 무엇의 경화물인지 불명확하다는 제42조제4항제2호 거절이유가 문맥을 빠뜨렸는지 검토한다.\n- **필요 입력:** 지적된 청구항의 완전한 문구, 앞선 조성물·화합물의 관계, 관련 종속항의 `상기 ... 조성물의 경화물` 등 명시적 지시 문구.\n- **검토:** `경화성 엘라스토머 조성물`을 청구하면서 그 조성물의 경화 후 물성을 `경화물이 ...`로 한정하고, 종속항에서도 `조성물의 경화물`로 확인되는 경우에는 화합물 자체의 경화물이라는 대안 해석을 기계적으로 만들어 내지 않는다. 그 문맥을 무시하고 불명확하다고 통지했다면 **제42조제4항제2호 오지적, 진단코드 0521**로 판정한다.\n- **보류·예외:** 실제로 서로 다른 경화 대상이 청구항 안에서 병렬로 등장하고 종속항·명세서에도 해석이 갈리면 범위 불명확 가능성을 따로 평가한다. 종속항은 선행항 문구를 마음대로 재작성하는 근거가 아니라 문맥상 의미를 확인하는 자료다.\n- **보고 예시:** '제1·15항의 경화물은 경화성 엘라스토머 조성물의 경화물로 읽히고 관련 종속항도 이를 확인한다. 화합물의 경화물일 가능성만 제시한 명확성 이유는 오지적(0521).'"
    },
    {
      "id": "OA-12",
      "title": "OA-12 `임의로`의 선택적 구성 의미",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-12 `임의로`의 선택적 구성 의미\n\n- **목적:** 선택적 포함을 뜻하는 `임의로`를 표현 자체의 불명확성으로 지적한 이유를 검토한다. `바람직하게(는)`·`더 바람직하게(는)`·`특히`의 이중한정에는 이 규칙을 확대 적용하지 말고 OA-17을 우선 적용한다.\n- **필요 입력:** `임의로`가 수식하는 성분·구성, 해당 청구항의 문장 구조, 통지서가 제시한 실제 복수 해석.\n- **검토:** `임의로 (a2) 성분을 포함`은 (a2)가 필수가 아니며 포함할 수도 있다는 뜻이다. 이를 두고 '필수인지 아닌지 불명확하다'고만 하면 선택적 기재의 의미와 모순되므로 **제42조제4항제2호 오지적, 진단코드 0521**로 판정한다. `임의로`라는 단어만으로 기재불비를 추정하지 않는다.\n- **보류·예외:** 선택 여부가 아니라 수식 범위나 대안 구성 사이의 관계가 실제로 둘 이상으로 읽혀 보호범위가 달라진다면, 심사관의 구체적 설명을 확인하고 해당 쟁점을 별도로 평가한다.\n- **보고 예시:** '제4항의 임의로를 선택적 (a2) 구성으로 읽을 수 있는데 필수 여부가 불명확하다는 이유만 제시했다. 명확성 오지적(0521).'"
    },
    {
      "id": "OA-13",
      "title": "OA-13 인용발명의 `조합`·`결합`은 문맥으로 해석",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-13 인용발명의 `조합`·`결합`은 문맥으로 해석\n\n- **목적:** 용어 선택 자체와 실제 거절이유의 의미·논증을 구별한다.\n- **필요 입력:** 같은 통지서에서 `조합`·`결합`을 사용한 모든 문장, 청구항별 구성 대비, 각 문헌의 역할과 결론.\n- **검토:** `조합`이 문맥상 `결합`을 의미하면 결합으로 해석하고, 조합(combination)을 의미하면 그 의미대로 해석한다. 단어만으로 두 의미를 획일적으로 구분하거나 `조합`이라고 썼다는 이유로 오류를 부여하지 않는다. 각 사용 위치의 문맥과 실제 구성 대비를 확인한다.\n- **검출:** 통지서 내에서 `조합`의 의미가 혼용되어 논증이나 적용 문헌의 관계가 일관되지 않거나, 문맥상 어떤 의미인지 파악할 수 없으면 의견제출통지서 작성 문제로 판단한다. 단순히 서로 다른 문맥에서 사용했다는 사실만으로 문제 삼지 말고, 의미가 혼용된 위치와 그로 인한 해석 장애를 제시한다.\n- **보류·예외:** 표현은 달라도 각 문헌의 역할과 판단 경로가 문맥상 명확하면 용어 문제는 발견 없음으로 처리한다. 의미를 결합으로 읽을 수 있더라도 구성 대비·차이점·용이도출 근거가 부족한지는 OA-06으로 별도 평가한다. 용어를 정합적으로 해석했다는 이유로 논증 부족까지 해소된 것으로 보지 않는다.\n- **보고 예시:** '“인용발명 1~4의 조합”은 문맥상 결합을 뜻하므로 표현 자체의 오류로 보지 않는다. 다만 어느 문헌이 어떤 구성 차이를 보충하는지 설명되지 않은 점은 별도의 구성대비 미흡으로 평가한다.' / '같은 이유에서 조합의 의미가 혼용되고 문맥으로도 문헌의 관계를 특정할 수 없어 거절이유가 불명료하다.'\n- **진단코드:** 의미 불명으로 거절이유가 불명료하면 `1222`, 경미한 표현상의 문제는 `1231`의 조건을 확인한다. 구성 대비 미흡은 `1225` 등 해당 유형으로 별도 판단하되 동일 하자를 중복 집계하지 않는다.\n\n### 사용자 확인 사례 — 1020210074532 (2026-09-30)\n\n제22·23항의 치환기·개별 화합물 한정을 통상의 창작능력과 효과의 예측가능성만으로 일괄 처리하여 구성대비가 미흡하다는 판단에 사용자가 동의했다. 이 사례의 핵심은 용어 `조합` 자체가 아니라 구체적인 구조 차이와 용이도출 근거의 설명 부족이다. `1225` 판단의 참고 사례로 사용하되, 실제 진보성 오판이나 다른 사건의 동일 코드 적용을 자동 확정하지 않는다. 통지 당시 청구범위 복원 및 인용문헌 전수 대조의 확보 범위도 별도로 확인한다."
    },
    {
      "id": "OA-14",
      "title": "OA-14 통지서 자체로 명백한 단순오기와 원문 확인이 필요한 오기",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-14 통지서 자체로 명백한 단순오기와 원문 확인이 필요한 오기\n\n- **목적:** 오기 자체를 일률적으로 진단하지 말고, 출원인이 정확한 거절이유를 이해하기 위해 인용발명을 추가로 읽어야 하는지를 구별한다.\n- **필요 입력:** 통지서의 문제 문구·표·앞뒤 문맥, 인용 위치와 인용 문구, 필요한 경우 인용발명 원문의 해당 식별번호·수치범위. 뒤의 결정서에서 정정된 내용은 최초 통지서 자체의 정보와 구분한다.\n- **검토 순서:** (1) 인용발명이나 후속 결정서를 보지 않고 통지서만으로 오기와 올바른 의미를 명백히 알 수 있는지 먼저 판단한다. (2) 내부 모순을 발견하는 것과 올바른 수치·식별번호를 복원하는 것을 구별한다. (3) 통지서만으로 정정할 수 없으면 인용발명 원문에서 구성의 위치와 정확한 수치를 대조한다. (4) 실제 오기를 확인한 경우 `references/diagnostic-codes.md`의 `1231` 운영 기준을 적용하고, 실체 판단·대비 부족과는 별도로 그 영향을 평가한다.\n- **검출:** 통지서가 적은 식별번호에서 해당 구성을 찾을 수 없어 원문의 다른 부분을 찾아야 하는 경우; 수치범위가 원문과 달라 인용발명을 읽어야 정확한 범위와 중복 여부를 알 수 있는 경우. 경미한 인용·기재 오류로 확인되면 고객지향성 하자로 `1231`을 부여한다.\n- **보류·예외:** 통지서만으로 올바른 내용을 명백히 알 수 있는 단순오기는 코드와 진단 집계에서 제외한다. 단위·식별번호·숫자라는 형식만으로 제외하거나 부여하지 않는다. 원문 미확보 시에는 오기를 확정하지 않는다. 사실판단 오류 또는 거절이유의 실질적 불명료·대비 부족은 해당 규칙과 코드로 따로 평가하되 동일 하자를 중복 집계하지 않는다.\n- **보고 예시:** '표와 문맥에서 300 nm임이 명백한 본문의 300 m는 단순오기이므로 진단 제외.' / '통지서의 0.01~1.0 μm는 청구범위 1.5~4.0 μm와 겹치지 않지만, 이것만으로 올바른 상한은 알 수 없다. 인용발명 [0064]의 0.01~10 μm를 확인해야 정정되므로 1231.' / '통지서의 [0059]와 달리 유기입자의 해당 구성은 인용발명 [0045]에 있어 원문 재확인이 필요하므로 1231.'\n\n### 사용자 확인 사례 — 1020210050016 (2026-10-11)\n\n통지서 2·5쪽의 `300 m`는 통지서의 표와 문맥에서 `300 nm`의 오기임을 알 수 있으므로 `1231` 대상에서 제외한다. 통지서 3쪽 이유 1-2의 `0.01~1.0 μm`는 인용발명 [0064]의 `0.01~10 μm`를 읽어야 정정할 수 있고, 제7항의 식별번호 [0059] 역시 해당 구성이 있는 [0045]를 원문에서 찾아야 하므로 `1231`을 부여한다. 이 사례의 판단축은 오류의 크기나 단위가 아니라 **통지서만으로 정정할 수 있는지 및 원문 재확인 부담**이다."
    },
    {
      "id": "OA-15",
      "title": "OA-15 최후통지의 거절이유가 보정으로 발생했는지",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-15 최후통지의 거절이유가 보정으로 발생했는지\n\n- **목적:** 최초부터 존재한 거절이유를 뒤늦게 발견하여 최후로 통지하는 오류를 검출한다. 최후통지의 표제나 정형문구를 적정성의 근거로 삼지 말고 보정과 거절이유 사이의 인과관계를 확인한다.\n- **필요 입력:** 모든 선행·최후통지의 원문과 이유별 청구항·법조항·실제 인용문헌·조합·핵심 논리, 각 통지 직전 청구범위와 인용관계, 그 사이의 보정 접수일·번호 및 추가·삭제·수정 내용, 필요한 발명의 설명·도면·인용문헌. 청구항 번호가 바뀌었으면 문언과 계승관계로 대응시킨다.\n- **검토 순서:** (1) 최후통지의 이유를 독립된 쟁점별로 나눈다. (2) 최초통지 당시 판본과 최후통지 직전 판본을 복원하고 실제 변경 구성을 표시한다. (3) 해당 이유가 보정 전 전체 청구항에도 동일한 사실·논리로 성립했는지 대조한다. (4) 추가·삭제·관계 변경 중 무엇 때문에 그 이유가 비로소 발생했는지 구체적으로 설명한다. (5) 이유별로 `보정에 따른 발생 / 보정 전부터 존재 / 확인 불가`를 판정한다. 최후통지에 두 종류의 이유가 섞여 있으면 이유별 판정과 통지 전체의 최후 지정 적정성을 구분한다. 적용 시점의 특허법 제47조제1항제1·2호 및 심사기준을 공식 출처로 확인한다.\n- **검출:** 변경되지 않은 구성의 기재불비·형식 하자를 최후에서 처음 지적; 보정 전 전체 발명에도 성립하는 신규성·진보성 이유를 새 문헌이나 새 결합 논리로 뒤늦게 통지; 단순한 용어 정리·항 번호 변경을 새 거절이유의 발생 원인으로 삼음. 소재·구성을 한정했다는 이유만으로 최후통지의 적정성을 인정하지 않는다.\n- **보류·예외:** 구성 삭제·추가·관계 변경으로 이전에는 성립하지 않던 이유가 실제 발생할 수 있다. 삭제가 있다는 사실만으로 최후통지를 정당화하지 말고, 삭제된 한정과 해당 이유의 인과관계를 확인한다. 종속항의 부가구성이 그대로라도 인용항 보정에 따라 전체 발명이 변했는지 확인한다. 발명의 설명에 원래 기재된 사항이라는 사실과 보정 전 청구범위에 대한 거절이유의 존재를 혼동하지 않는다. 필요한 판본·증거가 없으면 누락 정보와 가능한 해석을 적되, 확인된 기존 하자를 막연한 보정 가능성만으로 보류하지 않는다. 보정 후 발견됐다는 사실만으로 보정에 따라 발생했다고 하지 않는다.\n- **보고:** `최후통지 일자·쪽수·이유 / 대응하는 보정 전후 청구항·문구 / 실제 변경 / 거절이유와 변경의 인과관계 / 판정 / 진단코드 / 추가 필요 자료`를 제시한다. 최초부터 존재한 이유를 최후로 통지한 것이 확인되면 `1024`를 부여한다. 일괄 통지 가능했던 이유를 나누어 통지했는지는 `1031`과 정당한 사유를 별도 확인하고 동일 하자를 자동 중복 집계하지 않는다. 근거가 부족하면 확정 코드를 부여하지 않는다. 사후 등록됐다는 사실로 앞선 최후 지정 오류를 없던 것으로 처리하지 않는다.\n- **보고 예시:** '최후통지에서 지적한 제3항의 인용번호 오류는 최초통지 당시 원문에도 동일하며 중간 보정으로 발생하지 않았다. 최초·최후 혼동으로 1024.' / '보정으로 삭제된 작동 한정이 새 진보성 이유의 성립에 영향을 주는지 확인할 자료가 부족하다. 보정 전부터 존재 여부는 확인 불가이며 1024 확정 보류.'"
    },
    {
      "id": "OA-16",
      "title": "OA-16 청구대상(말미)의 용도 기재",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-16 청구대상(말미)의 용도 기재\n\n청구대상(말미)이 ‘용도’ 등으로 기재되어 있는지 확인한다. 한국 실무상 청구대상을 ‘용도’로 기재한 경우에는 특허법 제42조제4항제2호의 기재불비를 검토한다.\n\n‘○○ 치료용 조성물’처럼 용도가 한정된 **물건을 청구하는 의약용도발명**과 구별한다. 청구항 본문에 용도를 설명하는 표현이 있다는 이유만으로 기재불비로 판단하지 않는다."
    },
    {
      "id": "OA-17",
      "title": "OA-17 `바람직하게`·`특히`의 이중한정과 명확성",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "## OA-17 `바람직하게`·`특히`의 이중한정과 명확성\n\n- **목적:** 청구범위에서 선호·강조 표현으로 넓은 구성과 좁은 구성을 연결하여 한정의 효력 및 보호범위가 불명확해지는 문제를 엄격히 점검한다. 발명의 설명에서 바람직한 실시형태를 설명하는 경우와 구별한다.\n- **필요 입력:** 통지 당시 청구항 전문·인용항, 표현 전후의 구성·수치·서열, 관련 발명의 설명, 통지의 명확성 이유 및 보정 후 판본.\n- **검출·판정:** `바람직하게`, `바람직하게는`, `더/더욱 바람직하게(는)`, `특히` 등으로 연결된 한정을 전수 확인한다. 넓은 구성 전체가 청구대상인지 선호·강조된 좁은 구성으로 제한되는지 구별되지 않으면 특허법 제42조제4항제2호의 중요한 기재불비로 판단한다. 효과가 더 우수한 구성이라는 취지로도 해석될 수 있는 선호·강조를 단순한 비한정적 예시라고 임의로 처리하지 않는다. 그러한 불명확성을 지적한 통지를 OA-05·OA-12의 선택적 표현 오지적(`0521`)으로 분류하지 않는다.\n- **운영 기준:** 사용자 평가관이 2026-10-14 확인한 기준에 따라, 이러한 표현은 청구범위에 남지 않도록 명확한 구성 한정 또는 별도 종속항으로 정리할 대상으로 취급한다. 등록·특허결정 후에도 RC-07로 잔존 여부를 반드시 점검한다.\n- **보류·예외:** 발명의 설명·도면 설명에만 있는 표현은 이 규칙의 청구범위 하자가 아니다. 단어만으로 법적 위반을 일률적으로 확정하지 말고 표현 전후의 두 한정과 해석 장애를 기록한다. `특이적으로 결합`은 `특히`와 다른 기술용어이므로 혼동하지 않는다. 당시 판본 미확보 시 확인 불가로 남긴다.\n- **보고 예시:** '제1항의 “서열 A를 포함하고, 바람직하게는 이것으로 이루어진”은 포함 범위와 폐쇄적 범위 중 어느 것이 보호범위인지 이중한정 문제를 일으킨다. 이 문제를 지적한 명확성 통지는 타당하며, 단순 선택적 기재라는 이유로 0521을 부여하지 않는다.'\n- **근거:** 대법원 2017.4.7. 선고 2014후1563 판결(국가법령정보센터 https://www.law.go.kr/LSW/precInfoP.do?precSeq=184701). 넓은 기와 선호된 좁은 기 사이의 이중한정으로 복수 해석이 가능한 청구항을 불명확하다고 판단하고, 심사 중 보정하여 보호범위에 의문이 없는 상태에서 등록할 것을 강조했다. 판결의 일반 법리는 문맥·설명·기술상식을 고려한 개별 판단이며 모든 단어의 절대 금지를 선언한 것은 아니다. `특히` 및 효과상 우수성의 해석에 관한 위 운영 기준은 사용자 확인 기준으로 구별하고, 판결에 직접 판시된 내용이라고 인용하지 않는다."
    },
    {
      "id": "OA-overview",
      "title": "OA 규칙 전체 안내",
      "source": "references/office-action-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/office-action-rules.md",
      "text": "# 의견제출통지서 내부 진단 규칙\n\n각 규칙에서 쪽수와 원문 일부를 양쪽 모두 기록한다. 청구항 집합, 법조문 및 인용발명 조합은 **같은 거절이유 단위**에서 비교한다. '제1항 및 이를 인용하는 항'처럼 간접 지정된 범위는 별도 표시한다. 추출 오류가 의심되면 페이지 이미지를 확인한다."
    },
    {
      "id": "RC-01",
      "title": "RC-01 종속관계와 인용항 식별 — 시행령 제5조제1항·제4항·제7항",
      "source": "references/registered-claim-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/registered-claim-rules.md",
      "text": "## RC-01 종속관계와 인용항 식별 — 시행령 제5조제1항·제4항·제7항\n\n- **목적:** 종속항의 인용 번호, 선행 기재, 인용된 발명과 한정·부가 관계를 점검한다.\n- **필요 입력:** 청구항별 번호·인용 문구·인용 대상의 카테고리와 필수 구성.\n- **검출:** 존재하지 않거나 후행하는 항 인용; 인용항의 내용을 배제·반전해 종속관계가 실질적으로 불분명한 경우. 후자는 제42조제4항제2호도 검토한다.\n- **보류·예외:** 단일 인용 종속항의 다른 실시형태나 다른 작동 상태는 곧바로 모순이 아니다. 발명의 설명에서 관계가 특정되는지 필요하면 조건부 점검.\n- **보고 예시:** '제8항은 존재하지 않는 제15항을 인용하여 시행령 제5조제4항·제7항의 기재방법 의문.'"
    },
    {
      "id": "RC-02",
      "title": "RC-02 다중 인용의 택일성과 중첩 — 시행령 제5조제5항·제6항",
      "source": "references/registered-claim-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/registered-claim-rules.md",
      "text": "## RC-02 다중 인용의 택일성과 중첩 — 시행령 제5조제5항·제6항\n\n- **목적:** 2개 이상 항의 직접·간접 인용 경로를 전수 펼친다.\n- **필요 입력:** 각 항의 직접 인용 집합과 재귀 인용 경로.\n- **검출:** 다중 인용을 누적적으로 적음; 다중 인용 항이 다른 다중 인용 항을 직접 또는 단일항을 거쳐 간접 인용함.\n- **보류·예외:** 모두 단일 인용이면 제5·6항 위반 발견 없음. 별개 실시형태를 문장에 병렬 기재한 것만으로 다중 인용이라 하지 않는다.\n- **보고 예시:** '제9항이 제3항 또는 제4항을 인용하고, 제4항이 제1항 또는 제2항을 인용해 제5조제6항의 간접 중첩에 해당.'"
    },
    {
      "id": "RC-03",
      "title": "RC-03 항 번호·독립항·기재 단위 — 시행령 제5조제1항·제2항·제8항",
      "source": "references/registered-claim-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/registered-claim-rules.md",
      "text": "## RC-03 항 번호·독립항·기재 단위 — 시행령 제5조제1항·제2항·제8항\n\n청구대상(말미)의 ‘용도’ 기재는 `office-action-rules.md`의 OA-16을 함께 적용한다.\n\n- **목적:** 독립항 존재, 항별 번호·순서·구분과 한 항 안의 서로 다른 발명 카테고리 혼재를 확인한다.\n- **필요 입력:** 등록 원문의 행·번호·말미 카테고리; 상세정보 표에서 행 형식이 변환되었으면 공고전문.\n- **검출:** 독립항 없음, 항 번호의 중복·누락, 한 항에서 별개의 장치와 방법을 동시에 청구하는 등 실질적인 기재 단위 의문.\n- **보류·예외:** 제5조제2항의 적정 청구항 수는 단순 개수만으로 위반을 단정할 수 없다. 상세정보 UI의 줄바꿈만으로 제8항 원문 형식을 판단하지 않는다.\n- **보고 예시:** '상세정보에는 번호가 보이나 공고전문 확인 전 항별 줄바꿈 위반은 판정 불가.'"
    },
    {
      "id": "RC-04",
      "title": "RC-04 선행기재·용어·대상·범위 — 특허법 제42조제4항제2호",
      "source": "references/registered-claim-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/registered-claim-rules.md",
      "text": "## RC-04 선행기재·용어·대상·범위 — 특허법 제42조제4항제2호\n\n- **목적:** '상기' 구성의 선행 근거, 동일 명칭의 대상, 수량·위치·관계가 한 가지 기술적 의미로 읽히는지 점검한다.\n- **필요 입력:** 해당항과 인용항의 전체 문맥, 가능하면 발명의 설명과 도면.\n- **검출:** 실체가 정의되지 않은 구성의 돌연 등장, 같은 용어의 상충된 대상, 누가 어디에 결합하는지에 따라 보호범위가 달라지는 복수 해석.\n- **보류·예외:** 통상의 기술자가 청구항 문맥으로 대상을 특정할 수 있으면 표현만으로 위반이라 하지 않는다. 도면·설명 확인이 필요하면 조건부 점검으로 남긴다.\n- **보고 예시:** '제12항의 부재 양단 중 어느 단부가 고정되는지 문장상 둘로 읽힐 수 있어 도면의 결합관계 확인 필요.'"
    },
    {
      "id": "RC-05",
      "title": "RC-05 작동·기능 한정의 내부 정합성 — 특허법 제42조제4항제2호",
      "source": "references/registered-claim-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/registered-claim-rules.md",
      "text": "## RC-05 작동·기능 한정의 내부 정합성 — 특허법 제42조제4항제2호\n\n- **목적:** 같은 상태·방향·수단에 관해 양립하지 않는 작동이나 결과가 기재되어 보호범위가 달라지는지 점검한다.\n- **필요 입력:** 해당항과 인용항의 작동 조건·방향·단계·결과, 도면이 있으면 그 설명.\n- **검출:** 동일 조건에서 같은 부재가 동시에 반대 방향으로만 움직여야 하는 내부 모순, 기능의 대상 또는 구별되는 수단이 특정되지 않아 복수 해석이 생김.\n- **보류·예외:** 서로 다른 단계·상태, 탄성 개방과 강제 개방처럼 다른 수단은 공존 가능. 실시 가능성이나 명세서 뒷받침 문제를 명확성과 혼동하지 않는다.\n- **보고 예시:** '제1항의 두 개폐 수단은 별도 작동으로 읽히므로 명확성 위반이라고 단정할 수 없고, 설명·도면에서 관계 확인.'"
    },
    {
      "id": "RC-06",
      "title": "RC-06 표현의 간결성·문법과 실질적 불명확성 구별 — 특허법 제42조제4항제2호",
      "source": "references/registered-claim-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/registered-claim-rules.md",
      "text": "## RC-06 표현의 간결성·문법과 실질적 불명확성 구별 — 특허법 제42조제4항제2호\n\n- **목적:** 반복·오탈자·부자연스러운 조사와 보호범위 불명확을 구분한다.\n- **필요 입력:** 문제 표현의 앞뒤 문맥 및 해석에 미치는 실제 영향.\n- **검출:** 단순히 문장이 길다는 인상이 아니라 중복 한정이 상충하거나 두 개의 보호범위를 낳는 경우.\n- **보류·예외:** '표시되도록 하는' 같은 조사 오류나 같은 용어 반복만으로 위반을 선언하지 않는다. 필요하면 편집 의견으로 분리한다.\n- **보고 예시:** '제14항의 조사 표현은 매끄럽지 않지만 표시 대상과 카운터는 특정되어 단독으로 위반을 확인할 수 없음.'"
    },
    {
      "id": "RC-07",
      "title": "RC-07 등록청구항의 `바람직하게`·`특히` 잔존 — 특허법 제42조제4항제2호",
      "source": "references/registered-claim-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/registered-claim-rules.md",
      "text": "## RC-07 등록청구항의 `바람직하게`·`특히` 잔존 — 특허법 제42조제4항제2호\n\n- **목적:** 특허결정·등록 청구범위에 선호·강조에 따른 이중한정이 남은 것을 놓치지 않는다. OA-17의 판례 근거와 사용자 확인 운영 기준을 함께 적용한다.\n- **필요 입력:** 특허결정 당시 최종 청구항 또는 등록공보의 유효 청구항 전부, 관련 인용항·발명의 설명, 통지와 보정 내역.\n- **검출·판정:** `바람직하게(는)`·`더/더욱 바람직하게(는)`·`특히`의 모든 위치와 전후 한정을 기록한다. 청구범위에서 제거·명확화되어야 할 중요한 점검 사항으로 취급한다. 넓은 구성과 좁은 구성 중 어느 것이 한정인지 불명확하거나 우수한 효과를 나타내는 구성이라는 해석과 범위 한정의 해석이 갈리는 상태로 특허결정되었다면 청구범위 기재요건 미지적 `0511`을 부여한다. 단순 문체·경미한 편집 문제로 낮추거나 코드 표시를 누락하지 않는다.\n- **보류·예외:** 발명의 설명에만 있는 표현, 삭제된 청구항의 표현은 현재 등록청구항 하자로 집계하지 않는다. 단어 발견과 법적 위반 확정은 구별하되, 판본과 해석 장애가 확인되면 막연한 문맥 가능성만으로 보류하지 않는다. 당시 통지의 적정성과 최종 등록청구항의 잔존 하자를 분리하고, 동일 하자를 중복 집계하지 않는다.\n- **보고 예시:** '등록 제4항에 “A, 특히 B”가 남아 A 전체와 B 중 보호범위가 불명확하다. 제42조제4항제2호 위반 상태로 특허결정한 것으로 0511. 발명의 설명에만 있는 동일 표현은 집계 제외.'"
    },
    {
      "id": "RC-overview",
      "title": "RC 규칙 전체 안내",
      "source": "references/registered-claim-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/registered-claim-rules.md",
      "text": "# 등록청구항 기재 점검 규칙\n\n등록된 청구항 전부를 읽고 청구항 번호·문언·인용관계를 기록한다. 적용 시점의 특허법 제42조제4항제2호·제8항과 특허법 시행령 제5조 원문을 공식 법령 사이트에서 확인한다. 단순한 오탈자나 자연스럽지 않은 문장은 청구범위에 복수의 실질적 해석을 만들거나 법정 형식을 깨뜨리는지 먼저 검토한다. 발명의 설명·도면을 읽지 않았다면 그 자료가 필요한 판단을 확정하지 않는다. 결과적 등록은 무오류의 증거가 아니다."
    },
    {
      "id": "RD-01",
      "title": "RD-01 법조문·거절이유 종류의 신규성",
      "source": "references/rejection-decision-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/rejection-decision-rules.md",
      "text": "## RD-01 법조문·거절이유 종류의 신규성\n\n- **목적:** 결정에 사용한 법조문과 법적 이유가 앞선 어느 통지에도 없었는지 살핀다.\n- **필요 입력:** 결정의 법조문·대상항·핵심 쟁점과 선행 통지 전부의 법조문·대상항·쟁점.\n- **검출:** 통지되지 않은 법조문이나 독립된 거절사유를 결정의 근거로 새로 사용함. 같은 법조문이어도 전혀 다른 요건·쟁점을 근거로 삼은 경우에는 RD-03과 함께 검토한다.\n- **보류·예외:** 단순 인용 정정·용어 변경; 통지된 이유의 범위 안에서의 상세화. 청구항이 보정되어 번호·대상이 바뀐 정황만 있고 보정서가 없으면 조건부 점검.\n- **보고 예시:** '선행 통지는 제29조제2항만 다뤘는데 결정은 제42조제4항제2호를 독립 근거로 사용.'"
    },
    {
      "id": "RD-02",
      "title": "RD-02 인용문헌·조합·대상 청구항의 변화",
      "source": "references/rejection-decision-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/rejection-decision-rules.md",
      "text": "## RD-02 인용문헌·조합·대상 청구항의 변화\n\n- **목적:** 결정에서 인용문헌이나 조합이 바뀌어 출원인이 새로 대응해야 하는 대비가 생겼는지 살핀다.\n- **필요 입력:** 이유별 청구항과 선행 통지·결정의 인용문헌 번호(실제 문헌 식별자 포함), 조합 및 각 문헌의 역할.\n- **검출:** 새 인용문헌 추가, 1 단독에서 1+2 결합으로 변경, 1+2에서 1+3으로 변경, 기존 통지에 해당 청구항에 대한 이유가 없는데 결정에 추가.\n- **보류·예외:** 문헌 번호만 재배열되고 실제 문헌·역할은 동일; 앞선 **다른** 통지에서 동일 청구항·조합을 이미 알린 경우; 보정으로 청구항 번호가 달라진 가능성이 있는데 대응표가 없으면 조건부 점검. PBP형 물건항의 결과물 중심 단독 문헌 판단은 OA-07을 참조한다.\n- **보고 예시:** '결정의 제8항은 인용발명 1+3인데 이전 통지들은 해당항을 1+2로만 대비.'"
    },
    {
      "id": "RD-03",
      "title": "RD-03 불리한 핵심 사실·논리의 변화",
      "source": "references/rejection-decision-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/rejection-decision-rules.md",
      "text": "## RD-03 불리한 핵심 사실·논리의 변화\n\n- **목적:** 법조문과 문헌이 같아도 결정에서 새로운 핵심 사실·차이점·결합 논리가 최초 제시되었는지 검토한다.\n- **필요 입력:** 선행 통지의 구성 대비·차이점·동기·효과 판단과 결정의 해당 논증.\n- **검출:** 통지는 A 구성의 동일성만 이유로 들었는데 결정은 처음으로 B 구성을 다른 문헌에서 가져와 결합함; 기존에 인정하지 않았던 기술적 사실이나 별개의 해석을 결정적 근거로 처음 사용.\n- **보류·예외:** 통지된 핵심 쟁점의 상세화, 동일 논거의 예시·인용 위치 보충은 새로운 이유로 보지 않는다. 출원인 의견서가 없으면 그 **주장 내용이나 반박 여부만** 추정하지 않는다. 통지서와 결정서에서 별개의 핵심 사실·논리가 직접 확인되면 문서상 차이를 판정하고, 보정에 따라 새로운 쟁점이 생겼을 가능성이 실제로 판정을 가를 때에만 그 부분을 조건부 점검한다.\n- **보고 예시:** '같은 제29조제2항·문헌 1이지만 결정에서 처음으로 특정 작용효과가 주지라고 전제하여 차이점을 해소.'"
    },
    {
      "id": "RD-04",
      "title": "RD-04 거절결정 내부의 근거 연결",
      "source": "references/rejection-decision-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/rejection-decision-rules.md",
      "text": "## RD-04 거절결정 내부의 근거 연결\n\n- **목적:** 결정의 주문·이유·결론이 대상 청구항과 법조문, 인용문헌에 관해 서로 맞는지 확인한다.\n- **필요 입력:** 결정의 주문 표, 세부 이유, 결론, 인용문헌 식별자.\n- **검출:** 주문에는 제1~3항인데 이유가 제4항만 설명; 본문 1+2 대비 뒤 결론은 1+3; 정의되지 않은 문헌 번호.\n- **보류·예외:** 공통 이유의 명시적 일괄 적용, 명백한 오타는 그 수준으로 보고. 선행 통지와의 비교 결과와 구별하여 '결정 내부 불일치'라고 표시한다.\n- **보고 예시:** '결정 주문은 제7항 제29조제2항인데 이유 본문은 제8항만 분석.'"
    },
    {
      "id": "RD-05",
      "title": "RD-05 누적 통지·최후통지의 포괄 확인",
      "source": "references/rejection-decision-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/rejection-decision-rules.md",
      "text": "## RD-05 누적 통지·최후통지의 포괄 확인\n\n- **목적:** 첫 의견제출통지만 대조해 이미 나중에 통지된 이유를 새로운 이유로 잘못 표시하는 일을 막는다.\n- **필요 입력:** 날짜별 모든 의견제출통지서, 최후통지, 결정의 이유별 대조표.\n- **검출:** 각 결정 이유에 대해 어떤 선행 통지에서도 대응 근거를 찾지 못함; 발견 시 RD-01~03의 구체적 차이로 보고한다.\n- **보류·예외:** 통지서 한 건이라도 다운로드 실패·누락되었으면 '선행 통지 전부에 없음'이라고 결론 내리지 않고 확인 불가. 통지 이후 보정에 의한 변화 가능성을 별도 표시한다.\n- **보고 예시:** '1차 통지에는 없지만 최후통지 2쪽에 같은 청구항·문헌 조합이 있어 새로운 이유로 분류하지 않음.'"
    },
    {
      "id": "RD-06",
      "title": "RD-06 출원인 주장 검토 누락의 증거 요건",
      "source": "references/rejection-decision-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/rejection-decision-rules.md",
      "text": "## RD-06 출원인 주장 검토 누락의 증거 요건\n\n- **목적:** 거절결정서가 출원인의 핵심 주장을 다루지 않아 최종결정에 명백히 영향을 미쳤는지 별도로 판단한다.\n- **필요 입력:** 출원인의 주장 원문 또는 결정서에 특정된 주장 내용, 관련 거절결정의 판단 부분. 보정사항의 검토 누락은 보정 전후 청구항과 결정 내용을 대조한다.\n- **검출:** 확인된 핵심 주장·보정사항에 대한 검토가 결정서에 없고 최종결정에 대한 영향이 명백하면 진단코드 `1311`을 검토한다. 영향 요건이 확인되지 않더라도 문서상 심사기준 불부합이 있으면 `1321`의 요건을 별도로 검토한다.\n- **보류·예외:** 출원인의 실제 주장을 확인할 자료가 없으면 그 주장에 대한 검토 누락을 만들어 내지 않는다. 이 경우 RD-01~05로 판정 가능한 통지·결정 사이의 차이는 계속 보고한다. 결정서에 주장이 요약되어 있더라도 그 요약만으로 출원인이 제시한 다른 주장이 없었다고 단정하지 않는다.\n- **보고 예시:** '출원인이 제출한 의견서 2쪽의 차이점 주장은 확인되나 결정서가 이를 검토하지 않고 반대 사실을 전제로 거절결정함. 최종결정 영향은 별도 설명.'"
    },
    {
      "id": "RD-overview",
      "title": "RD 규칙 전체 안내",
      "source": "references/rejection-decision-rules.md",
      "url": "https://github.com/EQAI-MOIP/AI_Reviewer/blob/4d078c8256953de164d8b13196502440c0fc30d0/rules/references/rejection-decision-rules.md",
      "text": "# 거절결정서와 선행 통지 대조 규칙\n\n거절결정일 **이전**에 발송된 모든 의견제출통지서(최후 포함)를 시간순으로 대조한다. 같은 법조문이라는 이유만으로 같은 거절이유라고 판정하지 않는다. 반대로 표현이나 상세 설명이 달라졌다는 이유만으로 새로운 이유라고 판정하지 않는다. 각 발견에 거절결정서와 가장 관련 있는 선행 통지의 문서 식별자·쪽수·원문 위치를 적는다. 보정서·의견서가 분석 범위에 없으면 그 효과를 가정하지 않는다. 의견서가 없어도 통지·결정 원문으로 확인 가능한 새 이유, 문헌 조합, 대상항과 내부 모순은 판정한다. 의견서 부재만으로 RD 전체를 보류하거나 일률적인 원문 미확보 문구를 덧붙이지 않는다."
    }
  ],
  "counts": {
    "categories": 8,
    "items": 66,
    "codes": 84,
    "OA": 17,
    "RD": 6,
    "RC": 7
  }
};
})(typeof window !== 'undefined' ? window : globalThis);

