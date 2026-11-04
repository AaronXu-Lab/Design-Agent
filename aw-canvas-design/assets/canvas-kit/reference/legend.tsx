import { useState } from 'react'
import { ArrowSquareOutIcon, CaretDownIcon, GitForkIcon, InfoIcon, ListBulletsIcon } from '@phosphor-icons/react'

type TEdgeKind = 'main' | 'branch' | 'fault'

/** 连线样例：与画布上的线同样的粗细、虚实与箭头。 */
function EdgeSample({ kind }: { kind: TEdgeKind }) {
  return <svg className="ck-legend-edge" data-kind={kind} viewBox="0 0 32 10" aria-hidden>
    <line x1="1" y1="5" x2="24" y2="5" />
    <path d="M23 1.5 L30 5 L23 8.5 Z" />
  </svg>
}

/**
 * 图例：左下角折叠卡片。默认收起为一颗「图例」胶囊；展开后「节点」「连线」两栏竖排，样例与画布同形。
 * 入口、返回在卡片上自带文字，不进图例；快捷键在 Canvas Control 的菜单里。
 */
export default function CanvasLegend() {
  const [open, setOpen] = useState(false)
  return <aside className="ck-legend" aria-label="图例" data-open={open || undefined}>
    <button type="button" className="ck-legend-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
      <ListBulletsIcon aria-hidden />图例<CaretDownIcon className="ck-legend-caret" aria-hidden />
    </button>
    <div className="ck-legend-body">
      <section aria-label="节点">
        <h3>节点</h3>
        <ul>
          <li><span className="ck-legend-node" data-kind="screen" />页面</li>
          <li><span className="ck-legend-node" data-kind="decision"><GitForkIcon weight="bold" /></span>判断</li>
          <li><span className="ck-legend-node" data-kind="reference"><ArrowSquareOutIcon weight="bold" /></span>跨流程</li>
          <li><span className="ck-legend-node" data-kind="note"><InfoIcon weight="bold" /></span>说明</li>
        </ul>
      </section>
      <section aria-label="连线">
        <h3>连线</h3>
        <ul>
          <li><EdgeSample kind="main" />主路径</li>
          <li><EdgeSample kind="branch" />分支</li>
          <li><EdgeSample kind="fault" />异常</li>
        </ul>
      </section>
    </div>
  </aside>
}
