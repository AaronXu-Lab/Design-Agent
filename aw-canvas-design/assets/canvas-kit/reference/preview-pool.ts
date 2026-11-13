/** One pool per canvas session. Snapshots stay in memory, never browser storage. */
export interface PreviewParticipant { suspend: () => Promise<unknown> }
export class PreviewPool {
  private active: string[] = []
  private listeners = new Set<() => void>()
  private participants = new Map<string, PreviewParticipant>()
  private states = new Map<string, unknown>()
  private queue: Promise<unknown> = Promise.resolve()
  getSnapshot = () => this.active
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  private emit() { for (const listener of this.listeners) listener() }
  register(id: string, participant: PreviewParticipant) {
    this.participants.set(id, participant)
    if (!this.active.includes(id)) { this.active = [...this.active, id]; this.emit() }
    return () => {
      if (this.participants.get(id) !== participant) return
      this.participants.delete(id)
      this.active = this.active.filter(key => key !== id)
      this.emit()
    }
  }
  saved(id: string) { return this.states.has(id) ? { present: true, value: this.states.get(id) } : { present: false } }
  clear(id: string) { this.states.delete(id) }
  reset(id: string) {
    this.clear(id)
    this.active = this.active.filter(key => key !== id)
    this.emit()
  }
  saveAll(): Promise<void> {
    const task = this.queue.then(async () => {
      const saved = await Promise.all(this.active.map(async id => {
        const participant = this.participants.get(id)
        if (!participant) throw new Error('预览生命周期失效')
        return [id, structuredClone(await participant.suspend())] as const
      }))
      for (const [id, state] of saved) this.states.set(id, state)
    })
    this.queue = task.catch(() => undefined)
    return task
  }
  activate(id: string): Promise<void> {
    const task = this.queue.then(async () => {
      if (!this.participants.has(id)) throw new Error('预览已离开当前画布')
      if (this.active.includes(id)) return
      this.active = [...this.active, id]
      this.emit()
    })
    this.queue = task.catch(() => undefined)
    return task
  }
}
