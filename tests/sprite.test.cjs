'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const timers = new Map();
const docEvents = {};
let id = 0, mediaChanged;
const media = { matches: false, addEventListener(_,fn) { mediaChanged=fn; } };
const doc = { hidden: false, currentScript:{src:'file:///app/js/quri-sprite.js'}, addEventListener(e,fn){docEvents[e]=fn;} };
const observers=[];
const context = {
 document:doc, URL, Set, WeakMap, Object, TypeError, Boolean, String,
 matchMedia(){return media;},
 setTimeout(fn){timers.set(++id,fn);return id;}, clearTimeout(n){timers.delete(n);},
 IntersectionObserver: class {
  constructor(callback){this.callback=callback;observers.push(this);}
  observe(el){this.element=el;} disconnect(){this.disconnected=true;}
 }
};
context.window=context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../js/quri-sprite.js'),'utf8'),context);
function el(){return {style:{},dataset:{},isConnected:true,attrs:{},getAttribute(k){return this.attrs[k];},setAttribute(k,v){this.attrs[k]=v;}};}
function tick(){const first=timers.entries().next().value;assert.ok(first,'Expected scheduled frame');timers.delete(first[0]);first[1]();}
const element=el();
const player=context.QuriSprite.attach(element,{state:'welcome'});
assert.match(element.style.backgroundImage,/file:\/\/\/app\/assets\/quri-v3-motion-16frames.webp/);
assert.equal(element.dataset.quriFrame,'0');
for(const frame of [1,2,3,2,1,0]) {tick();assert.equal(element.dataset.quriFrame,String(frame));}
player.setState('thinking');
assert.equal(element.style.backgroundPosition,'0% 66.66666666666667%');
for (const [state,row,action,label] of [
 ['document',2,'reading','원문과 문서의 판본'],
 ['compare',2,'reading','청구항과 인용문헌'],
 ['evidence',1,'point','근거로 기록'],
 ['decision',1,'point','보완 조치'],
 ['complete',3,'complete','기록을 마친']
]) {
 player.setState(state);
 assert.equal(element.dataset.quriState,state);
 assert.equal(element.dataset.quriAction,action);
 assert.equal(element.dataset.quriAtlas,'motion');
 assert.equal(element.dataset.quriRow,String(row));
 assert.ok(element.attrs['aria-label'].includes(label));
 assert.equal(element.dataset.quriFrame,'0');
 assert.equal(timers.size,1,'Changing context must not accumulate timers');
 tick();assert.equal(element.dataset.quriFrame,'1');
}
player.setPaused(true);assert.equal(timers.size,0);assert.equal(element.dataset.quriPlaying,'false');
player.setState('document');assert.equal(timers.size,0);assert.equal(element.dataset.quriFrame,'0');
player.setPaused(false);assert.equal(timers.size,1);
doc.hidden=true;docEvents.visibilitychange();assert.equal(timers.size,0);
player.setState('compare');assert.equal(timers.size,0);assert.equal(element.dataset.quriPlaying,'false');
doc.hidden=false;docEvents.visibilitychange();assert.equal(timers.size,1);
media.matches=true;mediaChanged();assert.equal(timers.size,0);assert.equal(element.dataset.quriFrame,'0');
player.setState('evidence');assert.equal(timers.size,0);assert.equal(element.dataset.quriFrame,'0');
media.matches=false;mediaChanged();assert.equal(timers.size,1);
observers[0].callback([{target:element,isIntersecting:false}]);assert.equal(timers.size,0);
observers[0].callback([{target:element,isIntersecting:true}]);assert.equal(timers.size,1);
player.setState('attention');assert.equal(timers.size,0);
player.setState('success');assert.equal(timers.size,1);
const reattached=context.QuriSprite.attach(element,{state:'save'});assert.ok(player.dead);assert.equal(timers.size,1);
context.QuriSprite.setPaused(true);assert.equal(timers.size,0);
reattached.setState('decision');assert.equal(timers.size,0);
context.QuriSprite.setPaused(false);assert.equal(timers.size,1);
context.QuriSprite.pose(element,'compare');assert.ok(reattached.dead);assert.equal(timers.size,0);assert.equal(element.style.backgroundSize,'300% 200%');assert.equal(element.style.backgroundPosition,'100% 0%');
assert.equal(element.dataset.quriAtlas,'guide');assert.equal(element.dataset.quriAction,'pose');
for (const [name,col,row] of [
 ['documents',0,0],['claims',1,0],['compare-notices',2,0],
 ['finding',0,1],['no-findings',1,1],['missing-documents',2,1]
]) {
 const previous=context.QuriSprite.attach(element,{state:'document'});
 context.QuriSprite.pose(element,name);
 assert.ok(previous.dead,'A contextual pose must stop the prior animation');
 assert.match(element.style.backgroundImage,/file:\/\/\/app\/assets\/review-states-6frames.webp/);
 assert.equal(element.style.backgroundPosition,(col*50)+'% '+(row*100)+'%');
 assert.equal(element.dataset.quriState,name);
 assert.equal(element.dataset.quriAtlas,'review');
 assert.equal(element.dataset.quriFrame,String(col));
 assert.equal(element.dataset.quriRow,String(row));
 assert.equal(element.dataset.quriPlaying,'false');
 assert.equal(timers.size,0);
}
const decorative=el();decorative.attrs['aria-hidden']='true';
const decoration=context.QuriSprite.attach(decorative,{state:'evidence'});
assert.equal(decorative.attrs['aria-label'],undefined);
assert.equal(decorative.attrs.role,undefined);
decoration.destroy();assert.equal(timers.size,0);
const detached=el();const orphan=context.QuriSprite.attach(detached,{state:'review'});detached.isConnected=false;tick();assert.ok(orphan.dead);assert.equal(timers.size,0);
assert.throws(()=>context.QuriSprite.attach(null),/HTML element/);
console.log('PASS: sprite frame sequence, contextual states and labels, pause across contexts, reduced motion, visibility, offscreen, reattach, six review poses, decorative accessibility, detached element cleanup.');
