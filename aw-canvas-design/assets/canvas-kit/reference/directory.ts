import type { TCanvasFlows, TFlowKind, TFlowSection } from './types'

export interface IFlowDirectoryGroup { id: string; items: string[] }
export interface IFlowDirectorySection { id: TFlowSection; groups: IFlowDirectoryGroup[] }

/** 兼容旧数据，不按状态、名称或引用次数猜测业务归属；新数据明确 kind/section。 */
export function flowKind<T>(flows: TCanvasFlows<T>, id: string): TFlowKind {
  const item = flows[id]
  if (!item) throw new Error(`Unknown flow: ${id}`)
  return item.kind ?? (item.parent === undefined ? 'main' : 'subflow')
}

/** 只构建 flow 导航；返回原 ID，不改路由、预览或 link，也不修改输入。 */
export function buildFlowDirectory<T>(flows: TCanvasFlows<T>): IFlowDirectorySection[] {
  const sections: IFlowDirectorySection[] = [{ id: 'main', groups: [] }, { id: 'other', groups: [] }]
  for (const [id, item] of Object.entries(flows)) {
    const kind = flowKind(flows, id)
    if (!['main', 'subflow', 'branch'].includes(kind)) throw new Error(`Invalid flow kind: ${id}`)
    if (item.parent !== undefined) {
      const parent = flows[item.parent]
      if (!parent || item.parent === id || parent.parent !== undefined || flowKind(flows, item.parent) !== 'main') {
        throw new Error(`Invalid flow parent: ${id}`)
      }
      if (kind === 'main' || item.section !== undefined) throw new Error(`Child must inherit section and be subflow/branch: ${id}`)
    } else {
      if (kind !== 'main') throw new Error(`Missing main parent: ${id}`)
      const section = sections.find((value) => value.id === (item.section ?? 'main'))
      if (!section) throw new Error(`Invalid flow section: ${id}`)
      section.groups.push({ id, items: [id, ...Object.keys(flows).filter((child) => flows[child].parent === id)] })
    }
  }
  return sections
}
