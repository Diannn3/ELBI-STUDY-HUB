const assert = require('assert');
const timer = require('../../.tmp-domain/features/focus/domain/timerMachine.js');
const derive = require('../../.tmp-domain/features/focus/domain/deriveTimer.js');
const stats = require('../../.tmp-domain/features/history/stats.js');
const conflicts = require('../../.tmp-domain/sync/conflicts.js');
const serialize = require('../../.tmp-domain/sync/serialize.js');
let n=0; function test(name,fn){try{fn();console.log('PASS',name);n++}catch(e){console.error('FAIL',name,e);process.exitCode=1}}
test('25:00 -> 24:59 from absolute time',()=>{const t=timer.createTimer({id:'x',mode:'pomodoro25',now:1000});assert.equal(derive.formatClock(derive.deriveTimer(t,2000).remainingMs),'24:59')});
test('pause freezes elapsed',()=>{const t=timer.createTimer({id:'x',mode:'quiet5',now:0});const p=timer.pauseTimer(t,60000);assert.equal(derive.deriveTimer(p,180000).elapsedMs,60000)});
test('resume excludes paused duration',()=>{const t=timer.createTimer({id:'x',mode:'quiet5',now:0});const p=timer.pauseTimer(t,60000);const r=timer.resumeTimer(p,180000);assert.equal(derive.deriveTimer(r,240000).elapsedMs,120000);assert.equal(derive.deriveTimer(r,240000).remainingMs,180000)});
test('natural expiration',()=>{const t=timer.createTimer({id:'x',mode:'quiet5',now:0});assert.equal(derive.deriveTimer(t,300001).isExpired,true)});
test('finished timer stops accumulating',()=>{const t=timer.createTimer({id:'x',mode:'quiet5',now:0});const f=timer.finishTimer(t,300000);assert.equal(derive.deriveTimer(f,900000).elapsedMs,300000)});
test('early end stops accumulating',()=>{const t=timer.createTimer({id:'x',mode:'quiet5',now:0});const f=timer.endTimerEarly(t,90000);assert.equal(derive.deriveTimer(f,900000).elapsedMs,90000)});
test('custom duration clamps',()=>{assert.equal(timer.createTimer({id:'x',mode:'custom',customMinutes:999,now:0}).plannedMinutes,180)});
test('today stats derived not counters',()=>{const now=new Date(2026,7,21,12).getTime();const s=[{endedAt:now,actualSeconds:1500},{endedAt:now-1000,actualSeconds:1500}];const tasks=[{status:'done',updatedAt:now}];const out=stats.computeTodayStats(s,tasks,now);assert.equal(out.focusSeconds,3000);assert.equal(out.sessions,2);assert.equal(out.completedTasks,1)});
test('last write wins deterministic',()=>{assert.equal(conflicts.latestWriteWins({updatedAt:1,v:'a'},{updatedAt:2,v:'b'}).v,'b')});
test('cloud serialization overwrites local user id',()=>{const m={entityType:'task',entityId:'t',payload:{id:'t',userId:'local-user',courseId:'c',updatedAt:2}};const p=serialize.toCloudPayload(m,'u-remote');assert.equal(p.user_id,'u-remote');assert.equal(p.course_id,'c');assert.equal(p.updated_at,2);assert.equal(p.userId,undefined)});
console.log(`Domain checks executed: ${n}`);
