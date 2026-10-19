import test from 'node:test'
import assert from 'node:assert/strict'
import { buildFlowDirectory, flowKind } from '../assets/canvas-kit/reference/directory.ts'

const make = (label, extra = {}) => ({ label, kind: 'main', preview: { screen: label }, nodes: [], edges: [], ...extra })
// 用户已确认的案例只作回归；产品名称、主流程数量不进入通用实现。
const fixture = () => ({
  direct: make('直接连接'),
  cloud: make('云端凭证'),
  authorization: make('外部账号授权', { kind: 'subflow', parent: 'cloud' }),
  form: make('填写凭证', { kind: 'subflow', parent: 'cloud' }),
  multi: make('多项凭证', { kind: 'branch', parent: 'cloud' }),
  local: make('本地授权'),
  combined: make('设备与云端凭证', { kind: 'branch', parent: 'local', nodes: [{ id: 'credentials', kind: 'reference', link: 'cloud' }] }),
  supplement: make('功能材料补充', { section: 'other' }),
  repair: make('异常修复', { section: 'other' }),
})

test('confirmed example groups core goals and retains every original entry exactly once', () => {
  const flows = fixture()
  const before = structuredClone(flows)
  const [main, other] = buildFlowDirectory(flows)
  assert.deepEqual(main.groups.map((g) => g.id), ['direct', 'cloud', 'local'])
  assert.deepEqual(other.groups.map((g) => g.id), ['supplement', 'repair'])
  assert.deepEqual(main.groups[1].items, ['cloud', 'authorization', 'form', 'multi'])
  assert.deepEqual(main.groups[2].items, ['local', 'combined'])
  assert.deepEqual(main.groups[0].items, ['direct']) // no empty folder
  const entries = [...main.groups, ...other.groups].flatMap((g) => g.items)
  assert.deepEqual(entries.toSorted(), Object.keys(flows).toSorted())
  assert.deepEqual(flows, before) // preview targets and reference link survive; no cloned canvas
  assert.equal(flows.combined.nodes[0].link, 'cloud')
  assert.deepEqual(['cloud', 'form', 'multi'].map((id) => flowKind(flows, id)), ['main', 'subflow', 'branch'])
})

test('business domains and counts are data, not a fixed connector catalogue', () => {
  const flows = { upload: make('批量导入'), mapping: make('字段映射', { parent: 'upload', kind: 'subflow' }) }
  assert.deepEqual(buildFlowDirectory(flows), [
    { id: 'main', groups: [{ id: 'upload', items: ['upload', 'mapping'] }] },
    { id: 'other', groups: [] },
  ])
  assert.deepEqual(buildFlowDirectory({}).map((s) => s.groups), [[], []])
})

test('legacy root/child definitions remain usable without new required fields', () => {
  const flows = { a: { label: 'a' }, b: { label: 'b', parent: 'a' } }
  assert.equal(flowKind(flows, 'a'), 'main')
  assert.equal(flowKind(flows, 'b'), 'subflow')
  assert.deepEqual(buildFlowDirectory(flows)[0].groups[0].items, ['a', 'b'])
})

test('invalid ownership cannot silently orphan an entry or create a third level', () => {
  const invalid = [
    { a: make('a', { parent: 'missing', kind: 'subflow' }) },
    { a: make('a', { parent: 'a', kind: 'subflow' }) },
    { a: make('a'), b: make('b', { parent: 'a', kind: 'subflow' }), c: make('c', { parent: 'b', kind: 'branch' }) },
    { a: make('a'), b: make('b', { parent: 'a', kind: 'branch', section: 'other' }) },
    { a: make('a', { kind: 'branch' }) },
    { a: make('a', { section: 'invalid' }) },
    { a: make('a', { kind: 'invalid' }) },
    { a: make('a'), b: make('b', { parent: 'a' }) },
  ]
  for (const flows of invalid) assert.throws(() => buildFlowDirectory(flows))
})
