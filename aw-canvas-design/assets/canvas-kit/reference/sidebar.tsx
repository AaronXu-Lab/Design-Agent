import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CaretDoubleLeftIcon, CaretDoubleRightIcon, FolderIcon, FolderOpenIcon, PathIcon, ArrowSquareOutIcon, GitBranchIcon, PlayIcon } from '@phosphor-icons/react'
import { EDGE_FILTER_LABELS, EEdgeFilter, type TCanvasFlows } from './types'
import { buildFlowDirectory, flowKind } from './directory'

/**
 * 仅 flow：主流程/其他流程两个任务 Section；连线筛选独立。
 * 有子/分支流程的主流程用文件夹；首项主入口可点击，缩进不隐藏类型图标；最多两级。
 *
 * 这里用 kit.css 的类名写成通用版。项目有设计系统侧栏时，必须改用其组件按 Gallery 的组合搭建，不自写树：
 * 例如 axo-ui 用 SidebarTopbar（leading="button" 收起目录，trailing="buttons" 只放「单独预览」）、
 * SidebarSectionHeader（collapsible、trailingText 数量）、SidebarItem（active、isIndent、open / items 做文件夹分组）。
 * 以 axo-ui 0.53.0 的实际导出为准：顶栏组件名是 SidebarTopbar，不是 SidebarHeader。
 */
interface ICanvasSidebarProps<TTarget> {
  title: string
  flows: TCanvasFlows<TTarget>
  flow: string
  filter: EEdgeFilter
  open: boolean
  onOpenChange: (open: boolean) => void
  onFilterChange: (filter: EEdgeFilter) => void
  onFlowChange: (flow: string) => void
  onPreview: () => void
  /** 可替换为项目语义等价类型图标；不得把三类复用为同一图标。 */
  icons?: Record<string, ReactNode>
  groupLabels?: Record<string, string>
  /** 宿主国际化传入标签；其他固定文案也沿用项目翻译机制。 */
  sectionLabels?: Partial<Record<'main' | 'other', string>>
}

export default function CanvasSidebar<TTarget>(props: ICanvasSidebarProps<TTarget>) {
  const { title, flows, flow, filter, open, onOpenChange, onFilterChange, onFlowChange, onPreview, icons = {}, groupLabels = {}, sectionLabels = {} } = props
  const trigger = useRef<HTMLButtonElement>(null)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const toggle = (key: string) => setCollapsed((current) => ({ ...current, [key]: !current[key] }))
  const sections = buildFlowDirectory(flows)
  useEffect(() => {
    // 直达/切换目标时显示当前项；仍允许用户手动收起当前文件夹。
    const parent = flows[flow]?.parent
    const root = parent ?? flow
    const section = flows[root]?.section ?? 'main'
    setCollapsed((current) => ({ ...current, [`section:${section}`]: false, ...(parent ? { [`flow:${parent}`]: false } : {}) }))
  }, [flow, flows])
  const typeIcon = (id: string) => {
    const Icon = { main: PathIcon, subflow: ArrowSquareOutIcon, branch: GitBranchIcon }[flowKind(flows, id)]
    return icons[id] ?? <Icon size={18} weight="regular" aria-hidden />
  }
  const flowItem = (item: string, indent: boolean) => <button key={item} type="button" className="ck-item" data-indent={indent || undefined}
    aria-current={item === flow || undefined} onClick={() => onFlowChange(item)}>
    {typeIcon(item)}<span>{flows[item].label}</span>
  </button>

  return <>
    <button ref={trigger} type="button" className="ck-sidebar-trigger" data-hidden={open || undefined} aria-label="展开目录" title="展开目录"
      aria-hidden={open} tabIndex={open ? -1 : undefined} onClick={() => onOpenChange(true)}><CaretDoubleRightIcon /></button>
    {/* 常驻挂载：卸载会跳过收起时的平移淡出，inert 负责收起态不可聚焦。 */}
    <aside className="ck-sidebar" data-closed={!open || undefined} aria-label="流程目录" inert={!open}>
      <div className="ck-sidebar-topbar">
        <button type="button" className="ck-topbar-btn" aria-label="收起目录" title="收起目录"
          onClick={() => { onOpenChange(false); requestAnimationFrame(() => trigger.current?.focus()) }}><CaretDoubleLeftIcon /></button>
        <button type="button" className="ck-topbar-btn" aria-label="单独预览" title="单独预览" onClick={onPreview}><PlayIcon /></button>
      </div>
      <div className="ck-sidebar-title"><span>{title} · {Object.keys(flows).length} 个流程</span></div>
      <nav className="ck-sidebar-body" aria-label="流程">
        {sections.map((section) => {
          const label = sectionLabels[section.id] ?? (section.id === 'main' ? '主流程' : '其他流程')
          const sectionKey = `section:${section.id}`
          return <section key={section.id} className="ck-section" aria-label={label} data-collapsed={collapsed[sectionKey] || undefined}>
            <button type="button" className="ck-section-header" aria-expanded={!collapsed[sectionKey]} onClick={() => toggle(sectionKey)}>
              <span>{label}</span><span>{section.groups.length}</span>
            </button>
            <div className="ck-section-items">
              {section.groups.map((group) => {
                if (group.items.length === 1) return flowItem(group.id, false)
                const key = `flow:${group.id}`
                const expanded = !collapsed[key]
                return <div key={group.id} className="ck-group" data-collapsed={!expanded || undefined}>
                  <button type="button" className="ck-item" aria-expanded={expanded} onClick={() => toggle(key)}>
                    {expanded ? <FolderOpenIcon size={18} weight="regular" aria-hidden /> : <FolderIcon size={18} weight="regular" aria-hidden />}
                    <span>{groupLabels[group.id] ?? flows[group.id].label}</span>
                    <span className="ck-item-trailing">{group.items.length}</span>
                  </button>
                  <div className="ck-group-items">{group.items.map((child) => flowItem(child, true))}</div>
                </div>
              })}
            </div>
          </section>
        })}
        <section className="ck-section" aria-label="连线" data-collapsed={collapsed.edges || undefined}>
          <button type="button" className="ck-section-header" aria-expanded={!collapsed.edges} onClick={() => toggle('edges')}><span>连线</span></button>
          <div className="ck-section-items">
            {Object.values(EEdgeFilter).map((value) => <button key={value} type="button" className="ck-item" aria-pressed={value === filter}
              onClick={() => onFilterChange(value)}>{EDGE_FILTER_LABELS[value]}</button>)}
          </div>
        </section>
      </nav>
    </aside>
  </>
}
