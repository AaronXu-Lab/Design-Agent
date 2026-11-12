import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useSyncExternalStore } from 'react'
import { useReactFlow } from '@xyflow/react'
import { commitPreviewSize, isPreviewSizeMessage, type IPreviewSizeMessage } from './preview-protocol'
import { usePreviewPool } from './preview-session'

interface Props { stateKey?: string; nodeId: string; title: string; src: string; width: number; height: number; scale?: number }
/** Stable outer geometry; only the inner iframe remounts when its scene changes.
 * A shared session owns at most three documents, including loading documents.
 * Same-document asynchronous reset generations still require a host-specific token.
 */
const PreviewFrame = forwardRef<HTMLIFrameElement, Props>(function PreviewFrame({ stateKey, nodeId, title, src, width, height, scale = 1 }, ref) {
  const pool = usePreviewPool()
  const key = stateKey ?? `${nodeId}:${src}`
  const active = useSyncExternalStore(pool.subscribe, pool.getSnapshot, pool.getSnapshot).includes(key)
  const { setNodes } = useReactFlow()
  const frame = useRef<HTMLIFrameElement>(null)
  const [size, setSize] = useState<Pick<IPreviewSizeMessage, 'width' | 'height' | 'viewport'>>()
  const [loadedKey, setLoadedKey] = useState<string>()
  const loaded = active && loadedKey === key
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const usable = useRef(false)
  const sequence = useRef(0)
  const cleanup = useRef<() => void>(() => {})
  const pending = useRef(new Map<number, { resolve: (state: unknown) => void; reject: (error: Error) => void; timer: number }>())
  useImperativeHandle(ref, () => frame.current!, [src, active])
  function request(type: string, extra: object = {}) {
    return new Promise<unknown>((resolve, reject) => {
      const target = frame.current?.contentWindow
      if (!target) { reject(new Error('预览尚未载入')); return }
      const request = ++sequence.current
      const timer = window.setTimeout(() => { pending.current.delete(request); reject(new Error('预览状态通信超时，原输入已保留，请重试')) }, 5000)
      pending.current.set(request, { resolve, reject, timer })
      target.postMessage({ type, request, ...extra }, window.location.origin)
    })
  }
  useEffect(() => pool.register(key, { suspend: () => {
    if (!usable.current) return Promise.reject(new Error('请等待现有预览完成加载或重置失败预览'))
    return request('flow-canvas:snapshot')
  } }), [pool, key])
  useEffect(() => {
    setLoadedKey(undefined)
    usable.current = false
    if (!active) return
    let cancelled = false
    let measured = false
    let restored = false
    let bridgeInstance: unknown
    let requestedRestore = false
    const finish = () => {
      if (!cancelled && measured && restored) { usable.current = true; setLoadedKey(key); window.clearTimeout(timeout) }
    }
    const timeout = window.setTimeout(() => setError('预览加载失败：请检查场景桥接，或重置后重试'), 10000)
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return
      const data = event.data
      if (isPreviewSizeMessage(data)) {
        if (data.ready === false) {
          measured = false; usable.current = false; setLoadedKey(undefined)
          return // Keep the entire last committed display and rendering geometry.
        }
        setSize(previous => {
          const next = commitPreviewSize(previous, data)
          return JSON.stringify(previous) === JSON.stringify(next) ? previous : next
        })
        measured = true
        finish()
      }
      if (data?.type === 'flow-canvas:ready') {
        if (requestedRestore && bridgeInstance === data.instance) return
        requestedRestore = true
        bridgeInstance = data.instance
        setError('')
        restored = false; measured = false; usable.current = false; setLoadedKey(undefined)
        const saved = pool.saved(key)
        void request('flow-canvas:restore', { present: saved.present, state: saved.value }).then(() => {
          if (cancelled) return
          restored = true
          finish()
        }).catch(error => { if (!cancelled) setError(String(error.message)) })
      }
      if (data?.type === 'flow-canvas:snapshot-result' || data?.type === 'flow-canvas:restored') {
        const task = pending.current.get(data.request)
        if (!task) return
        window.clearTimeout(task.timer)
        pending.current.delete(data.request)
        if (data.type === 'flow-canvas:restored') measured = false
        data.error ? task.reject(new Error(data.error)) : task.resolve(data.state)
      }
    }
    window.addEventListener('message', receive)
    return () => {
      cancelled = true
      usable.current = false
      cleanup.current()
      window.clearTimeout(timeout)
      window.removeEventListener('message', receive)
      for (const task of pending.current.values()) { window.clearTimeout(task.timer); task.reject(new Error('预览已卸载')) }
      pending.current.clear()
    }
  }, [active, key, pool, src])
  const activate = async () => {
    setError(''); setBusy(true)
    try { await pool.activate(key) } catch (error) { setError((error as Error).message) }
    finally { setBusy(false) }
  }
  const select = () => setNodes(nodes => nodes.map(node => Boolean(node.selected) === (node.id === nodeId) ? node : { ...node, selected: node.id === nodeId }))
  const frameWidth = size?.width ?? width
  const frameHeight = size?.height ?? height
  const viewport = size?.viewport
  return <div className="ck-preview nodrag nopan" style={{ width: frameWidth * scale, height: frameHeight * scale,
    ...(viewport ? { overflow: 'hidden' } : {}) }}>
    {!active && <button type="button" className="ck-preview-activate" onClick={activate} disabled={busy}>{busy ? '正在保存现有预览…' : '激活交互预览'}</button>}
    {active && !loaded && !error && <div className="ck-skeleton" aria-hidden><i /><i /><i /><i /></div>}
    {error && <p role="alert" className="ck-preview-error">{error}</p>}
    {active && <iframe key={src} ref={frame} title={title} src={src}
      style={{ width: viewport?.width ?? frameWidth, height: viewport?.height ?? frameHeight,
        ...(viewport ? { position: 'absolute', left: -viewport.x * scale, top: -viewport.y * scale } as const : {}),
        visibility: loaded ? undefined : 'hidden', transform: scale === 1 ? undefined : `scale(${scale})`, transformOrigin: '0 0' }}
      onLoad={event => {
        cleanup.current()
        const document = event.currentTarget.contentDocument
        document?.addEventListener('pointerdown', select)
        cleanup.current = () => document?.removeEventListener('pointerdown', select)
      }} />}
  </div>
})
export default PreviewFrame
