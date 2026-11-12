/** Synthetic scenes only. No business controllers, clients, storage or service callbacks. */
export interface IDemoTarget { screen: string; scenario?: string }
interface FixtureAction { label: string; next?: string; invalidNext?: string; result?: string }
interface Fixture {
  title: string
  detail?: string
  field?: { label: string; example: string; type?: 'password'; expected?: string }
  actions: readonly FixtureAction[]
}

const email = { label: '邮箱', example: 'demo@example.invalid', expected: 'demo@example.invalid' }
const fixtures = new Map<string, Fixture>([
  ['account', { title: '输入账号', field: email, actions: [
    { label: '继续', next: 'credentials' },
    { label: '验证码登录', next: 'otp' },
    { label: '注册', next: 'register' },
  ] }],
  ['credentials', { title: '密码与验证方式', field: { label: '演示密码', example: 'canvas-demo', type: 'password', expected: 'canvas-demo' }, actions: [
    { label: '模拟登录', next: 'workspace' }, { label: '验证码登录', next: 'otp' },
  ] }],
  ['credentials:no-password', { title: '无密码账号', detail: '用演示验证码继续。', actions: [{ label: '验证码登录', next: 'otp' }] }],
  ['otp', { title: '邮箱验证码', field: { label: '演示验证码', example: '123456', expected: '123456' }, actions: [
    { label: '验证', next: 'workspace', invalidNext: 'invalid' },
    { label: '重新发送', result: '演示验证码已生成：123456。' },
    { label: '修改邮箱', next: 'account' },
  ] }],
  ['invalid', { title: '验证入口不可用', detail: '演示验证码无效。', actions: [
    { label: '重新申请', next: 'credentials' }, { label: '返回登录', next: 'account' },
  ] }],
  ['workspace', { title: '工作台', detail: '已进入演示工作台。', actions: [{ label: '退出登录', next: 'account' }] }],
  ['register', { title: '填写注册邮箱', field: email, actions: [
    { label: '模拟发送链接', next: 'sent' }, { label: '返回登录', next: 'account' },
  ] }],
  ['sent', { title: '查收注册邮件', detail: '演示链接已生成，未发送邮件。', actions: [
    { label: '模拟邮箱验证通过', next: 'workspace' },
  ] }],
  ['confirm', { title: '确认归档', detail: '将演示项目「样例文档」归档。', actions: [
    { label: '确认归档', result: '已模拟归档「样例文档」。' }, { label: '取消', result: '已取消。' },
  ] }],
])

export function fixtureKey({ screen, scenario }: IDemoTarget) {
  // Match exact pairs; delimiters in user-provided identifiers cannot alias a registered pair.
  if (screen.includes(':') || scenario?.includes(':')) return undefined
  const key = scenario === undefined ? screen : `${screen}:${scenario}`
  return fixtures.has(key) ? key : undefined
}

export function createPreviewFixture(entry: string, walk: boolean) {
  function initial(step = entry) {
    return { step, value: fixtures.get(step)!.field?.example ?? '', error: '', result: '' }
  }
  type State = ReturnType<typeof initial>
  const allowedSteps = new Set([entry])
  if (walk) {
    for (const step of allowedSteps) {
      for (const { next, invalidNext } of fixtures.get(step)!.actions) {
        if (next) allowedSteps.add(next)
        if (invalidNext) allowedSteps.add(invalidNext)
      }
    }
  }
  function restore(saved: unknown): State {
    if (!saved || typeof saved !== 'object') throw new Error('无效的演示场景快照')
    const { step, value, error, result } = saved as Partial<State>
    if (typeof step !== 'string' || !allowedSteps.has(step) ||
        typeof value !== 'string' || typeof error !== 'string' || typeof result !== 'string') {
      throw new Error('无效的演示场景快照')
    }
    return { step, value, error, result }
  }
  function act(state: State, index: number): State {
    const fixture = fixtures.get(state.step)!
    const action = fixture.actions[index]
    if (!action) return state
    // The first action validates the synthetic input; other actions are explicit alternatives.
    const invalid = index === 0 && fixture.field?.expected !== undefined && state.value !== fixture.field.expected
    const next = invalid ? action.invalidNext : action.next
    if (invalid && !next) return { ...state, error: '请输入页面提供的演示值。', result: '' }
    if (next && walk) return initial(next)
    return { ...state, error: '', result: action.result ?? `演示结果：${fixtures.get(next!)!.title}。` }
  }
  return { initial, restore, act, view: (state: State) => fixtures.get(state.step)! }
}
