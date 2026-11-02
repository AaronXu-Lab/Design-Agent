/** Shared header action for page/Dialog/Sheet cards in flow, tiles and state views.
 * href is resolved from this card's CURRENT target/variant with the host router;
 * screen/item routes are valid. This action never opens an entire flow or resets it.
 * Translate label and unavailableReason through the project's i18n mechanism.
 */
export default function NodePreviewButton({ href, label = '打开预览', unavailableReason = '当前场景暂无真实预览' }: {
  href?: string
  label?: string
  unavailableReason?: string
}) {
  const icon = <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 3h7v7m0-7L10 14M10 5H4v16h16v-6" />
  </svg>
  return href
    ? <a className="ck-icon-btn nodrag nopan" href={href} target="_blank" rel="noopener noreferrer"
        aria-label={label} title={label} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()}>{icon}</a>
    : <button type="button" className="ck-icon-btn nodrag nopan" disabled aria-label={`${label}：${unavailableReason}`}
        title={unavailableReason}>{icon}</button>
}
