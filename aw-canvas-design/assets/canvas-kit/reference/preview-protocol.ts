import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PREVIEW_SIZE_MESSAGE, isPreviewSizeMessage, type IPreviewSizeMessage } from './preview-size'
export { PREVIEW_SIZE_MESSAGE, isPreviewSizeMessage, commitPreviewSize } from './preview-size'
export type { IPreviewSizeMessage, IPreviewViewport } from './preview-size'
export const PREVIEW_RESET_MESSAGE = 'flow-canvas:reset-scene'

/** Legacy in-place reset; pooled cards use pool.reset to clear the saved scene too. */
export function resetPreview(frame: HTMLIFrameElement | null | undefined) {
  frame?.contentWindow?.postMessage({ type: PREVIEW_RESET_MESSAGE }, window.location.origin)
}
export interface PreviewStateAdapter {
  /** Complete serializable scene state, including inputs, validation and current step. */
  state: unknown
  /** Ordinary synchronous state setters; no transitions or business side effects. */
  restore: (state: unknown) => void
}
export interface IPreviewBridgeOptions<T extends HTMLElement> extends Partial<PreviewStateAdapter> {
  ready?: boolean
  /** Preserve the natural rendering viewport; return independent display bounds. */
  measure?: (element: T) => Omit<IPreviewSizeMessage, 'type' | 'ready'>
}
/** Existing ready/measure calls and state/restore calls share the same options object. */
export function usePreviewBridge<T extends HTMLElement>(onReset: () => void, options: IPreviewBridgeOptions<T> = {}) {
  const root = useRef<T>(null)
  const reset = useRef(onReset)
  const current = useRef(options)
  reset.current = onReset
  current.current = options
  const pendingRestore = useRef(new Set<number>())
  const instance = useRef(crypto.randomUUID())
  const [revision, commit] = useState(0)
  const reportRef = useRef<() => void>(() => {})
  useLayoutEffect(() => {
    for (const request of pendingRestore.current) {
      window.parent.postMessage({ type: 'flow-canvas:restored', request }, window.location.origin)
    }
    pendingRestore.current.clear()
    reportRef.current()
  }, [revision, options.ready, options.measure])
  useEffect(() => {
    const element = root.current
    if (!element || window.parent === window) return
    let pending = 0
    let disposed = false
    let previous = ''
    const report = () => {
      if (disposed) return
      cancelAnimationFrame(pending)
      pending = requestAnimationFrame(() => {
        const measured = current.current.measure?.(element) ?? element.getBoundingClientRect()
        const message = { type: PREVIEW_SIZE_MESSAGE, width: measured.width, height: measured.height,
          ...('viewport' in measured ? { viewport: measured.viewport } : {}), ready: current.current.ready ?? true }
        if (!isPreviewSizeMessage(message)) return
        const key = JSON.stringify(message)
        if (key === previous) return
        previous = key
        window.parent.postMessage(message, window.location.origin)
      })
    }
    reportRef.current = report
    const observer = new ResizeObserver(report)
    observer.observe(element)
    const mutations = new MutationObserver(report)
    mutations.observe(element, { childList: true, subtree: true, attributes: true, characterData: true })
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      const message = event.data
      if (message?.type === PREVIEW_RESET_MESSAGE) {
        reset.current()
        previous = ''
        commit(value => value + 1)
      }
      if (message?.type === 'flow-canvas:snapshot') {
        try {
          if (!current.current.restore) throw new Error('场景尚未接入状态恢复适配器')
          window.parent.postMessage({ type: 'flow-canvas:snapshot-result', request: message.request,
            state: structuredClone(current.current.state) }, window.location.origin)
        } catch (error) {
          window.parent.postMessage({ type: 'flow-canvas:snapshot-result', request: message.request, error: String(error) }, window.location.origin)
        }
      }
      if (message?.type === 'flow-canvas:restore') {
        try {
          if (message.present) {
            if (!current.current.restore) throw new Error('场景尚未接入状态恢复适配器')
            current.current.restore(message.state)
          }
          previous = '' // Report again after the restored React commit, even at the same size.
          pendingRestore.current.add(message.request)
          commit(value => value + 1)
        } catch (error) {
          window.parent.postMessage({ type: 'flow-canvas:restored', request: message.request, error: String(error) }, window.location.origin)
        }
      }
    }
    window.addEventListener('message', receive)
    window.addEventListener('resize', report)
    void document.fonts.ready.then(report)
    queueMicrotask(() => {
      if (!disposed) window.parent.postMessage({ type: 'flow-canvas:ready', instance: instance.current }, window.location.origin)
    })
    report()
    return () => {
      disposed = true
      reportRef.current = () => {}
      cancelAnimationFrame(pending)
      observer.disconnect()
      mutations.disconnect()
      window.removeEventListener('message', receive)
      window.removeEventListener('resize', report)
    }
  }, [])
  return root
}
