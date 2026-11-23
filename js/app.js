/* QURI Examiner Checklist v1.0.0. Native browser APIs only. */
(function () {
  'use strict';
  const C = window.QuriCore, R = window.QURI_RULES;
  const view = document.getElementById('view');
  if (!C || !R) {
    view.innerHTML = '<section class="loading-view"><h1>앱 파일을 확인해 주세요</h1><p>압축을 모두 풀어 index.html과 js, css, assets 폴더를 같은 위치에 둔 뒤 다시 열어 주세요.</p></section>';
    document.getElementById('save-state').textContent = '필수 파일 누락';
    return;
  }
  const TYPE = { notice: '의견제출통지', final: '최후통지', rejection: '거절결정', registration: '등록결정' };
  const STATUS = { pending: '미확인', pass: '확인완료', issue: '보완필요', na: '해당없음' };
  const $ = (s, root) => (root || document).querySelector(s);
  const $$ = (s, root) => Array.from((root || document).querySelectorAll(s));
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const icons = {
    plus:'<path d="M12 5v14M5 12h14"/>', search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    check:'<path d="m5 12 4 4L19 6"/>', alert:'<path d="M12 3 2 20h20zM12 9v5M12 17h.01"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>', back:'<path d="M19 12H5m5-5-5 5 5 5"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>', upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 17v4h16v-4"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
    folder:'<path d="M3 7V5h7l2 2h9v13H3z"/>', print:'<path d="M7 8V3h10v5M7 17H3V9h18v8h-4M7 14h10v7H7zM17 11h.01"/>',
    edit:'<path d="m14 5 5 5M4 20l5-1L21 7l-5-5L4 14z"/>', archive:'<path d="M3 4h18v4H3zM5 8v13h14V8M9 12h6"/>',
    book:'<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1zM12 5v15"/>', shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6zM8 12l3 3 5-6"/>'
  };
  const icon = (name, cls) => '<svg aria-hidden="true" class="icon '+(cls || '')+'" viewBox="0 0 24 24">'+(icons[name] || icons.file)+'</svg>';
  const dateText = value => value ? new Date(value).toLocaleDateString('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit' }) : '—';
  const dateTime = value => value ? new Date(value).toLocaleString('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }) : '—';
  const fileDate = () => { const d=new Date(); return d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'_'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+String(d.getSeconds()).padStart(2,'0'); };
  let local;
  try { local=window.localStorage; } catch (_) { local=null; }
  const storage=C.createStorage(local, R), loaded=storage.load();
  let memoryOnly=loaded.recovery && loaded.raw===null;
  let workspace=loaded.workspace, recovery=loaded.recovery && !memoryOnly, recoveryRaw=loaded.raw, storageError=loaded.error, conflict=false;
  let dirty=false, saveTimer=0, toastTimer=0, liveTimer=0;
  let route='dashboard', caseId='', categoryId='', itemFilter='all', listQuery='', listFilter='active', listType='', ruleTab='checklist', ruleQuery='', selectedClaim=1;
  let importWorkspace=null, confirmResolver=null;
  let sprites=[];
  const dialog=$('#app-dialog');
  const ruleItems=R.categories.flatMap(category=>category.items.map(item=>Object.assign({},item,{categoryId:category.id,categoryTitle:category.title})));
  const getCase=()=>workspace.cases.find(c=>c.id===caseId);
  const getProgress=c=>C.progress(c,R,workspace.settings.strictEvidence);
  const fullyComplete=(c,p)=>Boolean(c.completedAt) && (p || getProgress(c)).blockers.length===0;
  const overallPercent=p=>p.total+p.claimTotal ? Math.round((p.ready+p.claimReady)/(p.total+p.claimTotal)*100) : 0;
  const displayStatus=(c,p)=>c.archived ? ['보관함',''] : fullyComplete(c,p) ? ['점검완료','green'] : c.completedAt ? ['재확인 필요','amber'] : p.unresolved || p.blockers.some(b=>b.kind==='claim-issue') ? ['보완 중','amber'] : p.answered || p.claimAnswered ? ['점검 중','purple'] : ['시작 전',''];
  const event=(c,type,message)=>{c.events.push({at:C.now(),type,message});if(c.events.length>1000)c.events.splice(0,c.events.length-1000);};
  function notify(message,error) {
    const el=$('#toast'); clearTimeout(toastTimer); el.textContent=message;el.className='toast'+(error?' error':'');el.hidden=false;
    toastTimer=setTimeout(()=>{el.hidden=true;},error?6500:3800);
  }
  function mountSprites() {
    sprites.forEach(s=>s.destroy()); sprites=[];
    if(!window.QuriSprite)return;
    QuriSprite.setPaused(workspace.settings.reduceMotion);
    $$('[data-quri]',view).forEach(el=>sprites.push(QuriSprite.attach(el,{state:el.dataset.quri,paused:workspace.settings.reduceMotion})));
    document.body.classList.toggle('reduce-motion',workspace.settings.reduceMotion);
  }
  function saveBadge() {
    const el=$('#save-state');
    const error=storageError||recovery||conflict;
    el.className='save-state'+(error?' error':'');
    el.innerHTML='<span class="status-dot '+(error?'error':dirty?'busy':'')+'"></span>'+esc(memoryOnly?'파일 백업 필요':error?'자동 저장 확인 필요':dirty?'저장 중…':workspace.revision?'이 브라우저에 저장됨':'자동 저장 준비됨');
    const banner=$('#storage-banner');
    banner.hidden=!error;
    if(error) banner.innerHTML='<strong>'+esc(memoryOnly?'파일 백업 모드로 작업하고 있습니다.':conflict?'다른 창의 변경 내용이 감지되었습니다.':recovery?'기존 저장 내용을 불러오지 못했습니다.':'자동 저장이 되지 않았습니다.')+'</strong> '+esc(memoryOnly?'브라우저 자동 저장을 사용할 수 없습니다. 현재 화면에서 편집·불러오기는 가능하며, 창을 닫기 전에 JSON 백업을 저장해야 합니다.':storageError||'현재 작업을 백업 파일로 저장해 주세요.')+' <button class="button small" data-action="backup-all">현재 작업 백업</button> <button class="button small" data-action="open-backup">복구·저장 안내</button>';
  }
  function persist() {
    clearTimeout(saveTimer);saveTimer=0;
    if(!dirty){saveBadge();return !storageError&&!recovery&&!conflict;}
    if(recovery||conflict||memoryOnly){saveBadge();return false;}
    const result=storage.save(workspace,workspace.revision);
    if(result.ok){workspace=result.workspace;dirty=false;storageError=null;}
    else {storageError=result.error;conflict=Boolean(result.conflict);if(result.recovery){recovery=true;try{recoveryRaw=local.getItem(C.STORAGE_KEY);}catch(_){}}}
    saveBadge();return result.ok;
  }
  function changed(c,immediate) {
    if(c)c.updatedAt=C.now(); workspace.updatedAt=C.now();dirty=true;saveBadge();
    clearTimeout(saveTimer);if(immediate)persist();else saveTimer=setTimeout(persist,300);
    updateNavCount();
  }
  function updateNavCount(){ $('#nav-count').textContent=workspace.cases.filter(c=>!c.archived).length; }
  function setRoute(hash){location.hash=hash;}
  function readRoute() {
    persist();
    const parts=location.hash.replace(/^#/,'').split('/');
    route=['dashboard','case','rules','backup','help'].includes(parts[0])?parts[0]:'dashboard';
    if(route==='case') {
      if(caseId!==parts[1]){categoryId='';itemFilter='all';selectedClaim=1;}
      caseId=parts[1]||'';
      if(!getCase()){route='dashboard';caseId='';}
    }
    render();window.scrollTo({top:0,behavior:'instant'});
  }
  function render() {
    if(route==='case'&&!getCase()){route='dashboard';caseId='';categoryId='';history.replaceState(null,'','#dashboard');}
    sprites.forEach(s=>s.destroy());sprites=[];
    $$('[data-nav]').forEach(a=>{const active=a.dataset.nav===(route==='case'?'dashboard':route);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    const labels={dashboard:'내 심사건',case:'내 심사건 / 관점별 점검',rules:'기준·규칙 사전',backup:'백업·설정',help:'사용 안내'};
    $('#breadcrumb').textContent=labels[route];
    document.title=(route==='case'?getCase().applicationNo:labels[route])+' · 큐리 심사 체크';
    if(route==='dashboard')renderDashboard();else if(route==='case')renderCase();else if(route==='rules')renderRules();else if(route==='backup')renderBackup();else renderHelp();
    mountSprites();saveBadge();updateNavCount();
  }
  function metric(label,number,type){return '<div class="stat-card"><span class="label">'+label+'</span><strong>'+number+'<small>건</small></strong><span class="stat-icon">'+icon(type)+'</span></div>';}
  function renderDashboard(){
    const active=workspace.cases.filter(c=>!c.archived), summaries=active.map(c=>({c,p:getProgress(c)}));
    const done=summaries.filter(x=>fullyComplete(x.c,x.p)).length, needs=summaries.filter(x=>x.p.unresolved||x.p.blockers.some(b=>b.kind==='claim-issue')).length;
    const ongoing=summaries.filter(x=>!fullyComplete(x.c,x.p)&&(x.p.answered||x.p.claimAnswered)).length;
    view.innerHTML='<div class="page-heading"><div><div class="eyebrow">MY REVIEW WORKSPACE</div><h1>나의 심사 점검실</h1><p>한 건씩 꼼꼼하게, 확인한 근거까지 남겨 보세요.</p></div><button class="button primary" data-action="new-case">'+icon('plus')+'새 심사건</button></div>'+
      '<section class="hero" aria-label="큐리 안내"><div><div class="eyebrow">YOUR THOUGHTFUL REVIEW PARTNER</div><h2>'+(workspace.settings.name?esc(workspace.settings.name)+' 심사관님,':'심사관님,')+' 오늘도 함께 살펴볼까요?</h2><p>출원번호를 등록하면 점검할 관점을 차근차근 안내해 드릴게요.<br>놓친 확인과 보완사항은 큐리가 따로 모아 두겠습니다.</p><button class="button light" data-action="'+(active.length?'resume-case':'new-case')+'">'+(active.length?'이어서 점검하기':'첫 심사건 등록하기')+icon('arrow')+'</button></div><div class="hero-character"><div class="quri-sprite" data-quri="welcome"></div><span class="character-caption">큐리, 함께할 준비 완료!</span></div></section>'+
      '<section class="stats-grid" aria-label="심사건 현황">'+metric('관리 중인 심사건',active.length,'folder')+metric('점검 진행 중',ongoing,'clock')+metric('보완이 필요한 심사건',needs,'alert')+metric('점검을 마친 심사건',done,'check')+'</section>'+
      '<section><div class="section-title"><h2>내 심사건 <span class="tiny muted">'+workspace.cases.length+'</span></h2><button class="text-button tiny" data-action="csv-all">목록 CSV 저장</button></div><div class="toolbar"><label class="search-box">'+icon('search')+'<input id="case-search" type="search" maxlength="500" placeholder="출원번호, 발명의 명칭, 심사관으로 찾기" aria-label="심사건 검색" value="'+esc(listQuery)+'"></label><select id="case-filter" aria-label="진행 상태로 보기"><option value="active">관리 중인 심사건</option><option value="all">전체 심사건</option><option value="pending">시작 전</option><option value="progress">점검 중</option><option value="issues">보완 중</option><option value="complete">점검완료</option><option value="archived">보관함</option></select><select id="type-filter" aria-label="점검 유형으로 보기"><option value="">모든 점검 유형</option>'+Object.entries(TYPE).map(([k,v])=>'<option value="'+k+'">'+v+'</option>').join('')+'</select></div><div id="case-results"></div></section>'+
      '<div class="dashboard-foot">'+icon('shield')+'<div><strong>인터넷 없이, 심사관님의 기기에서.</strong><br>확인 내용은 현재 브라우저에 자동 저장됩니다. 폴더 이동·PC 변경·브라우저 정리 전에는 전체 백업을 저장해 주세요.</div></div>';
    $('#case-filter').value=listFilter;$('#type-filter').value=listType;renderCaseResults();
  }
  function filteredCases(){
    const q=listQuery.trim().toLowerCase(),digits=q.replace(/[-\s]/g,'');
    return workspace.cases.map(c=>({c,p:getProgress(c)})).filter(({c,p})=>{
      if(q && ![c.applicationNo,c.title,c.examiner].join(' ').toLowerCase().includes(q) && !c.applicationNo.replace(/-/g,'').includes(digits))return false;
      if(listType&&c.type!==listType)return false;
      if(listFilter==='archived')return c.archived;
      if(listFilter!=='all'&&c.archived)return false;
      if(listFilter==='pending')return !c.completedAt&&!p.answered&&!p.claimAnswered;
      if(listFilter==='progress')return !fullyComplete(c,p)&&(p.answered||p.claimAnswered);
      if(listFilter==='issues')return p.unresolved>0||p.blockers.some(b=>b.kind==='claim-issue');
      if(listFilter==='complete')return fullyComplete(c,p);
      return true;
    }).sort((a,b)=>b.c.updatedAt.localeCompare(a.c.updatedAt));
  }
  function renderCaseResults(){
    const entries=filteredCases(),host=$('#case-results');if(!host)return;
    if(!entries.length){host.innerHTML='<div class="panel empty-state"><div class="empty-symbol">'+icon('file','icon-lg')+'</div><h3>'+(workspace.cases.length?'조건에 맞는 심사건이 없어요':'첫 번째 점검 노트를 만들어 보세요')+'</h3><p>'+(workspace.cases.length?'검색어나 진행 상태를 바꾸면 다른 심사건을 확인할 수 있습니다.':'출원번호별로 점검 결과와 근거를 모아 관리합니다.<br>처음이라면 연습용 심사건으로 사용법을 살펴보세요.')+'</p><div class="button-row">'+(workspace.cases.length?'<button class="button" data-action="clear-filters">검색 조건 초기화</button>':'<button class="button primary" data-action="new-case">'+icon('plus')+'새 심사건 등록</button><button class="button" data-action="sample">연습용 심사건 열기</button>')+'</div></div>';return;}
    host.innerHTML='<div class="panel case-list"><table class="case-table"><colgroup><col style="width:35%"><col class="hide-tablet" style="width:16%"><col style="width:20%"><col style="width:14%"><col class="hide-mobile" style="width:15%"></colgroup><thead><tr><th scope="col">출원번호 / 발명의 명칭</th><th class="hide-tablet" scope="col">점검 유형</th><th scope="col">점검 진행률</th><th scope="col">진행 상태</th><th class="hide-mobile" scope="col">최근 기록</th></tr></thead><tbody>'+entries.map(({c,p})=>{const status=displayStatus(c,p),pct=overallPercent(p);return '<tr><td class="case-cell"><button class="case-link" data-action="open-case" data-id="'+esc(c.id)+'"><div class="number">'+esc(c.applicationNo)+'</div><div class="case-title">'+esc(c.title||'명칭 미입력')+'</div></button></td><td class="hide-tablet muted">'+TYPE[c.type]+'</td><td class="progress-cell"><div class="progress-caption"><span>'+p.ready+'/'+p.total+(p.claimTotal?' · 청구항 '+p.claimReady+'/'+p.claimTotal:'')+'</span><strong>'+pct+'%</strong></div><div class="progress-track" role="progressbar" aria-label="'+esc(c.applicationNo)+' 점검 진행률" aria-valuenow="'+pct+'" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:'+pct+'%"></div></div></td><td class="state-cell"><span class="tag '+status[1]+'">'+status[0]+'</span></td><td class="hide-mobile muted tiny">'+dateText(c.updatedAt)+'</td></tr>';}).join('')+'</tbody></table><div class="case-footer"><span>'+entries.length+'건 표시 · 최근 기록순</span><span>진행률은 근거·사유까지 충족한 항목 기준</span></div></div>';
  }
  function caseStage(c,p){if(fullyComplete(c,p))return 3;if(p.answered===p.total && p.claimAnswered===p.claimTotal)return 2;return 1;}
  function renderCase(){
    const c=getCase();if(!c)return;const p=getProgress(c),cats=R.categories.filter(cat=>p.categories.some(x=>x.id===cat.id)),locked=Boolean(c.completedAt)||c.archived;
    if(!categoryId||(!['claims','review','notes'].includes(categoryId)&&!cats.some(x=>x.id===categoryId)))categoryId=cats[0]?.id||'review';
    const stage=caseStage(c,p),pct=overallPercent(p);
    view.innerHTML='<a class="back-link" href="#dashboard">'+icon('back')+'내 심사건으로</a><div class="case-heading"><div><div class="eyebrow">EXAMINATION CHECKLIST</div><h1>'+esc(c.applicationNo)+'</h1><div class="subtitle">'+esc(c.title||'발명의 명칭을 입력해 주세요')+'</div><div class="meta-line"><span class="tag purple">'+TYPE[c.type]+'</span>'+(c.title.startsWith('[연습용]')?'<span class="tag amber">가상 연습 데이터</span>':'')+'<span>'+esc(c.examiner||'심사관 미입력')+'</span>'+(c.dueDate?'<span>점검 예정일 '+esc(c.dueDate)+'</span>':'')+'<span>청구항 '+(c.claimCount?c.claimCount+'개':'수 미입력')+'</span></div></div><div class="button-row"><button class="button small" data-action="edit-case" '+(locked?'disabled':'')+'>'+icon('edit')+'기본정보</button><button class="button small" data-action="report">'+icon('print')+'보고서</button><button class="button small" data-action="case-menu">더 보기</button></div></div>'+
      (locked?'<div class="locked-banner">'+icon(c.archived?'archive':'check')+'<span>'+(c.archived?'보관함에 있는 심사건입니다.':fullyComplete(c,p)?dateText(c.completedAt)+'에 점검을 완료했습니다. 기록은 잠겨 있습니다.':'기존 완료 기록에서 추가 확인이 필요합니다. 점검을 재개해 주세요.')+'</span><button class="button small" data-action="'+(c.archived?'unarchive':'reopen')+'">'+(c.archived?'보관 해제':'점검 재개')+'</button></div>':'')+
      '<div id="stage-area">'+stageMarkup(stage,p)+'</div><div id="case-progress">'+caseProgressMarkup(p,pct)+'</div><div class="work-grid"><nav class="category-nav" aria-label="점검 관점"><div class="label">점검할 관점</div>'+cats.map((cat,i)=>categoryButton(cat,p.categories.find(x=>x.id===cat.id),i)).join('')+'<button class="category-button special '+(categoryId==='claims'?'active':'')+'" data-action="category" data-category="claims"><span class="name">청구항별 점검<span class="count">'+p.claimReady+'/'+p.claimTotal+'</span></span></button><button class="category-button '+(categoryId==='notes'?'active':'')+'" data-action="category" data-category="notes"><span class="name">종합 메모·이력</span></button><button class="category-button '+(categoryId==='review'?'active':'')+'" data-action="category" data-category="review"><span class="name">보완·최종확인<span class="count" id="nav-block-count">'+p.blockers.length+'</span></span></button></nav><section id="checklist-main" aria-label="점검 항목"></section><aside id="quri-guide" class="guide-card" aria-label="큐리 점검 안내">'+guideMarkup(c,p)+'</aside></div>';
    renderChecklist();
  }
  function stageMarkup(stage,p){
    const steps=[['기본정보','출원번호·유형 등록'],['관점별 점검','기준과 근거 확인'],['보완·최종확인','누락사항 마무리'],['점검완료','결과 기록·보관']];
    return '<div class="stage-rail" aria-label="점검 단계">'+steps.map((s,i)=>'<div class="stage '+(i<stage?'done':i===stage?'current':'')+'" '+(i===stage?'aria-current="step"':'')+'><span class="stage-index">'+(i<stage?'✓':i+1)+'</span><div><strong>'+s[0]+'</strong><small>'+s[1]+'</small></div></div>').join('')+'</div>';
  }
  function caseProgressMarkup(p,pct){return '<div class="case-summary"><strong>'+pct+'% 진행</strong><div class="progress-track"><div class="progress-fill" style="width:'+pct+'%"></div></div><span>관점별 '+p.ready+'/'+p.total+'</span>'+(p.claimTotal?'<span>청구항 '+p.claimReady+'/'+p.claimTotal+'</span>':'')+'<span>미확인 '+(p.pending+p.claimPending)+'</span><span class="right">확인 결과와 근거가 함께 채워져야 완료됩니다.</span></div>';}
  function categoryButton(cat,pc,index){return '<button class="category-button '+(categoryId===cat.id?'active':'')+'" data-action="category" data-category="'+esc(cat.id)+'"><span class="name"><span>'+String(index+1).padStart(2,'0')+' '+esc(cat.shortTitle||cat.title)+'</span><span class="count" data-cat-count="'+esc(cat.id)+'">'+pc.ready+'/'+pc.total+'</span></span><div class="progress-track"><div class="progress-fill" data-cat-fill="'+esc(cat.id)+'" style="width:'+pc.percent+'%"></div></div></button>';}
  function guideMarkup(c,p){
    const complete=fullyComplete(c,p),ready=!p.blockers.length;
    const state=complete?'success':categoryId==='review'?(ready?'success':'attention'):categoryId==='claims'?'thinking':p.answered?'review':'welcome';
    let title='근거를 함께 남겨 주세요',message='확인한 문서의 이름, 쪽, 청구항 번호를 적어 두면 다시 살펴볼 때 편해요. 한 항목씩 충분히 확인해 주세요.';
    if(!p.answered){title='첫 항목부터 천천히 시작해요';message='기준과 확인 방법을 읽고 점검 결과를 골라 주세요. 핵심 항목은 확인한 근거까지 남기면 진행률에 반영돼요.';}
    if(categoryId==='claims'){title='청구항마다 따로 살펴봐요';message='선행기재, 인용관계, 구성의 명확성을 청구항별로 확인해 주세요. 삭제된 청구항은 사유와 함께 해당없음을 선택할 수 있어요.';}
    if(categoryId==='review'){title=ready?'마지막 확인만 남았어요':'남은 확인을 모아 두었어요';message=ready?'모든 필수 기록이 채워졌어요. 최종 확인 후 점검을 완료하면 기록을 잠글 수 있어요.':'미확인, 근거 누락, 처리하지 않은 보완사항을 바로 확인할 수 있어요. 항목 옆의 이동 버튼으로 돌아가 보세요.';}
    if(complete){title='꼼꼼한 기록, 수고하셨어요!';message='점검 결과를 보고서로 남기고 백업 파일도 저장해 주세요. 다시 수정할 때는 점검 재개를 선택하면 됩니다.';}
    return '<div class="guide-title">QURI’S REVIEW GUIDE</div><div class="quri-sprite" data-quri="'+state+'"></div><h3>'+title+'</h3><p>'+message+'</p><button class="button small wide" data-action="next-pending">다음 미완료 항목'+icon('arrow')+'</button><div class="guide-tip"><strong>큐리의 작은 안내</strong>보완필요를 선택한 항목은 발견 내용·근거·조치 결과를 남기고 보완 완료를 표시해 주세요.</div>';
  }
  function renderChecklist(){
    const c=getCase(),host=$('#checklist-main');if(!host||!c)return;
    if(categoryId==='review'){renderReview(c,host);return;}
    if(categoryId==='notes'){renderNotes(c,host);return;}
    if(categoryId==='claims'){renderClaims(c,host);return;}
    const cat=R.categories.find(x=>x.id===categoryId),p=getProgress(c);
    const items=C.applicableItems(c,R).filter(x=>x.categoryId===categoryId);
    const selected=items.filter(item=>{const r=c.responses[item.id]||{status:'pending'},blocked=p.blockers.some(b=>b.itemId===item.id);return itemFilter==='pending'?r.status==='pending':itemFilter==='issue'?r.status==='issue':itemFilter==='unfinished'?blocked:true;});
    host.innerHTML='<div class="checklist-header"><div class="eyebrow">PERSPECTIVE CHECK</div><h2>'+esc(cat.title)+'</h2><p>'+esc(cat.description)+'</p></div><div class="filter-bar" aria-label="항목 필터">'+[['all','전체 '+items.length],['pending','미확인'],['issue','보완필요'],['unfinished','기록 미완료']].map(([key,name])=>'<button class="filter-chip '+(itemFilter===key?'active':'')+'" data-action="item-filter" data-filter="'+key+'" aria-pressed="'+(itemFilter===key)+'">'+name+'</button>').join('')+'</div><div id="check-cards">'+(selected.length?selected.map(item=>checkCard(c,item,p)).join(''):'<div class="panel empty-state"><div class="empty-symbol">'+icon('check')+'</div><h3>이 조건의 항목이 없어요</h3><p>다른 필터를 선택하거나 다음 관점을 살펴보세요.</p><button class="button small" data-action="item-filter" data-filter="all">전체 항목 보기</button></div>')+'</div><div class="checklist-bottom"><button class="button small" data-action="category-prev">'+icon('back')+'이전 관점</button><button class="button small primary" data-action="category-next">다음 관점'+icon('arrow')+'</button></div>';
  }
  function checkCard(c,item,p){
    const r=c.responses[item.id]||C.blankResponse(),locked=Boolean(c.completedAt)||c.archived,blocked=p.blockers.filter(b=>b.itemId===item.id);
    return '<article class="check-card '+r.status+'" id="item-'+esc(item.id)+'" data-item="'+esc(item.id)+'"><div class="check-card-top"><span class="item-index">'+esc(item.id)+'</span>'+(item.critical?'<span class="tag amber">핵심 확인</span>':'')+(item.codeRefs||[]).map(code=>'<button class="code-chip" data-action="show-code" data-code="'+esc(code)+'" title="진단코드 '+esc(code)+' 보기">'+esc(code)+'</button>').join('')+'</div><h3>'+esc(item.question||item.title)+'</h3><p class="standard">'+esc(item.standard)+'</p><details class="item-details"><summary>확인 방법과 원문 보기</summary><div class="detail-body">'+esc(item.guidance)+'<div class="source-links">'+(item.sourceRefs||[]).map(ref=>'<button class="text-button tiny" data-action="show-source" data-source="'+esc(ref)+'">'+esc(ref)+' 원문</button>').join('')+'</div></div></details>'+statusOptions(r.status,item.id,locked,false)+'<div class="response-fields '+(locked?'read-only-fields':'')+'" data-response-for="'+esc(item.id)+'">'+responseFields(r,item,locked,false,blocked)+'</div></article>';
  }
  function statusOptions(status,id,locked,claim){return '<div class="status-options" role="group" aria-label="'+(claim?'청구항 '+id:esc(id))+' 점검 결과">'+Object.entries(STATUS).map(([key,label])=>'<button class="status-option '+(status===key?'selected':'')+'" data-action="'+(claim?'claim-status':'item-status')+'" data-id="'+esc(id)+'" data-status="'+key+'" aria-pressed="'+(status===key)+'" '+(locked?'disabled':'')+'>'+label+'</button>').join('')+'</div>';}
  function responseFields(r,item,locked,claim,blocked){
    const base='data-'+(claim?'claim-field':'response-field'),id=esc(item.id),disabled=locked?'disabled':'',memoLabel=r.status==='na'?'해당하지 않는 이유':r.status==='issue'?'발견한 보완사항':'확인 메모';
    const field=(name,label,value,area,placeholder,required)=>'<label>'+label+(required?'<span class="required">필수</span>':'')+(area?'<textarea '+base+'="'+name+'" data-id="'+id+'" maxlength="12000" placeholder="'+esc(placeholder||'')+'" '+disabled+'>'+esc(value)+'</textarea>':'<input '+base+'="'+name+'" data-id="'+id+'" maxlength="'+(name==='claims'?1000:12000)+'" value="'+esc(value)+'" placeholder="'+esc(placeholder||'')+'" '+disabled+'>')+'</label>';
    if(r.status==='pending')return '<div class="muted tiny">점검 결과를 선택하면 근거와 메모를 기록할 수 있어요.</div>';
    return (r.status!=='na'?'<div class="field-row">'+field('evidence','확인한 근거 · 문서 / 쪽',r.evidence,false,item.evidenceHint||'예: 보정서 3쪽, 청구항 1',r.status==='issue'||!claim&&item.critical&&workspace.settings.strictEvidence)+field('claims','관련 청구항',r.claims,false,claim?'예: 1, 2, 3':'예: 1~3, 5',false)+'</div>':'')+field('memo',memoLabel,r.memo,true,r.status==='na'?'이 출원에 적용하지 않는 이유를 적어 주세요.':r.status==='issue'?'무엇이 보완되어야 하는지 구체적으로 기록해 주세요.':'검토 내용이나 판단 이유를 적어 주세요.',r.status==='issue'||r.status==='na')+(r.status==='issue'?field('action','보완 조치 · 처리 결과',r.action,true,'보완한 내용과 재확인 결과를 적어 주세요.',true)+'<label class="checkbox-line"><input type="checkbox" '+base+'="resolved" data-id="'+id+'" '+(r.resolved?'checked':'')+' '+disabled+'>보완사항을 처리하고 다시 확인했습니다.</label>':'')+'<div class="response-feedback" data-feedback="'+id+'">'+feedbackMarkup(blocked,r)+'</div>';
  }
  function feedbackMarkup(blocked,r){return blocked.length?'<div class="response-warning">'+esc(blocked[0].message)+(blocked.length>1?' 외 '+(blocked.length-1)+'건':'')+'</div>':r.status==='pending'?'':'<div class="response-complete">'+icon('check')+'필수 기록이 채워졌습니다.</div>';}
  function refreshProgress(){
    if(route!=='case')return;const c=getCase();if(!c)return;const p=getProgress(c);
    $('#stage-area').innerHTML=stageMarkup(caseStage(c,p),p);$('#case-progress').innerHTML=caseProgressMarkup(p,overallPercent(p));
    p.categories.forEach(pc=>{const count=$('[data-cat-count="'+CSS.escape(pc.id)+'"]'),fill=$('[data-cat-fill="'+CSS.escape(pc.id)+'"]');if(count)count.textContent=pc.ready+'/'+pc.total;if(fill)fill.style.width=pc.percent+'%';});
    const badge=$('#nav-block-count');if(badge)badge.textContent=p.blockers.length;
    $$('[data-feedback]').forEach(el=>{const id=el.dataset.feedback,r=id.startsWith('claim:')?c.claimReviews[id.slice(6)]||C.blankResponse():c.responses[id]||C.blankResponse();el.innerHTML=feedbackMarkup(p.blockers.filter(b=>b.itemId===id),r);});
  }
  function renderClaims(c,host){
    const p=getProgress(c),locked=Boolean(c.completedAt)||c.archived;
    if(selectedClaim>c.claimCount)selectedClaim=1;
    let html='<div class="checklist-header"><div class="eyebrow">CLAIM BY CLAIM</div><h2>청구항별 점검</h2><p>각 청구항의 구성, 인용관계, 선행기재와 검토 결과를 남겨 주세요. 청구항 수는 기본정보에서 설정합니다.</p></div>';
    if(!c.claimCount){host.innerHTML=html+'<div class="panel empty-state"><div class="empty-symbol">'+icon('file')+'</div><h3>청구항 수를 먼저 입력해 주세요</h3><p>최종 검토 대상 청구범위의 마지막 청구항 번호를 입력하면 청구항별 점검표가 열립니다. 삭제된 번호는 해당없음과 사유를 기록하세요.</p><button class="button primary" data-action="edit-case" '+(locked?'disabled':'')+'>청구항 수 입력</button></div>';return;}
    html+='<div class="claims-grid">'+Array.from({length:c.claimCount},(_,i)=>{const n=i+1,r=c.claimReviews[n]||{status:'pending'};return '<button class="claim-pill '+r.status+' '+(n===selectedClaim?'active':'')+'" data-action="select-claim" data-claim="'+n+'">청구항 '+n+'<small>'+STATUS[r.status]+'</small></button>';}).join('')+'</div>';
    const r=c.claimReviews[selectedClaim]||C.blankResponse(),id=String(selectedClaim),blocked=p.blockers.filter(b=>b.itemId==='claim:'+id);
    html+='<article class="check-card '+r.status+'" id="claim-'+id+'"><div class="check-card-top"><span class="tag purple">청구항 '+id+'</span><span class="tiny muted">'+p.claimReady+'/'+p.claimTotal+'개 필수 기록 완료</span></div><h3>이 청구항의 구성과 인용관계, 검토 근거를 확인했나요?</h3><p class="standard">선행기재·구성의 명확성·종속항 인용·발명의 설명과의 일치를 함께 살펴보세요. 이 기록은 관점별 상세 점검을 보완합니다.</p>'+statusOptions(r.status,id,locked,true)+'<div class="response-fields">'+responseFields(r,{id,critical:false,evidenceHint:'예: 최종 보정서 청구항 '+id},locked,true,blocked).replace('data-feedback="'+id+'"','data-feedback="claim:'+id+'"')+'</div></article><div class="checklist-bottom"><button class="button small" data-action="claim-prev" '+(selectedClaim<=1?'disabled':'')+'>이전 청구항</button><button class="button small primary" data-action="claim-next">'+(selectedClaim<c.claimCount?'다음 청구항':'최종확인으로')+icon('arrow')+'</button></div>';
    host.innerHTML=html;
  }
  function renderReview(c,host){
    const p=getProgress(c),locked=Boolean(c.completedAt)||c.archived;
    const grouped=new Map();p.blockers.forEach(b=>{if(!grouped.has(b.itemId))grouped.set(b.itemId,{...b,messages:[]});grouped.get(b.itemId).messages.push(b.message);});
    const entries=Array.from(grouped.values());
    host.innerHTML='<div class="checklist-header"><div class="eyebrow">BEFORE YOU FINISH</div><h2>보완·최종확인</h2><p>점검 완료까지 남은 항목을 한곳에 모았습니다. 각 항목에서 확인 결과, 근거, 필요한 사유를 채워 주세요.</p></div><div class="button-row"><span class="tag purple">기록 완료 '+p.ready+'/'+p.total+'</span><span class="tag amber">미확인 '+(p.pending+p.claimPending)+'</span><span class="tag red">추가 기록 필요 '+entries.length+'항목</span></div>'+
      (entries.length?'<div class="blocking-list">'+entries.map((b,i)=>'<div class="blocking-row"><span class="count-bubble">'+(i+1)+'</span><div><strong>'+esc(b.title)+'</strong><p>'+esc(b.messages[0])+(b.messages.length>1?' 외 '+(b.messages.length-1)+'건':'')+'</p></div><button class="button small" data-action="jump-item" data-id="'+esc(b.itemId)+'" data-category="'+esc(b.categoryId)+'">이동'+icon('arrow')+'</button></div>').join('')+'</div>':'')+
      '<section class="completion-card '+(!entries.length?'ready':'')+'"><h3>'+(!entries.length?'모든 필수 기록이 채워졌습니다':'점검 완료 전에 '+entries.length+'개 항목을 확인해 주세요')+'</h3><p>'+(!entries.length?'확인 결과와 근거, 보완 처리 내역이 모두 기록되어 있습니다. 아래 내용을 확인하면 이번 점검을 완료하고 기록을 잠글 수 있습니다.':'미확인 항목, 핵심 항목의 근거, 해당없음 사유, 미처리 보완사항이 남아 있으면 완료되지 않습니다.')+'</p>'+(!c.claimCount?'<div class="info-box amber">청구항별 점검표가 설정되지 않았습니다. 필요하면 기본정보에 청구항 수를 입력해 주세요. 개별 청구항을 검토할 필요가 없는 경우에는 종합 메모에 사유를 남기는 것을 권장합니다.</div>':'')+'<label class="checkbox-line"><input type="checkbox" id="final-ack" '+(locked||entries.length?'disabled':'')+'>대상 문서와 최종 청구범위를 직접 확인하고, 필요한 보완을 마쳤습니다.</label><button class="button '+(!entries.length?'green':'primary')+'" data-action="complete" '+(locked?'disabled':'')+'>'+icon('check')+(fullyComplete(c,p)?'점검완료':'이번 점검 완료하기')+'</button></section><div class="provenance-note">이 앱의 완료 표시는 심사관의 자기 점검 기록입니다. 진단코드 자동 부여, 법적 결론 확정 또는 기관의 공식 결재를 의미하지 않습니다.</div>';
  }
  function renderNotes(c,host){
    const locked=Boolean(c.completedAt)||c.archived;
    host.innerHTML='<div class="checklist-header"><div class="eyebrow">REVIEW NOTES</div><h2>종합 메모·이력</h2><p>문서 버전, 검토 범위, 쟁점과 남겨 둘 판단 이유를 기록해 주세요.</p></div><div class="panel panel-pad"><label for="case-notes" class="tiny muted">이 심사건의 종합 기록</label><textarea id="case-notes" class="notes-area" maxlength="40000" placeholder="예: 검토 문서 목록과 버전 / 최종 청구범위 / 핵심 쟁점 / 후속 조치" '+(locked?'disabled':'')+'>'+esc(c.notes)+'</textarea><div class="tiny muted">입력 내용은 자동 저장됩니다. 문서 원본은 포함되지 않으므로 파일명과 쪽을 구체적으로 남겨 주세요.</div></div><section class="panel panel-pad" style="margin-top:16px"><h3>주요 변경 이력</h3><div class="event-list">'+(c.events.length?c.events.slice(-50).reverse().map(e=>'<div class="event"><time>'+dateTime(e.at)+'</time>'+esc(e.message)+'</div>').join(''):'<p class="tiny muted">아직 기록된 변경 이력이 없습니다.</p>')+'</div></section>';
  }
  function renderRules(){
    view.innerHTML='<div class="page-heading"><div><div class="eyebrow">REFERENCE DESK</div><h1>기준·규칙 사전</h1><p>내장된 점검 기준과 진단코드의 원문을 확인하세요.</p></div><span class="tag purple">'+esc(R.version)+'</span></div><div class="info-box">체크 질문은 자기 점검을 돕기 위해 재구성한 안내입니다. 진단코드는 참고 후보이며 자동 부여되지 않습니다. 상세 조건은 원문을 함께 확인해 주세요.</div><div class="rule-tabs">'+[['checklist','관점별 체크 기준'],['codes','진단코드'],['sources','원문·출처']].map(([key,label])=>'<button class="button small '+(ruleTab===key?'primary':'')+'" data-action="rule-tab" data-tab="'+key+'">'+label+'</button>').join('')+'</div><div class="toolbar"><label class="search-box">'+icon('search')+'<input id="rule-search" type="search" aria-label="기준과 코드 검색" maxlength="500" placeholder="기준, 확인 방법, 코드로 검색" value="'+esc(ruleQuery)+'"></label></div><div id="rule-results"></div>';
    renderRuleResults();
  }
  function renderRuleResults(){
    const host=$('#rule-results');if(!host)return;const q=ruleQuery.trim().toLowerCase();
    if(ruleTab==='checklist'){
      const items=ruleItems.filter(x=>[x.title,x.question,x.standard,x.guidance,...x.codeRefs].join(' ').toLowerCase().includes(q));
      host.innerHTML='<p class="tiny muted" style="margin-bottom:14px">'+R.categories.length+'개 관점 · 전체 '+ruleItems.length+'개 항목 중 '+items.length+'개 표시 · 점검 유형에 따라 적용 항목이 달라집니다.</p>'+items.map(item=>'<article class="library-card"><div class="rule-meta"><span class="tag purple">'+esc(item.categoryTitle)+'</span><span class="tiny muted">'+esc(item.id)+'</span>'+(item.critical?'<span class="tag amber">핵심 확인</span>':'')+'</div><h3>'+esc(item.question||item.title)+'</h3><p>'+esc(item.standard)+'</p><details class="item-details"><summary>확인 방법과 적용 유형</summary><div class="detail-body">'+esc(item.guidance)+'<br>적용: '+item.appliesTo.map(x=>TYPE[x]).join(' · ')+'<div class="source-links">'+item.sourceRefs.map(id=>'<button class="text-button tiny" data-action="show-source" data-source="'+esc(id)+'">'+esc(id)+' 원문</button>').join('')+'</div></div></details></article>').join('');
    }else if(ruleTab==='codes'){
      const codes=R.codebook.filter(x=>[x.code,x.title,x.category,x.description].join(' ').toLowerCase().includes(q));
      host.innerHTML='<p class="tiny muted" style="margin-bottom:14px">원문에 수록된 '+R.codebook.length+'개 진단코드 중 '+codes.length+'개 표시</p>'+codes.map(code=>'<article class="library-card"><div class="rule-meta"><span class="tag purple">'+esc(code.code)+'</span><span class="tiny muted">'+esc(code.category)+'</span></div><h3>'+esc(code.title)+'</h3><p>'+esc(code.description)+'</p><button class="text-button tiny" data-action="show-code" data-code="'+esc(code.code)+'">관련 원문 보기</button></article>').join('');
    }else {
      const refs=R.references.filter(x=>[x.id,x.title,x.source,x.text].join(' ').toLowerCase().includes(q));
      host.innerHTML='<div class="panel content-card"><h2>규칙을 가져온 기준</h2><p>EQAI_sheet의 관점 구조와 AI_Reviewer의 진단규칙을 참조했습니다. EQAI_sheet의 상세 매뉴얼은 저장소 기준으로 별도 업로드 전 안내 상태이므로, 이 앱의 체크 질문을 공식 상세 매뉴얼과 동일한 내용으로 보아서는 안 됩니다.</p><p style="margin-top:10px">이 앱은 '+esc(R.sourceDate)+'에 확보한 규칙을 담았습니다. 오프라인에서는 규칙이 자동 갱신되지 않습니다.</p>'+(R.sources||[]).map(s=>'<div class="source-card"><strong>'+esc(s.name)+'</strong><code>'+esc(s.commit)+'</code></div>').join('')+'</div><h2 style="font-size:16px;margin:24px 0 14px">보관된 원문 '+refs.length+'개</h2>'+refs.map(ref=>'<div class="library-card space-between"><div><span class="tiny muted">'+esc(ref.id)+'</span><h3>'+esc(ref.title)+'</h3></div><button class="button small" data-action="show-source" data-source="'+esc(ref.id)+'">원문 보기</button></div>').join('');
    }
    if(!host.children.length)host.innerHTML='<div class="panel empty-state"><h3>검색 결과가 없습니다</h3><p>다른 단어나 진단코드로 검색해 주세요.</p></div>';
  }
  function renderBackup(){
    const count=workspace.cases.length,size=new Blob([JSON.stringify(workspace)]).size;
    view.innerHTML='<div class="page-heading"><div><div class="eyebrow">KEEP YOUR WORK SAFE</div><h1>백업·설정</h1><p>나의 기록을 파일로 보관하고, 다른 PC에서도 이어서 사용하세요.</p></div></div><div class="two-column"><div class="stack"><section class="panel content-card"><h2>작업 데이터 백업</h2><p>전체 심사건, 체크 결과, 근거·메모와 설정을 하나의 JSON 파일로 저장합니다. 백업 파일은 원문 문서를 포함하지 않습니다.</p><div class="backup-metrics"><span><strong>'+count+'</strong>관리 중인 전체 심사건</span><span><strong>'+Math.max(1,Math.ceil(size/1024))+' KB</strong>작업 데이터 크기</span></div><div class="button-row"><button class="button primary" data-action="backup-all">'+icon('download')+'전체 백업 저장</button><button class="button" data-action="csv-all">심사건 목록 CSV</button></div><div class="info-box amber">자동 저장 위치는 브라우저입니다. HTML 폴더에 자동으로 파일이 생기는 방식은 아닙니다. 백업 파일을 업무 폴더나 별도 보관 위치에 직접 저장해 주세요.</div></section><section class="panel content-card"><h2>백업 파일 불러오기</h2><p>가져오기 전에 포함된 출원 수와 중복 여부를 확인합니다. 기본 병합은 기존 출원을 유지하고 새로운 출원만 추가합니다.</p><div class="drop-zone" id="backup-drop" tabindex="0" role="button" aria-label="JSON 백업 파일 선택 또는 드래그">'+icon('upload')+'<strong>백업 JSON을 끌어 놓으세요</strong>또는 여기를 눌러 파일 선택</div><div class="button-row"><button class="button" data-action="import">'+icon('upload')+'백업 파일 선택</button></div></section>'+(recovery&&recoveryRaw!==null?'<section class="panel content-card"><h2>읽지 못한 저장 원문</h2><p>기존 데이터는 덮어쓰지 않았습니다. 원문을 파일로 남긴 다음 정상 백업을 불러와 복구할 수 있습니다.</p><div class="button-row"><button class="button" data-action="save-raw">기존 저장 원문 내려받기</button></div></section>':'')+'</div><div class="stack"><section class="panel content-card"><h2>나에게 맞는 점검실</h2><div class="settings-list"><div class="setting"><label for="setting-name"><strong>기본 심사관 이름</strong></label><p>새 심사건을 만들 때 자동으로 입력합니다.</p><input id="setting-name" type="text" maxlength="100" placeholder="이름 또는 표시명" value="'+esc(workspace.settings.name)+'"></div><div class="setting"><label class="checkbox-line"><input id="setting-strict" type="checkbox" '+(workspace.settings.strictEvidence?'checked':'')+'><strong>핵심 확인 항목에 근거 입력 필수</strong></label><p>기본값은 켜짐입니다. 핵심 항목의 확인완료 기록에 문서·쪽 등의 근거가 있어야 점검을 완료할 수 있습니다. 보완필요와 해당없음의 필수 기록은 항상 적용됩니다.</p></div><div class="setting"><label class="checkbox-line"><input id="setting-motion" type="checkbox" '+(workspace.settings.reduceMotion?'checked':'')+'><strong>큐리 애니메이션 멈추기</strong></label><p>편안한 정지 화면으로 안내합니다. 운영체제의 동작 줄이기 설정도 따릅니다.</p></div></div></section><section class="panel content-card"><h2>저장 상태 확인</h2><p>'+esc(storageError||'현재 브라우저의 저장 공간을 사용하고 있습니다.')+'</p><div class="info-box">동일한 앱은 한 창에서 작업하는 것이 좋습니다. 다른 창의 저장과 충돌하면 자동 저장을 중단하고 알려드립니다.</div><button class="button small" data-action="reload-storage">저장된 데이터 다시 불러오기</button></section><section class="panel content-card"><h2>앱 정보</h2><p>큐리 심사 체크 v1.0.0<br>점검 기준 '+esc(R.version)+'<br>원문 확보일 '+esc(R.sourceDate)+'<br>모든 기능은 인터넷 연결 없이 동작합니다.</p></section></div></div>';
    const drop=$('#backup-drop');
    drop.addEventListener('click',()=>$('#backup-file').click());drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('#backup-file').click();}});
    drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag-over');});drop.addEventListener('dragleave',()=>drop.classList.remove('drag-over'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('drag-over');if(e.dataTransfer.files.length!==1){notify('JSON 백업 파일을 한 개씩 가져와 주세요.',true);return;}readBackupFile(e.dataTransfer.files[0]);});
  }
  function renderHelp(){
    view.innerHTML='<div class="page-heading"><div><div class="eyebrow">A SMALL GUIDE FOR CAREFUL WORK</div><h1>큐리와 시작하는 심사 점검</h1><p>기록을 남기며 한 항목씩 직접 확인하는 나만의 점검 노트입니다.</p></div></div><section class="hero"><div><div class="eyebrow">HELLO, EXAMINER</div><h2>꼼꼼함은 지키고, 기록은 편하게.</h2><p>큐리는 점검할 기준과 남은 기록을 안내합니다.<br>판단의 근거는 심사관님이 확인한 문서와 검토 내용으로 채워 주세요.</p><button class="button light" data-action="sample">연습용 심사건으로 익히기'+icon('arrow')+'</button></div><div class="hero-character"><div class="quri-sprite" data-quri="welcome"></div></div></section><div class="help-grid">'+[
      ['01 · 등록','출원별 점검 노트 만들기','새 심사건에서 출원번호, 점검 유형, 발명의 명칭과 청구항 수를 입력합니다. 유형에 맞는 점검 항목이 표시됩니다.'],
      ['02 · 확인','관점과 청구항별로 기록하기','기준과 원문을 읽고 확인 결과를 선택합니다. 핵심 항목에는 문서·쪽을 기록하고 보완사항은 조치 결과까지 남깁니다.'],
      ['03 · 마무리','누락 확인과 백업 저장','보완·최종확인에서 남은 항목으로 바로 이동합니다. 점검을 완료한 뒤 보고서와 JSON 백업을 저장합니다.']
    ].map(([n,t,d])=>'<section class="panel help-step"><div class="step-number">'+n+'</div><h3>'+t+'</h3><p>'+d+'</p></section>').join('')+'</div><h2 style="margin:30px 0 16px;font-size:18px">자주 묻는 질문</h2>'+[
      ['인터넷이 끊겨 있어도 사용할 수 있나요?','네. ZIP을 모두 풀고 index.html을 브라우저에서 열면 됩니다. 별도 설치, 실행 서버, API 키, 외부 글꼴, CDN이 필요하지 않습니다. 큐리 스프라이트와 규칙 원문도 폴더에 들어 있습니다.'],
      ['내 기록은 어디에 저장되나요?','현재 브라우저의 로컬 저장 공간에 자동 저장됩니다. HTML 파일이나 ZIP 내부에 자동으로 저장되지는 않습니다. 주소나 폴더 위치, 브라우저 프로필이 바뀌거나 사이트 데이터를 지우면 기존 기록이 보이지 않을 수 있으므로 전체 백업 JSON을 별도로 보관해 주세요.'],
      ['완료 버튼이 진행되지 않아요.','보완·최종확인 목록에서 미확인, 근거 누락, 해당없음 사유, 미처리 보완사항을 확인하세요. 보완필요에는 발견 내용·근거·조치와 보완 완료 표시가 필요합니다. 마지막에 직접 확인했다는 체크를 해야 점검이 완료됩니다.'],
      ['청구항이 삭제되었거나 번호가 비어 있으면요?','기본정보에 마지막 청구항 번호를 입력한 뒤, 삭제된 번호는 청구항별 점검에서 해당없음을 선택하고 삭제 사유·문서 버전을 남겨 주세요. 청구항 수를 줄이더라도 기존 기록은 보존되어 다시 늘리면 나타납니다.'],
      ['점검 유형을 변경하면 기록은 어떻게 되나요?','유형에 따라 적용되는 항목만 표시됩니다. 다른 유형에서 작성한 항목도 데이터에는 보존됩니다. 점검을 완료한 심사건은 점검 재개 후 변경할 수 있습니다. 같은 출원번호를 중복 등록하는 대신 유형과 메모를 갱신합니다.'],
      ['이 앱이 AI로 문서를 읽고 판단하나요?','이 버전은 심사관이 직접 확인하는 오프라인 체크리스트입니다. 큐리는 입력 상태에 따라 안내하며, LLM 호출이나 자동 문서 판독은 하지 않습니다. PDF·HWPX 원본은 업무 프로그램으로 확인하고 문서명·쪽·청구항을 근거로 기록하세요.'],
      ['진단기준은 어디에서 왔나요?','EQAI_sheet의 관점 구조와 AI_Reviewer의 진단코드·통지서·결정서·등록청구항 규칙을 참조했습니다. 앱의 체크 질문은 자기 점검용으로 재구성한 것입니다. 기준·규칙 사전에서 내장 원문과 확보한 커밋을 확인할 수 있으며 오프라인에서는 자동 갱신되지 않습니다.'],
      ['새 PC로 옮기거나 기록을 복원하려면요?','전체 백업 JSON과 앱 폴더를 함께 옮기세요. 새 PC에서 index.html을 열고 백업·설정의 불러오기를 사용합니다. 병합은 동일 출원번호를 건너뛰며, 전체 교체는 확인 후 백업 내용으로 작업 전체를 바꿉니다. 앱 ZIP만 복사해도 브라우저 기록이 따라가는 것은 아닙니다.'],
      ['보고서·CSV·JSON은 어떻게 다른가요?','보고서는 사람이 읽기 위한 인쇄 화면이며 브라우저에서 PDF로 저장할 수 있습니다. CSV는 목록이나 체크 결과를 표로 살펴보는 용도입니다. 다시 불러와 작업을 이어가려면 JSON 백업을 사용하세요.'],
      ['저장 오류나 다른 창 충돌 메시지가 보이면요?','현재 작업 백업을 먼저 저장하세요. 브라우저 공간이 부족하면 기존 백업을 확인한 뒤 저장 공간을 정리합니다. 다른 창 충돌이면 그 창의 작업도 백업하고, 저장된 데이터 다시 불러오기로 기준 데이터를 선택해 주세요. 자동 병합은 기존 출원번호를 덮어쓰지 않습니다.']
    ].map(([q,a])=>'<details class="faq"><summary>'+q+'</summary><p>'+a+'</p></details>').join('')+'<div class="provenance-note">이 도구는 업무 보조용 자기 점검표입니다. 내장 규칙은 원문 확보 시점의 자료이며 기관의 최신 지침·법령·공식 절차를 자동 대체하지 않습니다.</div>';
  }
  function openDialog(title,subtitle,body,footer){
    if(dialog.open)dialog.close();
    $('#dialog-content').innerHTML='<div class="dialog-head"><div><h2 id="dialog-title">'+esc(title)+'</h2>'+(subtitle?'<p>'+esc(subtitle)+'</p>':'')+'</div><button class="button subtle icon-only" data-action="close-dialog" aria-label="닫기">'+icon('close')+'</button></div><div class="dialog-body">'+body+'</div><div class="dialog-footer">'+(footer||'<button class="button" data-action="close-dialog">닫기</button>')+'</div>';
    dialog.showModal();
  }
  function closeDialog(){if(dialog.open)dialog.close();if(confirmResolver){const resolve=confirmResolver;confirmResolver=null;resolve(false);}}
  function confirmAction(title,message,label,danger){return new Promise(resolve=>{openDialog(title,'', '<div class="confirm-body">'+esc(message)+'</div>','<button class="button" data-action="confirm-no">취소</button><button class="button '+(danger?'danger':'primary')+'" data-action="confirm-yes">'+esc(label||'계속하기')+'</button>');confirmResolver=resolve;});}
  function showCaseForm(edit){
    const c=edit?getCase():null;if(c&&(c.completedAt||c.archived)){notify('점검을 재개하거나 보관을 해제한 뒤 수정해 주세요.');return;}
    openDialog(edit?'심사건 기본정보':'새 심사건 등록','출원번호와 점검 유형을 정하면 해당 기준을 안내합니다.',
      '<form id="case-form"><div id="case-form-error" class="form-error" hidden></div><div class="form-grid"><div class="form-field"><label for="form-number">출원번호 <span class="required">필수</span></label><input id="form-number" name="applicationNo" inputmode="numeric" maxlength="50" autocomplete="off" placeholder="10-2026-0000001" value="'+esc(c?.applicationNo||'')+'" required><small>특허 10 또는 실용신안 20으로 시작하는 13자리</small></div><div class="form-field"><label for="form-type">이번 점검 유형</label><select id="form-type" name="type">'+Object.entries(TYPE).map(([key,name])=>'<option value="'+key+'" '+(c?.type===key?'selected':'')+'>'+name+'</option>').join('')+'</select><small>유형에 따라 적용할 항목이 달라집니다.</small></div><div class="form-field full"><label for="form-title">발명의 명칭</label><input id="form-title" name="title" maxlength="500" placeholder="심사건을 알아보기 쉬운 명칭" value="'+esc(c?.title||'')+'"></div><div class="form-field"><label for="form-examiner">심사관</label><input id="form-examiner" name="examiner" maxlength="100" placeholder="이름 또는 표시명" value="'+esc(c?.examiner||workspace.settings.name)+'"></div><div class="form-field"><label for="form-date">점검 예정일</label><input id="form-date" name="dueDate" type="date" value="'+esc(c?.dueDate||'')+'"></div><div class="form-field"><label for="form-claims">마지막 청구항 번호</label><input id="form-claims" name="claimCount" type="number" min="0" max="200" step="1" value="'+(c?.claimCount||0)+'"><small>0이면 청구항별 표를 만들지 않습니다. 최대 200. 삭제된 번호는 해당없음으로 기록합니다.</small></div><div class="form-field"><label>진행 방식</label><div class="info-box" style="margin:0">관점별 점검 → 보완·최종확인 → 점검완료</div></div></div></form>',
      '<button class="button" data-action="close-dialog">취소</button><button class="button primary" data-action="save-case-form" data-edit="'+(edit?'yes':'no')+'">'+(edit?'변경 저장':'점검 시작하기')+icon('arrow')+'</button>');
    setTimeout(()=>$('#form-number')?.focus(),30);
    $('#case-form').addEventListener('submit',e=>{e.preventDefault();saveCaseForm(edit);});
  }
  function saveCaseForm(edit){
    const form=$('#case-form');if(!form||!form.reportValidity())return;
    const input=Object.fromEntries(new FormData(form).entries());
    try {
      const record=C.createCase(input);const existing=edit?getCase():null;
      if(edit&&!existing)throw Error('다른 창에서 이 심사건이 삭제되었습니다. 최신 목록을 확인해 주세요.');
      if(existing&&(existing.completedAt||existing.archived))throw Error('이 심사건이 완료 또는 보관되어 수정할 수 없습니다. 점검을 재개하거나 보관을 해제해 주세요.');
      if(workspace.cases.some(c=>c.applicationNo===record.applicationNo&&c.id!==existing?.id))throw Error('이 출원번호는 이미 등록되어 있습니다. 기존 심사건을 열어 주세요.');
      if(!edit&&workspace.cases.length>=2000)throw Error('최대 2,000건을 등록할 수 있습니다.');
      let c;
      if(existing){
        c=existing;const oldType=c.type;['applicationNo','title','examiner','dueDate','type','claimCount'].forEach(k=>c[k]=record[k]);
        event(c,'metadata',oldType===c.type?'기본정보를 수정했습니다.':'점검 유형을 '+TYPE[oldType]+'에서 '+TYPE[c.type]+'으로 변경했습니다. 이전 항목의 기록은 보존됩니다.');
      }else{c=record;event(c,'created','심사건을 등록했습니다. '+TYPE[c.type]+' 점검을 시작합니다.');workspace.cases.push(c);}
      caseId=c.id;categoryId='';changed(c,true);closeDialog();
      if(route==='case'&&location.hash==='#case/'+c.id)render();else setRoute('case/'+c.id);
      notify(edit?'기본정보를 저장했습니다.':'심사건을 등록했습니다. 첫 관점부터 확인해 주세요.');
    }catch(error){const el=$('#case-form-error');el.textContent=error.message;el.hidden=false;}
  }
  function sourceDialog(id){
    const ref=R.references.find(r=>r.id===id);
    if(!ref){notify('해당 원문은 원문·출처 탭에서 확인해 주세요.');ruleTab='sources';setRoute('rules');return;}
    openDialog(ref.title||id,ref.source||id,'<div class="tiny muted" style="margin-bottom:14px">참조 ID: '+esc(ref.id)+' · 원문 확보일: '+esc(R.sourceDate)+'</div><pre class="source-text">'+esc(ref.text)+'</pre>');
  }
  function codeDialog(code){
    const row=R.codebook.find(x=>x.code===code);if(!row)return;
    openDialog('진단코드 '+code,row.category||'진단코드 원문','<h3 style="margin-bottom:12px">'+esc(row.title)+'</h3><div class="source-text">'+esc(row.description)+'</div><div class="info-box">체크 항목에 연결된 코드는 참고 후보입니다. 원문의 적용 조건과 해당 출원의 구체적 사정을 함께 확인해야 합니다.</div>','<button class="button" data-action="show-source" data-source="codes">전체 코드 원문</button><button class="button primary" data-action="close-dialog">확인</button>');
  }
  function download(contents,name,mime){
    const blob=contents instanceof Blob?contents:new Blob([contents],{type:mime||'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  }
  function backupAll(oneCase){
    persist();
    try{
      const target=oneCase?Object.assign({},workspace,{cases:[oneCase]}):workspace;
      download(C.encodeBackup(target),'QURI_'+(oneCase?oneCase.applicationNo+'_':'')+'backup_'+fileDate()+'.json');
      notify('백업 파일을 내려받았습니다. 브라우저의 다운로드 위치를 확인해 주세요.');
      return true;
    }catch(error){notify('백업 실패: '+error.message,true);return false;}
  }
  async function readBackupFile(file){
    if(!file)return;
    if(file.size>32*1024*1024){notify('32 MiB 이하의 JSON 백업 파일을 선택해 주세요.',true);return;}
    try{
      importWorkspace=C.decodeBackup(await file.text(),R);
      const duplicates=importWorkspace.cases.filter(c=>workspace.cases.some(old=>old.applicationNo===c.applicationNo)).length;
      openDialog('백업 내용 확인',file.name,'<p class="confirm-body">'+importWorkspace.cases.length+'개 심사건이 들어 있습니다.\n현재 작업과 같은 출원번호: '+duplicates+'개\n새롭게 추가할 수 있는 출원: '+(importWorkspace.cases.length-duplicates)+'개</p><div class="info-box">병합하면 같은 출원번호의 기존 기록은 그대로 유지됩니다. 해당 출원을 백업 상태로 되돌리려면 전체 교체를 선택하세요.</div>'+(recovery?'<div class="info-box amber">현재 자동 저장 원문을 읽을 수 없어 복구 모드입니다. 기존 원문이 있으면 먼저 내려받아 보관하세요. 전체 교체를 확인하면 정상 백업으로 복구합니다.</div>':''),'<button class="button" data-action="close-dialog">취소</button><button class="button danger" data-action="import-replace">전체 교체</button><button class="button primary" data-action="import-merge" '+(recovery||conflict?'disabled':'')+'>새 출원만 병합</button>');
    }catch(error){importWorkspace=null;notify(error.message,true);}
    $('#backup-file').value='';
  }
  async function applyImport(replace){
    if(!importWorkspace)return;const incoming=importWorkspace;
    if(replace){
      const answer=await confirmAction('현재 작업을 백업 내용으로 교체할까요?','현재 '+workspace.cases.length+'개 심사건 전체를 가져온 '+incoming.cases.length+'개 심사건으로 교체합니다.\n계속하면 교체 전 현재 작업 백업을 먼저 내려받습니다. 기존 원문이 손상된 경우에는 해당 원문도 함께 보관합니다.','백업 후 전체 교체',true);
      if(!answer)return;
      if(conflict){notify('다른 창의 저장 충돌을 먼저 해결해 주세요. 현재 작업을 백업하고 저장된 데이터를 다시 불러오면 됩니다.',true);return;}
      try{
        download(C.encodeBackup(workspace),'QURI_before_replace_'+fileDate()+'.json');
        if(recoveryRaw&&recovery)download(recoveryRaw,'QURI_unreadable_storage_'+fileDate()+'.txt','text/plain;charset=utf-8');
        const next=C.validateWorkspace(incoming,R);next.revision=workspace.revision;
        if(memoryOnly){workspace=next;dirty=true;importWorkspace=null;closeDialog();render();notify('백업을 화면에 불러왔습니다. 자동 저장이 되지 않으므로 작업 후 JSON 백업을 저장해 주세요.');return;}
        const result=recovery?storage.recover(next,recoveryRaw):storage.save(next,workspace.revision);
        if(!result.ok){storageError=result.error;conflict=Boolean(result.conflict);saveBadge();notify(result.error,true);return;}
        workspace=result.workspace;recovery=false;recoveryRaw=null;storageError=null;dirty=false;importWorkspace=null;closeDialog();route='backup';render();notify('백업 내용으로 전체 작업을 복구했습니다.');
      }catch(error){notify(error.message,true);}
    }else{
      try{
        if(!memoryOnly&&dirty&&!persist()){notify('현재 자동 저장 문제를 해결한 뒤 병합해 주세요.',true);return;}
        const result=C.mergeWorkspaces(workspace,incoming);
        if(memoryOnly){workspace=result.workspace;dirty=true;importWorkspace=null;closeDialog();render();notify(result.added+'개 출원을 화면에 추가했습니다. 작업 후 JSON 백업을 저장해 주세요.');return;}
        const saved=storage.save(result.workspace,workspace.revision);
        if(!saved.ok){storageError=saved.error;conflict=Boolean(saved.conflict);saveBadge();notify(saved.error,true);return;}
        workspace=saved.workspace;dirty=false;storageError=null;importWorkspace=null;closeDialog();render();notify(result.added+'개 출원을 추가했습니다. 동일 출원번호 '+result.skipped+'개는 기존 기록을 유지했습니다.');
      }catch(error){notify(error.message,true);}
    }
  }
  function exportCsv(c){
    const rows=c?[['출원번호','점검유형','관점','항목ID','확인질문','진단코드 참고','점검결과','근거','관련청구항','메모 또는 해당없음 사유','보완조치','보완완료'],...C.applicableItems(c,R).map(item=>{const r=c.responses[item.id]||C.blankResponse();return [c.applicationNo,TYPE[c.type],item.categoryTitle,item.id,item.question||item.title,item.codeRefs.join(', '),STATUS[r.status],r.evidence,r.claims,r.memo,r.action,r.resolved?'예':'아니요'];}),...Array.from({length:c.claimCount},(_,i)=>{const n=i+1,r=c.claimReviews[n]||C.blankResponse();return [c.applicationNo,TYPE[c.type],'청구항별 점검','claim:'+n,'청구항 '+n,'',STATUS[r.status],r.evidence,r.claims,r.memo,r.action,r.resolved?'예':'아니요'];})]:[['출원번호','발명의 명칭','심사관','점검유형','상태','관점별 기록완료','관점별 적용항목','청구항 기록완료','청구항 수','미처리 보완항목','미확인','점검예정일','최근수정','점검완료일'],...workspace.cases.map(entry=>{const p=getProgress(entry);return [entry.applicationNo,entry.title,entry.examiner,TYPE[entry.type],displayStatus(entry,p)[0],p.ready,p.total,p.claimReady,p.claimTotal,p.unresolved,p.pending+p.claimPending,entry.dueDate,entry.updatedAt,entry.completedAt||''];})];
    download('\ufeff'+rows.map(row=>row.map(C.escapeCsv).join(',')).join('\r\n'),'QURI_'+(c?c.applicationNo+'_checklist':'case_list')+'_'+fileDate()+'.csv','text/csv;charset=utf-8');notify('CSV 파일을 내려받았습니다. 복원용 파일은 JSON 백업을 사용해 주세요.');
  }
  function printReport(){
    const c=getCase();if(!c)return;persist();const p=getProgress(c);
    const block=(item,r)=>'<section class="print-item"><h3>'+esc(item.id)+' · '+esc(item.question||item.title)+'</h3><p class="print-status">'+STATUS[r.status]+(r.status==='issue'?(r.resolved?' / 보완 완료 표시':' / 보완 미완료'):'')+'</p><p class="print-meta">관련 코드: '+esc((item.codeRefs||[]).join(', ')||'—')+'</p>'+[['확인 근거',r.evidence],['관련 청구항',r.claims],['메모·해당없음 사유',r.memo],['보완 조치',r.action]].filter(x=>x[1]).map(([label,value])=>'<p class="print-note"><strong>'+label+':</strong> '+esc(value)+'</p>').join('')+'</section>';
    $('#print-area').innerHTML='<h1>심사 자기점검 기록</h1><h2>'+esc(c.applicationNo)+'</h2><div class="print-meta">발명의 명칭: '+esc(c.title||'미입력')+'\n점검 유형: '+TYPE[c.type]+' · 심사관: '+esc(c.examiner||'미입력')+'\n예정일: '+esc(c.dueDate||'미입력')+' · 출력일: '+dateTime(C.now())+'\n상태: '+displayStatus(c,p)[0]+' · 완료일: '+dateTime(c.completedAt)+'\n관점별 기록 완료: '+p.ready+'/'+p.total+' · 청구항별 기록 완료: '+p.claimReady+'/'+p.claimTotal+'\n내장 기준: '+esc(R.version)+' · 원문 확보일: '+esc(R.sourceDate)+'</div>'+(p.blockers.length?'<h2>완료 전 남은 확인 '+p.blockers.length+'건</h2>'+p.blockers.map(b=>'<p>'+esc(b.title)+': '+esc(b.message)+'</p>').join(''):'')+R.categories.map(cat=>{const items=C.applicableItems(c,R).filter(x=>x.categoryId===cat.id);return items.length?'<h2>'+esc(cat.title)+'</h2>'+items.map(item=>block(item,c.responses[item.id]||C.blankResponse())).join(''):'';}).join('')+(c.claimCount?'<h2>청구항별 점검</h2>'+Array.from({length:c.claimCount},(_,i)=>block({id:'청구항 '+(i+1),title:'개별 청구항 검토'},c.claimReviews[i+1]||C.blankResponse())).join(''):'')+'<h2>종합 메모</h2><p class="print-note">'+esc(c.notes||'기록 없음')+'</p><h2>주요 변경 이력</h2>'+c.events.slice(-50).map(e=>'<p class="print-meta">'+dateTime(e.at)+' · '+esc(e.message)+'</p>').join('')+'<p class="print-meta" style="margin-top:8mm">체크 질문은 내장 원문을 바탕으로 재구성한 자기 점검 안내입니다. 진단코드는 참고 후보이며 자동 부여되지 않습니다. 이 기록의 완료는 기관의 공식 결재 또는 법적 결론 확정을 의미하지 않습니다.</p>';
    window.print();
  }
  function selectCategory(id){categoryId=id;itemFilter='all';renderCase();mountSprites();$('#checklist-main')?.scrollIntoView({behavior:'instant',block:'start'});}
  function jumpTo(id,category){
    if(id.startsWith('claim:')){selectedClaim=Number(id.slice(6));categoryId='claims';}else categoryId=category;
    itemFilter='all';renderCase();mountSprites();
    const el=document.getElementById(id.startsWith('claim:')?'claim-'+id.slice(6):'item-'+id);if(el){el.scrollIntoView({behavior:workspace.settings.reduceMotion?'instant':'smooth',block:'center'});el.classList.add('flash');const b=$('button.status-option',el);b?.focus({preventScroll:true});}
  }
  function updateResponse(id,status,claim){
    const c=getCase();if(!c||c.completedAt||c.archived)return;
    const map=claim?c.claimReviews:c.responses,r=map[id]||C.blankResponse();const old=r.status;r.status=status;if(old!==status)r.resolved=false;r.updatedAt=C.now();map[id]=r;
    if(old!==status)event(c,'response',(claim?'청구항 '+id:id)+' · '+STATUS[old]+' → '+STATUS[status]);
    changed(c,true);
    const current=getCase();
    if(claim){renderClaims(current,$('#checklist-main'));}
    else{
      const item=ruleItems.find(x=>x.id===id),el=document.getElementById('item-'+id);if(item&&el){const wasOpen=$('details',el)?.open;el.outerHTML=checkCard(current,item,getProgress(current));const fresh=document.getElementById('item-'+id);if(wasOpen)$('details',fresh).open=true;const focus=status==='na'?$('[data-response-field="memo"]',fresh):status==='pending'?$('[data-status="pending"]',fresh):$('[data-response-field="evidence"]',fresh);focus?.focus({preventScroll:true});}
    }
    refreshProgress();
    const guide=$('#quri-guide');
    if(guide){
      const detail={pending:['확인 방법부터 살펴볼까요?','기준과 원문을 읽은 뒤 실제 문서에서 확인한 결과를 골라 주세요.','thinking'],pass:['확인한 근거도 남겨 주세요','문서 이름과 쪽, 관련 청구항을 적어 두면 다음에 다시 살펴볼 때 편해요.','review'],issue:['보완할 점을 함께 정리해요','발견한 내용과 근거를 적고, 조치 후 처리 결과와 보완 완료 표시를 남겨 주세요.','attention'],na:['적용하지 않는 이유를 남겨요','해당없음의 사유를 한 줄 이상 남겨야 이 항목의 필수 기록이 완료됩니다.','thinking']}[status];
      $('h3',guide).textContent=detail[0];$('p',guide).textContent=detail[1];sprites.forEach(s=>s.setState(detail[2]));
    }
  }
  async function finalize(){
    const c=getCase();if(!c||c.archived||c.completedAt)return;
    const p=getProgress(c);
    if(p.blockers.length){notify('아직 '+new Set(p.blockers.map(x=>x.itemId)).size+'개 항목에 추가 확인이 필요합니다.',true);return;}
    if(!$('#final-ack')?.checked){notify('대상 문서와 최종 청구범위를 직접 확인했다는 표시를 해 주세요.',true);$('#final-ack')?.focus();return;}
    c.completedAt=C.now();event(c,'completed','모든 필수 기록과 최종 확인을 마치고 이번 점검을 완료했습니다.');changed(c,true);renderCase();mountSprites();notify('점검을 완료했습니다. 보고서와 백업 파일로 기록을 남겨 주세요.');
  }
  async function resumeCase(){
    const c=getCase();if(!c)return;
    if(await confirmAction('점검을 다시 시작할까요?','기존 확인 내용과 근거를 그대로 두고 수정할 수 있도록 엽니다. 완료 이력은 남습니다.','점검 재개')){
      c.completedAt=null;event(c,'reopened','완료된 점검을 재개했습니다.');changed(c,true);renderCase();mountSprites();notify('점검을 재개했습니다.');
    }
  }
  function caseMenu(){const c=getCase();openDialog('심사건 관리',c.applicationNo,'<div class="stack"><button class="button" data-action="backup-case">'+icon('download')+'이 심사건 JSON 백업</button><button class="button" data-action="csv-case">'+icon('file')+'이 심사건 체크 결과 CSV</button><button class="button" data-action="'+(c.archived?'unarchive':'archive')+'">'+icon('archive')+(c.archived?'보관 해제':'보관함으로 이동')+'</button>'+(c.archived?'<button class="button danger" data-action="delete-case">백업 후 이 심사건 삭제</button>':'')+'</div>');}
  async function archiveCase(remove){const c=getCase();if(!c)return;if(remove){c.archived=false;event(c,'unarchived','보관함에서 꺼냈습니다.');changed(c,true);closeDialog();renderCase();mountSprites();notify('보관을 해제했습니다.');}else if(await confirmAction('보관함으로 옮길까요?','점검 기록은 그대로 보존되고 관리 중인 목록에서 제외됩니다. 언제든 보관함에서 다시 꺼낼 수 있습니다.','보관함으로 이동')){c.archived=true;event(c,'archived','보관함으로 이동했습니다.');changed(c,true);renderCase();mountSprites();notify('보관함으로 이동했습니다.');}}
  async function deleteCase(){const c=getCase();if(!c||!c.archived)return;if(await confirmAction('이 심사건을 삭제할까요?',c.applicationNo+'의 모든 점검 기록을 현재 브라우저에서 삭제합니다. 삭제 전 이 심사건의 JSON 백업을 내려받습니다.','백업 후 삭제',true)){if(!backupAll(c)){notify('백업을 만들지 못해 삭제를 중단했습니다. 기존 기록을 유지합니다.',true);return;}workspace.cases=workspace.cases.filter(x=>x.id!==c.id);changed(null,true);closeDialog();setRoute('dashboard');notify('심사건을 삭제했습니다. 내려받은 백업을 보관해 주세요.');}}
  function createSample(){
    const number='10-2026-0000000';const exists=workspace.cases.find(c=>c.applicationNo===number);if(exists){setRoute('case/'+exists.id);return;}
    const c=C.createCase({applicationNo:number,title:'[연습용] 센서 신호를 이용한 상태 모니터링 장치',type:'notice',claimCount:3,examiner:workspace.settings.name||'연습 심사관'});
    const items=C.applicableItems(c,R);items.slice(0,3).forEach(item=>{c.responses[item.id]={...C.blankResponse(),status:'pass',evidence:'연습 자료: 명세서 1~3쪽, 청구항 1~3',memo:'가상 연습 데이터입니다. 실제 심사 결과가 아닙니다.'};});
    if(items[3])c.responses[items[3].id]={...C.blankResponse(),status:'issue',memo:'연습: 검토 대상 문서의 최종 버전을 추가 확인해야 합니다.',evidence:'연습 자료: 문서 목록 1쪽',action:'최종 보정서 날짜와 청구범위를 다시 대조할 예정입니다.'};
    c.notes='이 출원번호와 기록은 앱 사용법을 설명하기 위한 가상 연습 데이터입니다. 실제 출원에 대한 판단이 아닙니다. 사용법을 익힌 뒤 보관함으로 이동하거나 삭제하세요.';
    event(c,'created','가상 연습용 심사건을 만들었습니다.');workspace.cases.push(c);changed(c,true);setRoute('case/'+c.id);notify('가상 연습용 심사건입니다. 자유롭게 체크해 보세요.');
  }
  async function reloadStorage(){
    const yes=await confirmAction('저장된 데이터를 다시 불러올까요?','현재 화면의 작업을 백업 파일로 먼저 내려받고, 브라우저에 저장된 최신 데이터를 불러옵니다. 다른 창에서 저장한 내용을 확인할 때 사용하세요.','백업 후 다시 불러오기');if(!yes)return;
    try{download(C.encodeBackup(workspace),'QURI_before_reload_'+fileDate()+'.json');}catch(error){notify('현재 작업 백업을 만들지 못해 중단했습니다. '+error.message,true);return;}
    clearTimeout(saveTimer);const result=storage.load();
    if(result.recovery&&result.raw===null){memoryOnly=true;recovery=false;storageError=result.error;dirty=true;render();notify('자동 저장을 사용할 수 없어 현재 화면의 작업을 유지합니다. JSON 백업으로 계속 작업할 수 있습니다.',true);return;}
    workspace=result.workspace;memoryOnly=false;recovery=result.recovery;recoveryRaw=result.raw;storageError=result.error;conflict=false;dirty=false;render();notify(result.error||'저장된 최신 데이터를 불러왔습니다.',Boolean(result.error));
  }
  document.addEventListener('click',async e=>{
    const button=e.target.closest('[data-action]');if(!button||button.disabled)return;
    const action=button.dataset.action;
    try{
      if(action==='new-case')showCaseForm(false);
      else if(action==='edit-case')showCaseForm(true);
      else if(action==='save-case-form')saveCaseForm(button.dataset.edit==='yes');
      else if(action==='open-case')setRoute('case/'+button.dataset.id);
      else if(action==='resume-case'){const cases=workspace.cases.filter(c=>!c.archived).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));const c=cases.find(c=>!fullyComplete(c))||cases[0];if(c)setRoute('case/'+c.id);else showCaseForm(false);}
      else if(action==='category')selectCategory(button.dataset.category);
      else if(action==='item-filter'){itemFilter=button.dataset.filter;renderChecklist();}
      else if(action==='item-status')updateResponse(button.dataset.id,button.dataset.status,false);
      else if(action==='claim-status')updateResponse(button.dataset.id,button.dataset.status,true);
      else if(action==='select-claim'){selectedClaim=Number(button.dataset.claim);renderClaims(getCase(),$('#checklist-main'));}
      else if(action==='claim-prev'){selectedClaim=Math.max(1,selectedClaim-1);renderClaims(getCase(),$('#checklist-main'));}
      else if(action==='claim-next'){if(selectedClaim<getCase().claimCount){selectedClaim++;renderClaims(getCase(),$('#checklist-main'));}else selectCategory('review');}
      else if(action==='category-next'||action==='category-prev'){const c=getCase(),ids=getProgress(c).categories.map(x=>x.id).concat(['claims','notes','review']),index=ids.indexOf(categoryId),next=Math.max(0,Math.min(ids.length-1,index+(action==='category-next'?1:-1)));selectCategory(ids[next]);}
      else if(action==='jump-item')jumpTo(button.dataset.id,button.dataset.category);
      else if(action==='next-pending'){const p=getProgress(getCase());if(p.blockers.length)jumpTo(p.blockers[0].itemId,p.blockers[0].categoryId);else selectCategory('review');}
      else if(action==='show-source')sourceDialog(button.dataset.source);
      else if(action==='show-code')codeDialog(button.dataset.code);
      else if(action==='rule-tab'){ruleTab=button.dataset.tab;renderRules();}
      else if(action==='close-dialog')closeDialog();
      else if(action==='confirm-yes'||action==='confirm-no'){const resolve=confirmResolver;confirmResolver=null;dialog.close();if(resolve)resolve(action==='confirm-yes');}
      else if(action==='backup-all')backupAll();
      else if(action==='backup-case'){backupAll(getCase());closeDialog();}
      else if(action==='csv-all')exportCsv();
      else if(action==='csv-case'){exportCsv(getCase());closeDialog();}
      else if(action==='report')printReport();
      else if(action==='open-backup')setRoute('backup');
      else if(action==='import')$('#backup-file').click();
      else if(action==='import-merge')await applyImport(false);
      else if(action==='import-replace')await applyImport(true);
      else if(action==='reload-storage')await reloadStorage();
      else if(action==='save-raw'&&recoveryRaw!==null)download(recoveryRaw,'QURI_unreadable_storage_'+fileDate()+'.txt','text/plain;charset=utf-8');
      else if(action==='complete')await finalize();
      else if(action==='reopen')await resumeCase();
      else if(action==='case-menu')caseMenu();
      else if(action==='archive')await archiveCase(false);
      else if(action==='unarchive')await archiveCase(true);
      else if(action==='delete-case')await deleteCase();
      else if(action==='sample')createSample();
      else if(action==='clear-filters'){listQuery='';listFilter='active';listType='';renderDashboard();mountSprites();}
    }catch(error){notify('작업 중 오류가 발생했습니다. '+error.message,true);}
  });
  document.addEventListener('input',e=>{
    const el=e.target;
    if(el.id==='case-search'){listQuery=el.value;renderCaseResults();return;}
    if(el.id==='rule-search'){ruleQuery=el.value;renderRuleResults();return;}
    if(el.id==='setting-name'){workspace.settings.name=el.value;changed(null,false);return;}
    const c=getCase();
    if(el.id==='case-notes'&&c&&!c.completedAt&&!c.archived){c.notes=el.value;changed(c,false);return;}
    const claim=el.hasAttribute('data-claim-field'),field=claim?el.dataset.claimField:el.dataset.responseField;
    if(!field||!c||c.completedAt||c.archived)return;
    const id=el.dataset.id,map=claim?c.claimReviews:c.responses,r=map[id]||C.blankResponse();
    r[field]=el.type==='checkbox'?el.checked:el.value;r.updatedAt=C.now();map[id]=r;changed(c,false);
    clearTimeout(liveTimer);liveTimer=setTimeout(refreshProgress,180);
  });
  document.addEventListener('change',async e=>{
    const el=e.target;
    if(el.id==='case-filter'){listFilter=el.value;renderCaseResults();}
    else if(el.id==='type-filter'){listType=el.value;renderCaseResults();}
    else if(el.id==='setting-motion'){workspace.settings.reduceMotion=el.checked;changed(null,true);QuriSprite.setPaused(el.checked);document.body.classList.toggle('reduce-motion',el.checked);notify(el.checked?'큐리 애니메이션을 멈췄습니다.':'큐리 애니메이션을 켰습니다.');}
    else if(el.id==='setting-strict'){
      const value=el.checked;
      const yes=await confirmAction('핵심 항목의 근거 설정을 바꿀까요?',value?'핵심 항목의 확인완료에 근거가 필요해집니다. 기존 완료 기록에 근거가 없으면 재확인 필요로 표시됩니다.':'핵심 항목의 확인완료를 근거 없이 기록할 수 있습니다. 꼼꼼한 추적을 위해 근거를 남기는 것을 권장합니다. 보완필요·해당없음의 필수 기록은 유지됩니다.','설정 변경');
      if(yes){workspace.settings.strictEvidence=value;changed(null,true);}else el.checked=workspace.settings.strictEvidence;
    }else if(el.id==='backup-file')readBackupFile(el.files[0]);
  });
  dialog.addEventListener('cancel',()=>{if(confirmResolver){const resolve=confirmResolver;confirmResolver=null;resolve(false);}});
  window.addEventListener('hashchange',readRoute);
  window.addEventListener('beforeunload',e=>{persist();if(dirty){e.preventDefault();e.returnValue='';}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();});
  window.addEventListener('storage',e=>{
    if(e.key!==C.STORAGE_KEY||memoryOnly)return;
    if(dirty){conflict=true;storageError='다른 창에서 저장했습니다. 현재 화면의 기록을 백업하고 최신 저장 내용을 다시 불러와 주세요.';saveBadge();}
    else {const data=storage.load();if(!data.error){workspace=data.workspace;recovery=false;storageError=null;render();notify('다른 창에서 저장한 최신 내용을 반영했습니다.');}else{recovery=true;recoveryRaw=data.raw;storageError=data.error;saveBadge();}}
  });
  saveBadge();updateNavCount();readRoute();
})();
