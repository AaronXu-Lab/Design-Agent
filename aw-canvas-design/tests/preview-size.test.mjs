import test from 'node:test'
import assert from 'node:assert/strict'
import { commitPreviewSize as commit, isPreviewSizeMessage as valid, PREVIEW_SIZE_MESSAGE as type } from '../assets/canvas-kit/reference/preview-size.ts'

const viewport = { width: 800, height: 1200, x: 20, y: 30 }
const message = { type, width: 760, height: 600, viewport, ready: false }

test('display height grows and shrinks without changing rendering viewport', () => {
  for (const height of [600, 1100, 400]) assert.equal(valid({ ...message, height }), true)
  assert.equal(valid({ type, width: 760, height: 600 }), true, 'legacy synchronous shell remains accepted')
  assert.equal(valid({ ...message, ready: true }), true)
})

test('rejects invalid dimensions, readiness, origins and out-of-viewport display bounds', () => {
  for (const value of [0, -1, NaN, Infinity, '600', null, undefined]) {
    assert.equal(valid({ ...message, width: value }), false)
    assert.equal(valid({ ...message, height: value }), false)
    assert.equal(valid({ ...message, viewport: { ...viewport, width: value } }), false)
    assert.equal(valid({ ...message, viewport: { ...viewport, height: value } }), false)
  }
  for (const value of [-1, NaN, Infinity, '20', null, undefined]) {
    assert.equal(valid({ ...message, viewport: { ...viewport, x: value } }), false)
    assert.equal(valid({ ...message, viewport: { ...viewport, y: value } }), false)
  }
  for (const change of [{ width: 781 }, { height: 1171 }, { viewport: null }, { ready: 'true' }, { type: 'other' }]) {
    assert.equal(valid({ ...message, ...change }), false)
  }
  for (const value of [null, undefined, false, 1, 'message']) assert.equal(valid(value), false)
})


test('first load ignores temporary measurements until target layout is ready', () => {
  const initial = { width: 800, height: 900 }
  const pending = { ...message, width: 200, height: 100 }
  const uncommitted = commit(undefined, pending)
  assert.equal(uncommitted, undefined)
  assert.deepEqual(uncommitted ?? initial, initial)
  assert.deepEqual(commit(uncommitted, { ...message, ready: true }), {
    width: 760, height: 600, viewport,
  })
})

test('switches in both directions, resets and reloads retain complete committed geometry', () => {
  let current = commit(undefined, { ...message, ready: true })
  for (const height of [1000, 400, 600, 800]) {
    const previous = current
    for (const temporary of [100, 250, 50]) {
      current = commit(current, { ...message, width: 300, height: temporary,
        viewport: { width: 500, height: 700, x: 0, y: 0 } })
      assert.strictEqual(current, previous, 'all geometry stays committed during loading')
    }
    current = commit(current, { ...message, height, ready: true })
    assert.equal(current.height, height)
    assert.deepEqual(current.viewport, viewport)
  }
})

test('failed load preserves geometry; recovery and subsequent content can grow and shrink', () => {
  let current = commit(undefined, { ...message, ready: true })
  const previous = current
  // A failed/timeout generation never sends a ready commit; repeated loading reports remain inert.
  for (let attempt = 0; attempt < 3; attempt++) {
    current = commit(current, { ...message, height: 100 })
    assert.strictEqual(current, previous)
  }
  for (const height of [900, 1100, 300]) {
    current = commit(current, { ...message, height, ready: true })
    assert.equal(current.height, height)
  }
})
