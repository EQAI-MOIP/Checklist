export const VERSION = '2026-Q3.v1';
export const decisions = { refusal: '거절결정', registration: '등록결정' };
export const perspectives = {
  process: '절차의 효율성', interpretation: '명세서 해석의 정확성', search: '검색의 적절성',
  refusalNotice: '거절결정서 기재 적정성', applicant: '출원인 수용가능성', notice: '의견제출통지서 기재 적정성'
};
export const weights = {
  refusal: { process: 2, interpretation: 6, search: 12, refusalNotice: 4, notice: 6 },
  registration: { process: 4, interpretation: 6, search: 8, applicant: 6, notice: 6 }
};
export const grades = ['상', '중상', '중', '중하', '하', '주의', '부적합'];
export const sourceGrade = { 주의: '비교적 중요한 하자', 부적합: '결론 변경 필요한 하자' };
export const states = { draft: '작성중', discussion: '협의중', final: '확정', reopened: '수정중', archived: '보관' };
export const codeStates = { assigned: '부여', candidate: '후보', withdrawn: '철회' };
const factors = { 상: 3, 중상: 2.5, 중: 2, 중하: 1.5, 하: 1, 주의: 1, 부적합: 1 };
const deductions = { 주의: 15, 부적합: 30 };
const buckets = ['부적합', '주의', '하자'];

