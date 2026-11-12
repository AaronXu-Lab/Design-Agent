import { layoutFlow, type ISize, type IFlowLayout } from './layout'
import type { ICanvasFlowDef } from './types'

/** ELK runs in a worker; route refinement remains on the host. Cache is bounded. */
const cache = new Map<string, Promise<IFlowLayout>>()
export function layoutInWorker<T>(flow: ICanvasFlowDef<T>, sizes: Record<string, ISize>): Promise<IFlowLayout> {
  // Targets may contain callbacks: only geometry inputs cross the worker boundary.
  const geometry = { label: flow.label, preview: null, nodes: flow.nodes.map(({ id, kind, title }) => ({ id, kind, title })), edges: flow.edges }
  const key = JSON.stringify([geometry, sizes])
  const hit = cache.get(key)
  if (hit) return hit
  const task = layoutFlow(geometry, sizes)
  cache.set(key, task)
  if (cache.size > 8) cache.delete(cache.keys().next().value!)
  task.catch(() => cache.delete(key))
  return task
}
