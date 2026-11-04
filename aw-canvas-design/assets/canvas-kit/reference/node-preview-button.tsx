import { useEffect, useRef, useState } from 'react'

/** Shared header action for page/Dialog/Sheet cards in flow, tiles and state views.
 * - href is resolved from this card's CURRENT target/variant with the host router; screen/item routes are valid.
 *   This action never opens an entire flow or resets it. Translate labels through the project's i18n mechanism.
 * - It must be the SAME standard button as the neighbouring "more actions" Menu trigger (same component, size, variant).
 *   With a design system use its Button (e.g. xs Ghost icon) in place of the `.ck-icon-btn` below; click opens href with
 *   window.open(href, '_blank', 'noopener,noreferrer') (also on middle click via onAuxClick).
 * - COMMAND (Ctrl on Windows/Linux) while hovering turns it into "Copy link": icon, tooltip and aria-label change, click writes the
 *   ABSOLUTE url to the clipboard (no new tab) and shows a check for ~1.5s. The modifier is only listened for while hovered:
 *   initialised from pointerenter metaKey/ctrlKey, kept in sync on keydown/keyup/blur.
 */
export default function NodePreviewButton({ href, label = '打开预览', copyLabel = '复制链接', copiedLabel = '链接已复制', unavailableReason = '当前场景暂无真实预览' }: {
  href?: string
  label?: string
  copyLabel?: string
  copiedLabel?: string
  unavailableReason?: string
}) {
  const [hovered, setHovered] = useState(false)
  const [modifier, setModifier] = useState(false)
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (!hovered) return
    const sync = (event: KeyboardEvent) => setModifier(event.metaKey || event.ctrlKey)
    const reset = () => setModifier(false)
    window.addEventListener('keydown', sync)
    window.addEventListener('keyup', sync)
    window.addEventListener('blur', reset)
    return () => { window.removeEventListener('keydown', sync); window.removeEventListener('keyup', sync); window.removeEventListener('blur', reset) }
  }, [hovered])

  const svg = (path: string) => <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d={path} /></svg>
  const openIcon = svg('M14 3h7v7m0-7L10 14M10 5H4v16h16v-6')
  if (!href) {
    return <button type="button" className="ck-icon-btn nodrag nopan" disabled aria-label={`${label}：${unavailableReason}`} title={unavailableReason}>{openIcon}</button>
  }

  const copying = hovered && modifier
  const text = copied ? copiedLabel : copying ? copyLabel : label
  const absolute = () => new URL(href, window.location.href).href
  async function copy() {
    try { await navigator.clipboard.writeText(absolute()) } catch {
      const field = document.createElement('textarea')
      field.value = absolute(); field.style.position = 'fixed'; field.style.opacity = '0'
      document.body.append(field); field.select(); document.execCommand('copy'); field.remove()
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1500)
  }
  return <button type="button" className="ck-icon-btn nodrag nopan" aria-label={text} title={text}
    onPointerEnter={(event) => { setHovered(true); setModifier(event.metaKey || event.ctrlKey) }}
    onPointerMove={(event) => setModifier(event.metaKey || event.ctrlKey)}
    onPointerLeave={() => { setHovered(false); setModifier(false) }}
    onPointerDown={(event) => event.stopPropagation()}
    onClick={(event) => {
      event.stopPropagation()
      if (event.metaKey || event.ctrlKey) void copy(); else window.open(href, '_blank', 'noopener,noreferrer')
    }}
    onAuxClick={(event) => { if (event.button === 1) { event.preventDefault(); event.stopPropagation(); window.open(href, '_blank', 'noopener,noreferrer') } }}>
    {copied ? svg('M5 13l4 4L19 7') : copying ? svg('M9 9h11v11H9zM5 15V5h10') : openIcon}
  </button>
}
