import test from 'node:test';
import assert from 'node:assert/strict';
import { sum } from './sum.mjs';
test('sums signed values and rejects coercion', () => {
  assert.equal(sum([3, -2, 0.5]), 1.5);
  assert.equal(sum([]), 0);
  assert.throws(() => sum(['3']), TypeError);
});
