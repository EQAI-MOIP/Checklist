'use strict';
// Development verification with Node built-ins. Not needed to run index.html.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const C=require('../js/core.js');
require('../js/rules-data.js');
const R=globalThis.QURI_RULES, root=path.join(__dirname,'..');
const items=R.categories.flatMap(cat=>cat.items);

test('실제 내장 카탈로그의 8관점·66항목·84코드와 모든 참조가 유효하다',()=>{
  assert.equal(R.categories.length,8);assert.equal(items.length,66);assert.equal(R.codebook.length,84);
  assert.equal(new Set(items.map(i=>i.id)).size,items.length);
  const codes=new Set(R.codebook.map(c=>c.code)),refs=new Set(R.references.map(r=>r.id));
  for(const item of items){
    assert.ok(item.question&&item.standard&&item.guidance&&item.evidenceHint);
    assert.ok(item.appliesTo.length&&item.appliesTo.every(t=>C.TYPES.includes(t)));
    item.codeRefs.forEach(code=>assert.ok(codes.has(code),item.id+' code '+code));
    item.sourceRefs.forEach(ref=>assert.ok(refs.has(ref),item.id+' source '+ref));
  }
  for(const ref of R.references)assert.ok(ref.text.trim().length>0,ref.id);
  const covered=new Set(items.flatMap(i=>i.codeRefs));
  assert.equal(covered.size,84);
});

test('15xx 우수사례가 하자나 부적합으로 분류되지 않는다',()=>{
  for(const code of ['1511','1521','1522']){
    const item=R.codebook.find(x=>x.code===code);
    assert.equal(item.kind,'excellent');assert.equal(item.severity,'우수사례');
  }
});

test('네 점검 유형에서 미확인 기본값을 완료로 세지 않으며 예상 항목 수를 적용한다',()=>{
  const expected={notice:51,final:52,rejection:59,registration:59};
  for(const [type,total] of Object.entries(expected)){
    const c=C.createCase({applicationNo:'10-2026-0001234',type,claimCount:3}),p=C.progress(c,R,true);
    assert.equal(p.total,total);assert.equal(p.pending,total);assert.equal(p.ready,0);assert.equal(p.claimPending,3);
    assert.equal(p.percent,0);assert.equal(p.blockers.length,total+3);
  }
});

test('실제 전체 규칙에서 근거·사유·청구항이 모두 충족될 때만 완료 가능하다',()=>{
  for(const type of C.TYPES){
    const c=C.createCase({applicationNo:'10-2026-0001234',type,claimCount:2});
    for(const item of C.applicableItems(c,R))c.responses[item.id]={...C.blankResponse(),status:'pass',evidence:'합성 검증 문서 3쪽'};
    for(let n=1;n<=2;n++)c.claimReviews[n]={...C.blankResponse(),status:'pass',memo:'합성 검증'};
    assert.equal(C.progress(c,R,true).blockers.length,0);
    const critical=C.applicableItems(c,R).find(i=>i.critical);
    c.responses[critical.id].evidence='';assert.ok(C.progress(c,R,true).blockers.some(b=>b.itemId===critical.id&&b.kind==='evidence'));
    c.responses[critical.id].status='na';assert.ok(C.progress(c,R,true).blockers.some(b=>b.kind==='reason'));
    c.responses[critical.id].memo='합성 검증: 이 사건에는 적용되지 않는 조건';assert.equal(C.progress(c,R,true).blockers.length,0);
    c.claimReviews[2]={...C.blankResponse(),status:'issue',memo:'발견 내용',action:'조치 내용',resolved:true};
    assert.ok(C.progress(c,R,true).blockers.some(b=>b.kind==='claim-evidence'));
  }
});

test('유형 변경 후 숨겨진 기록은 백업 왕복에서 보존된다',()=>{
  const c=C.createCase({applicationNo:'20-2026-0001234',type:'registration'}),ws=C.blankWorkspace();
  const registrationOnly=C.applicableItems(c,R).find(i=>!i.appliesTo.includes('notice'));
  assert.ok(registrationOnly);
  c.responses[registrationOnly.id]={...C.blankResponse(),status:'na',memo:'합성 검증 사유'};
  c.type='notice';ws.cases.push(c);
  const roundtrip=C.decodeBackup(C.encodeBackup(ws));
  assert.equal(roundtrip.cases[0].responses[registrationOnly.id].memo,'합성 검증 사유');
  assert.ok(!C.applicableItems(roundtrip.cases[0],R).some(i=>i.id===registrationOnly.id));
  roundtrip.cases[0].type='registration';
  assert.ok(C.applicableItems(roundtrip.cases[0],R).some(i=>i.id===registrationOnly.id));
});

test('실행 HTML의 로컬 자원은 존재하며 서버·모듈·원격 자원을 요구하지 않는다',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const paths=Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g),m=>m[1]).filter(p=>!p.startsWith('#')&&!p.startsWith('data:'));
  for(const p of paths){assert.ok(!/^(?:https?:)?\/\//i.test(p));assert.ok(fs.existsSync(path.join(root,p)),p);}
  assert.doesNotMatch(html,/type=["']module["']/i);
  assert.match(html,/connect-src 'none'/);
  const runtime=['app.js','core.js','quri-sprite.js'].map(f=>fs.readFileSync(path.join(root,'js',f),'utf8')).join('\n');
  assert.doesNotMatch(runtime,/\bfetch\s*\(|new\s+XMLHttpRequest|new\s+WebSocket|sendBeacon\s*\(|\bimport\s*\(/);
  const css=fs.readFileSync(path.join(root,'css/app.css'),'utf8');
  assert.doesNotMatch(css,/@import|url\(["']?https?:/i);
  for(const p of ['assets/quri-v3-motion-16frames.webp','assets/quri-v2-guide-6frames.webp','assets/review-states-6frames.webp']){
    const bytes=fs.readFileSync(path.join(root,p));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
  }
});

test('원문 출처가 두 저장소의 고정 커밋과 함께 보존된다',()=>{
  assert.equal(R.sources[0].commit,'25fe5aaf25ad1dd6169cb4237723bb8c94b98e58');
  assert.equal(R.sources[1].commit,'4d078c8256953de164d8b13196502440c0fc30d0');
  for(const name of ['diagnostic-codes.md','office-action-rules.md','registered-claim-rules.md','rejection-decision-rules.md']){
    assert.ok(fs.statSync(path.join(root,'references',name)).size>1000);
  }
  assert.match(R.catalogNotice,/재구성/);
});
