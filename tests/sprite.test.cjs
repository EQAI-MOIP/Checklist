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
player.setPaused(true);assert.equal(timers.size,0);assert.equal(element.dataset.quriPlaying,'false');
player.setPaused(false);assert.equal(timers.size,1);
doc.hidden=true;docEvents.visibilitychange();assert.equal(timers.size,0);
doc.hidden=false;docEvents.visibilitychange();assert.equal(timers.size,1);
media.matches=true;mediaChanged();assert.equal(timers.size,0);assert.equal(element.dataset.quriFrame,'0');
media.matches=false;mediaChanged();assert.equal(timers.size,1);
observers[0].callback([{target:element,isIntersecting:false}]);assert.equal(timers.size,0);
observers[0].callback([{target:element,isIntersecting:true}]);assert.equal(timers.size,1);
player.setState('attention');assert.equal(timers.size,0);
player.setState('success');assert.equal(timers.size,1);
const reattached=context.QuriSprite.attach(element,{state:'save'});assert.ok(player.dead);assert.equal(timers.size,1);
context.QuriSprite.setPaused(true);assert.equal(timers.size,0);
context.QuriSprite.setPaused(false);assert.equal(timers.size,1);
context.QuriSprite.pose(element,'compare');assert.ok(reattached.dead);assert.equal(timers.size,0);assert.equal(element.style.backgroundSize,'300% 200%');assert.equal(element.style.backgroundPosition,'100% 0%');
const detached=el();const orphan=context.QuriSprite.attach(detached,{state:'review'});detached.isConnected=false;tick();assert.ok(orphan.dead);assert.equal(timers.size,0);
assert.throws(()=>context.QuriSprite.attach(null),/HTML element/);
console.log('PASS: sprite frame sequence, state rows, pause, reduced motion, visibility, offscreen, reattach, static pose, detached element cleanup.');
