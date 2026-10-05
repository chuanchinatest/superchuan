import test from 'node:test';
import assert from 'node:assert/strict';
import { nextLeg, WheelGate } from '../src/motion-state.mjs';

test('jump from intro to tools plays the intermediate scene first', () => {
  assert.deepEqual(nextLeg(0,2), {from:0,to:1,key:'0-1'});
  assert.deepEqual(nextLeg(1,2), {from:1,to:2,key:'1-2'});
});
test('return from tools to intro uses reverse clips in order', () => {
  assert.deepEqual(nextLeg(2,0), {from:2,to:1,key:'2-1'});
  assert.deepEqual(nextLeg(1,0), {from:1,to:0,key:'1-0'});
});
test('scene bounds cannot cause missing media', () => {
  assert.equal(nextLeg(0,-1),null);
  assert.equal(nextLeg(2,3),null);
  assert.equal(nextLeg(1,1),null);
});
test('a long trackpad gesture triggers only once including its inertia', () => {
  const gate=new WheelGate();
  assert.equal(gate.consume(20,0),0);
  assert.equal(gate.consume(24,30),1);
  for(let t=60;t<1800;t+=30) assert.equal(gate.consume(12,t),0);
  assert.equal(gate.consume(50,2200),1);
});
test('new opposite gesture works after idle', () => {
  const gate=new WheelGate();
  assert.equal(gate.consume(100,0),1);
  assert.equal(gate.consume(-100,500),-1);
});
