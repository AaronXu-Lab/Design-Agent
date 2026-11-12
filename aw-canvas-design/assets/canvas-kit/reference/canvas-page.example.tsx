import { PreviewSession, usePreviewPool } from './preview-session'
import { useCallback, useEffect, useState } from 'react'
import CanvasBoard from './board'
import { FixturePreview } from './preview-scene.example'
import { resolvePreviewRoute } from './preview-routes.example'
import { TILE_COLLECTION } from './tiles.example'
import { FLOWS, type IDemoTarget } from './flows.example'

/** Mount under the host business route. Preserve its deployment prefix and context.
 * ?flow= shows the canvas; ?preview= walks a flow; ?screen= and ?item= are independent.
 * This example uses path routing; adapt it to the actual project router for hash routes.
 */
const selectors = ['flow', 'preview', 'screen', 'item', 'scenario']
function canvasUrl(query = '') {
  const url = new URL(window.location.href)
  for (const key of selectors) url.searchParams.delete(key)
  new URLSearchParams(query).forEach((value, key) => url.searchParams.set(key, value))
  return url
}
export default function CanvasPage() {
  return <PreviewSession><CanvasPageContent /></PreviewSession>
}
function CanvasPageContent() {
  const pool = usePreviewPool()
  const [error, setError] = useState('')
  const [query, setQuery] = useState(window.location.search)
  useEffect(() => {
    const pop = () => {
      const next = window.location.search
      void pool.saveAll().then(() => { setError(''); setQuery(next) }).catch(error => {
        const previous = new URL(window.location.href)
        previous.search = query
        window.history.pushState(null, '', previous.href)
        setError(error.message)
      })
    }
    window.addEventListener('popstate', pop)
    return () => window.removeEventListener('popstate', pop)
  }, [pool, query])
  const go = useCallback((next: string) => {
    void pool.saveAll().then(() => {
      const url = canvasUrl(next)
      window.history.pushState(null, '', url.href)
      setError(''); setQuery(url.search)
    }).catch(error => setError(error.message))
  }, [pool])
  const previewSrc = useCallback((target: IDemoTarget) => canvasUrl(new URLSearchParams({ screen: target.screen,
    ...(target.scenario ? { scenario: target.scenario } : {}) }).toString()).href, [])
  const params = new URLSearchParams(query)
  const route = resolvePreviewRoute(params, FLOWS, TILE_COLLECTION.items)
  if (route.kind === 'fixture') return <FixturePreview key={query} entry={route.entry} walk={route.walk} />
  if (route.kind === 'source') {
    const { titleKey, source, capability } = route.item
    return <main><h2>{titleKey}</h2><p>仅源码记录 · {capability.kind === 'source-only' && capability.reasonKey}</p>
      <p><code>{source.path}</code> · <code>{source.symbol}</code></p>
      <ul>{source.evidence.map(line => <li key={line}>{line}</li>)}</ul>
      <a href={canvasUrl().href}>返回画布</a></main>
  }
  if (route.kind === 'missing') return <main><p role="status">没有可用的预览场景。</p><a href={canvasUrl().href}>返回画布</a>
    {route.mode === 'preview' && <ul>{Object.entries(FLOWS).map(([id, value]) => <li key={id}><a href={canvasUrl(`preview=${id}`).href}>{value.label}</a></li>)}</ul>}
    {route.mode === 'item' && <ul>{TILE_COLLECTION.items.map(({ id, titleKey }) => <li key={id}><a href={canvasUrl(`item=${id}`).href}>{titleKey}</a></li>)}</ul>}
  </main>
  const requestedFlow = params.get('flow') ?? ''
  const flow = Object.hasOwn(FLOWS, requestedFlow) ? requestedFlow : 'main'
  return <><CanvasBoard key={flow} title="登录流程画布" flows={FLOWS} flow={flow} previewSrc={previewSrc}
    onFlowChange={next => go(`flow=${next}`)} onPreviewFlow={next => go(`preview=${next}`)} />{error && <p role="alert">{error}</p>}</>
}
