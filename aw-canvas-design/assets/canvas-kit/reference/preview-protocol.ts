import { useEffect, useRef } from 'react'

/**
 * 画布与节点预览（同源 iframe）之间的消息协议：
 * - 尺寸规则见 ../../../references/component-design.md「预览视口与稳定尺寸」。
 * - 首报不是尺寸稳定证据；收敛、内容和底部操作另按 Skill 验收。
 * - 预览 → 画布：`size`，内容尺寸变化时上报；仅当前内容和布局 ready 后提交几何并撤骨架，loading 保留最后提交尺寸。
 * - 画布 → 预览：`reset`，卡片右上角「重置场景」通知预览回到节点定义的场景，不重新载入 iframe。
 * 两端都校验 origin 与 source，只接受约定的消息类型。
 */
import { PREVIEW_SIZE_MESSAGE, isPreviewSizeMessage, type IPreviewSizeMessage } from './preview-size'
export { PREVIEW_SIZE_MESSAGE, isPreviewSizeMessage, commitPreviewSize } from './preview-size'
export type { IPreviewSizeMessage, IPreviewViewport } from './preview-size'
export const PREVIEW_RESET_MESSAGE = 'flow-canvas:reset-scene'

/** 画布一侧：通知某个预览 iframe 回到节点场景。 */
export function resetPreview(frame: HTMLIFrameElement | null | undefined) {
  frame?.contentWindow?.postMessage({ type: PREVIEW_RESET_MESSAGE }, window.location.origin)
}

/**
 * 同步、无视口依赖的根元素可直接使用默认测量。
 * 异步场景传 ready；响应式弹层传 measure，在项目自然视口测量完整组件/留白，
 * 返回独立 viewport 与展示原点。此 hook 不推断业务就绪，也不证明尺寸收敛。
 * Portal 替换等变化由自定义 measure 定位当前组件；必要时在宿主扩展观察范围。
 */
interface IPreviewBridgeOptions<T extends HTMLElement> {
  ready?: boolean
  measure?: (element: T) => Omit<IPreviewSizeMessage, 'type' | 'ready'>
}
export function usePreviewBridge<T extends HTMLElement>(onReset: () => void, options: IPreviewBridgeOptions<T> = {}) {
  const root = useRef<T>(null)
  const reset = useRef(onReset)
  const current = useRef(options)
  reset.current = onReset
  current.current = options
  useEffect(() => {
    const element = root.current
    if (!element || window.parent === window) return
    let pending = 0
    let disposed = false
    const report = () => {
      if (disposed) return
      cancelAnimationFrame(pending)
      pending = requestAnimationFrame(() => {
        const measured = current.current.measure?.(element) ?? element.getBoundingClientRect()
        const message = { type: PREVIEW_SIZE_MESSAGE, width: measured.width, height: measured.height,
          ...('viewport' in measured ? { viewport: measured.viewport } : {}), ready: current.current.ready ?? true }
        if (isPreviewSizeMessage(message)) window.parent.postMessage(message, window.location.origin)
      })
    }
    // 面板隐藏时 ResizeObserver 可能不触发，需在面板可见时验证。
    const observer = new ResizeObserver(report)
    observer.observe(element)
    const mutations = new MutationObserver(report)
    mutations.observe(element, { childList: true, subtree: true, attributes: true, characterData: true })
    const receive = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === window.parent && event.data?.type === PREVIEW_RESET_MESSAGE) {
        reset.current()
        report()
      }
    }
    window.addEventListener('message', receive)
    window.addEventListener('resize', report)
    void document.fonts.ready.then(report)
    report()
    return () => {
      disposed = true
      cancelAnimationFrame(pending)
      observer.disconnect()
      mutations.disconnect()
      window.removeEventListener('message', receive)
      window.removeEventListener('resize', report)
    }
  }, [options.ready, options.measure])
  return root
}
