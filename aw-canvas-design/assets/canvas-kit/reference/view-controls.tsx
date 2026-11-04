import type { ReactNode } from 'react'
import { CanvasMinimap, CanvasNavigation, type CanvasMinimapNode, type CanvasMinimapRect } from '@ai-indeed/axo-ui'

interface ICanvasViewControlsProps {
  /** 缩放比例，1 = 100%。 */
  zoom: number
  onZoomChange: (zoom: number) => void
  /** 适配当前流程的全部内容；这是唯一会重新适配视口的入口，切换流程不会触发。 */
  onZoomToFit: () => void
  /** 没有选中卡片时不传，Menu 里的对应项保持禁用。 */
  onZoomToSelection?: () => void
  /** 世界坐标下的节点矩形与当前可见区域，缩略图据此绘制。 */
  nodes: readonly CanvasMinimapNode[]
  viewport: CanvasMinimapRect
  onViewportChange: (viewport: CanvasMinimapRect) => void
  /** 画布正在平移或缩放：缩略图随之出现，停手约 1.5 秒后淡出。 */
  isInteracting: boolean
  /** 画布自己的附加操作（如「重置布局」），叠在控件栏上方。 */
  extra?: ReactNode
}

/**
 * 设计系统 Canvas Control：CanvasNavigation（缩小 / 百分比 Menu / 放大，竖排）+ CanvasMinimap，固定在画布右下角。
 * 样式见 kit.css 的 `.ck-nav-host`；缩略图默认在右侧展开，这里翻到左侧，避免超出画布右缘。
 * 项目没有该设计系统时，参照 controls.html 用同形的 HTML 实现。
 */
export default function CanvasViewControls({
  zoom, onZoomChange, onZoomToFit, onZoomToSelection, nodes, viewport, onViewportChange, isInteracting, extra,
}: ICanvasViewControlsProps) {
  return <div className="ck-nav-host">
    {extra}
    <CanvasNavigation zoom={zoom} minZoom={0.1} maxZoom={2.5} onZoomChange={onZoomChange} onZoomToFit={onZoomToFit}
      onZoomToSelection={onZoomToSelection} isInteracting={isInteracting}
      labels={{
        controls: '画布导航', zoomOut: '缩小', zoomIn: '放大', zoomMenu: (percent) => `缩放选项，${percent}%`,
        zoomToSelection: '缩放到选中卡片', zoomToFit: '适配全图', zoomTo: (percent) => `缩放到 ${percent}%`,
      }}
      minimap={<CanvasMinimap nodes={nodes} viewport={viewport} onViewportChange={onViewportChange}
        ariaLabel="画布缩略图" description="点击或拖动平移视口，方向键移动视口，Esc 取消拖动。" />} />
  </div>
}