export function allowedGrades(key) {
  const exceptions = { process: ['중하'], interpretation: ['중상', '중하'] };
  return grades.filter((grade) => !exceptions[key]?.includes(grade));
}
export function normalizeNumber(value) {
  if (typeof value !== 'string') return null;
  const input = value.trim();
  return /^(\d{13}|\d{2}-\d{4}-\d{7})$/.test(input) ? input.replaceAll('-', '') : null;
}
export function displayNumber(value) {
  const clean = normalizeNumber(value);
  return clean ? clean.replace(/^(\d{2})(\d{4})(\d{7})$/, '$1-$2-$3') : value;
}
export function nowPeriod(date = new Date()) {
  const [year, month] = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit' }).format(date).split('-');
  return year + '-Q' + Math.ceil(Number(month) / 3);
}
export function normalizeGrade(value) {
  const input = String(value ?? '').trim();
  return Object.keys(sourceGrade).find((key) => sourceGrade[key] === input) ?? input;
}
export function classify(code) {
  if (typeof code !== 'string' || !/^\d{4}$/.test(code)) return null;
  return code[2] === '1' ? '부적합' : code[2] === '2' ? '주의' : '하자';
}
export function blank() {
  return { number: '', type: 'refusal', period: nowPeriod(), round: 1, group: 'default', assignee: '', bonus: 0, bonusReason: '',
    scores: {}, codes: [], reviewed: false, reviewReason: '', changeReason: '', extra: [], importStatus: '' };
}
export function evaluate(input) {
  const parts = Object.entries(weights[input.type] ?? {}).map(([key, weight]) => {
    const grade = input.scores?.[key]?.grade ?? '';
    const valid = allowedGrades(key).includes(grade);
    return { key, weight, grade, score: valid ? factors[grade] * weight - (deductions[grade] ?? 0) : null };
  });
  const completed = parts.filter((part) => part.score !== null).length;
  const bonusValid = Number.isInteger(input.bonus) && input.bonus >= 0 && input.bonus <= 10;
  const total = completed === 5 && bonusValid ? parts.reduce((sum, part) => sum + part.score, input.bonus) : null;
  const assigned = (input.codes ?? []).filter((item) => item.status === 'assigned' && classify(item.code));
  const present = new Set(assigned.map((item) => classify(item.code)));
  const representative = buckets.find((item) => present.has(item)) ?? (input.reviewed ? '검토 후 코드 없음' : '미검토');
  const linked = new Map();
  for (const item of assigned) {
    const category = classify(item.code);
    if (!linked.has(item.perspective)) linked.set(item.perspective, new Set());
    linked.get(item.perspective).add(category);
  }
  const warnings = [];
  if (assigned.some((item) => !item.perspective)) warnings.push('관점 미연결 코드가 있습니다.');
  for (const { key, grade } of parts) {
    const gradeClass = buckets.includes(grade) ? grade : null;
    const codeClass = buckets.find((category) => linked.get(key)?.has(category));
    if ((gradeClass || codeClass === '주의' || codeClass === '부적합') && gradeClass !== codeClass && !(!codeClass && linked.has(''))) {
      warnings.push(perspectives[key] + '의 등급과 코드 분류를 확인하세요.');
    }
  }
  return { parts, completed, bonusValid, total, assigned, present: [...present], representative, warnings };
}
export function validate(input, { final = false, requireReasons = true } = {}) {
  const errors = [];
  if (!normalizeNumber(input.number)) errors.push('진단번호는 숫자 13자리 또는 NN-NNNN-NNNNNNN 형식으로 입력하세요.');
  if (!/^\d{4}-Q[1-4]$/.test(input.period)) errors.push('진단기간은 YYYY-Q1~Q4 형식으로 입력하세요.');
  if (!Number.isInteger(input.round) || input.round < 1 || input.round > 999) errors.push('회차는 1~999 정수로 입력하세요.');
  if (!weights[input.type]) errors.push('결정유형을 선택하세요.');
  if (!/^[a-z0-9-]{1,40}$/.test(input.group)) errors.push('업무그룹을 선택하세요.');
  const result = evaluate(input);
  if (!result.bonusValid) errors.push('가점은 0~10 정수로 입력하세요.');
  for (const { key, grade } of result.parts) {
    if (grade && !allowedGrades(key).includes(grade)) errors.push(perspectives[key] + '에 사용할 수 없는 등급입니다.');
    if (final && !grade) errors.push(perspectives[key] + '의 등급을 선택하세요.');
    if (final && requireReasons && !input.scores[key]?.reason?.trim()) errors.push(perspectives[key] + '의 사유를 입력하세요.');
  }
  if (final && input.bonus > 0 && !input.bonusReason.trim()) errors.push('가점 사유를 입력하세요.');
  const keys = new Set();
  for (const item of input.codes) {
    if (!classify(item.code)) errors.push('진단코드는 정확한 숫자 4자리로 입력하세요.');
    if (item.perspective && weights[input.type]?.[item.perspective] == null) errors.push('해당 결정유형에 적용되는 관점을 선택하세요.');
    if (!Object.hasOwn(codeStates, item.status)) errors.push('코드 부여상태를 선택하세요.');
    const key = item.perspective + ':' + item.code;
    if (keys.has(key)) errors.push(item.code + ' 코드는 같은 관점에 한 번만 부여할 수 있습니다. 발생 사유를 추가하세요.');
    keys.add(key);
  }
  if (final && !input.reviewed) errors.push('진단코드 검토 완료를 확인하세요.');
  if (final && result.warnings.length && !input.reviewReason.trim()) errors.push('코드 정합성을 확인하고 예외 승인 사유를 입력하세요.');
  if (final && input.importStatus === 'pending') errors.push('Excel에서 이관한 내용을 검토 완료로 표시하세요.');
  return [...new Set(errors)];
}
export function reviewSignature(input) {
  return JSON.stringify([input.type, input.scores, input.codes, input.bonus, input.bonusReason]);
}
export function selectRows(rows, filter = {}) {
  const latest = new Map();
  const candidates = rows.filter((row) => (!filter.period || row.period === filter.period)
    && (!filter.asOf || row.period <= filter.asOf)
    && (filter.mode === 'official' || filter.archive || row.state !== 'archived'));
  for (const row of candidates) {
    const existing = latest.get(row.number);
    if (!existing || row.period > existing.period || (row.period === existing.period
      && (row.round > existing.round || (row.round === existing.round && row.id > existing.id)))) latest.set(row.number, row);
  }
  const work = [...latest.values()];
  const official = filter.mode === 'official';
  const selected = work.flatMap((row) => {
    const rev = official ? row.final : row.working;
    return rev ? [{ ...row, revision: rev }] : [];
  }).filter((row) => (!filter.type || row.revision.input.type === filter.type)
    && (!filter.assignee || row.revision.input.assignee.includes(filter.assignee))
    && (!filter.version || row.revision.version === filter.version)
    && (!filter.query || displayNumber(row.number).includes(filter.query) || row.number.includes(filter.query)));
  const base = selected.map((row) => ({ ...row, result: row.revision.result ?? evaluate(row.revision.input) }));
  const status = (row) => official ? 'final' : row.state;
  const metrics = {
    attention: (row) => row.result.present.includes('주의'),
    unsuitable: (row) => row.result.present.includes('부적합'),
    either: (row) => row.result.present.some((value) => value !== '하자'),
    both: (row) => row.result.present.includes('주의') && row.result.present.includes('부적합'),
    complete: (row) => row.result.total !== null,
    incomplete: (row) => row.result.total === null,
    review: (row) => !row.revision.input.reviewed,
    warning: (row) => row.result.warnings.length > 0
  };
  const filtered = base.filter((row) => {
    if (filter.metric?.startsWith('state:')) return status(row) === filter.metric.slice(6);
    if (filter.metric?.startsWith('representative:')) return row.result.representative === filter.metric.slice(15);
    if (filter.metric?.startsWith('perspective:')) {
      const [, key, grade] = filter.metric.split(':');
      return row.result.parts.some((part) => part.key === key && (part.grade || '미입력') === grade);
    }
    if (filter.metric?.startsWith('linked:')) {
      return row.result.assigned.some((item) => (item.perspective || 'none') === filter.metric.slice(7));
    }
    return (!filter.metric || !metrics[filter.metric] || metrics[filter.metric](row))
      && (!filter.code || row.result.assigned.some((code) => code.code === filter.code));
  });
  return { rows: filtered, excluded: work.length - selected.length, unfinalized: official ? work.filter((row) => !row.final).length : 0 };
}
export function summarize(rows) {
  const reviewed = rows.filter((row) => row.revision.input.reviewed);
  const totals = rows.map((row) => row.result.total).filter((value) => value !== null).sort((a, b) => a - b);
  const count = (category, set = rows) => set.filter((row) => row.result.present.includes(category)).length;
  const codes = (category, set = rows) => set.reduce((sum, row) => sum + row.result.assigned.filter((item) => classify(item.code) === category).length, 0);
  const union = (set) => set.filter((row) => row.result.present.some((value) => value !== '하자')).length;
  const codeRows = new Map();
  const representatives = {};
  const distributions = {};
  const linked = {};
  const scoreBands = {};
  const jobs = {};
  for (const row of rows) {
    const { result, revision } = row;
    representatives[result.representative] = (representatives[result.representative] ?? 0) + 1;
    jobs[row.state] = (jobs[row.state] ?? 0) + 1;
    if (result.total !== null) {
      const from = Math.floor(result.total / 10) * 10;
      scoreBands[from] = (scoreBands[from] ?? 0) + 1;
    }
    for (const part of result.parts) {
      distributions[part.key] ??= {};
      const grade = part.grade || '미입력';
      distributions[part.key][grade] = (distributions[part.key][grade] ?? 0) + 1;
    }
    const counted = new Set();
    for (const item of result.assigned) {
      const key = revision.version + ':' + item.code;
      const entry = codeRows.get(key) ?? { version: revision.version, code: item.code, category: classify(item.code), count: 0, holdings: 0 };
      entry.count++;
      if (!counted.has(key)) entry.holdings++;
      counted.add(key);
      codeRows.set(key, entry);
      linked[item.perspective || 'none'] = (linked[item.perspective || 'none'] ?? 0) + 1;
    }
  }
  return {
    total: rows.length, complete: totals.length, reviewed: reviewed.length, attention: count('주의'), unsuitable: count('부적합'),
    attentionCodes: codes('주의'), unsuitableCodes: codes('부적합'), either: union(rows),
    both: rows.filter((row) => row.result.present.includes('주의') && row.result.present.includes('부적합')).length,
    reviewedAttention: count('주의', reviewed), reviewedUnsuitable: count('부적합', reviewed),
    reviewedEither: union(reviewed), reviewedAttentionCodes: codes('주의', reviewed),
    mean: totals.length ? totals.reduce((a, b) => a + b, 0) / totals.length : null,
    median: totals.length ? (totals[Math.floor((totals.length - 1) / 2)] + totals[Math.floor(totals.length / 2)]) / 2 : null,
    representatives, distributions, scoreBands, jobs, linked, codeRows: [...codeRows.values()].sort((a, b) => a.code.localeCompare(b.code)),
    warnings: rows.filter((row) => row.result.warnings.length > 0).length
  };
}
