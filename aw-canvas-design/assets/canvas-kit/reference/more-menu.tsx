import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { DotsThreeIcon } from '@phosphor-icons/react'

interface IMoreMenuItem { label: string; icon: ReactNode; onSelect: () => void }

/**
 * 标题栏「更多操作」菜单的参考实现（原生 popover，无依赖）。
 * 项目有设计系统 Menu 时直接用它的 Root / Trigger / Popup / Item，保持同样的结构：
 * 触发按钮带 nodrag/nopan，菜单项选中后关闭。items 里的假值会被忽略；没有可用项时整体不渲染。
 */
export default function MoreMenu({ items, label = '更多操作' }: { items: (IMoreMenuItem | false | undefined | null)[]; label?: string }) {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const popup = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const actions = items.filter(Boolean) as IMoreMenuItem[]
  // 弹出层在顶层渲染，用触发按钮的位置定位：右对齐、贴在按钮下方。
  useEffect(() => {
    if (!open || !trigger.current || !popup.current) return
    const box = trigger.current.getBoundingClientRect()
    Object.assign(popup.current.style, { position: 'fixed', inset: 'auto', top: `${box.bottom + 4}px`, left: `${box.right - popup.current.offsetWidth}px`, margin: '0' })
  }, [open])
  if (!actions.length) return null
  return <>
    <button ref={trigger} type="button" className="ck-icon-btn nodrag nopan" popoverTarget={id} aria-haspopup="menu" aria-expanded={open}
      aria-label={label} title={label}><DotsThreeIcon size={16} weight="bold" /></button>
    <div ref={popup} id={id} popover="auto" role="menu" className="ck-menu nodrag nopan" onToggle={(event) => setOpen((event.nativeEvent as ToggleEvent).newState === 'open')}>
      {actions.map((item) => <button key={item.label} type="button" role="menuitem"
        onClick={() => { item.onSelect(); popup.current?.hidePopover() }}>{item.icon}{item.label}</button>)}
    </div>
  </>
}
