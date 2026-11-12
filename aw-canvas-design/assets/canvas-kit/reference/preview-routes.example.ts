import { fixtureKey, type IDemoTarget } from './preview-fixtures.example'
import type { IDesignTile } from './tiles'

type Route =
  | { kind: 'canvas' }
  | { kind: 'missing'; mode: 'preview' | 'screen' | 'item' }
  | { kind: 'source'; item: IDesignTile<IDemoTarget> }
  | { kind: 'fixture'; entry: string; walk: boolean }

export function resolvePreviewRoute(
  params: URLSearchParams,
  flows: Record<string, { preview: IDemoTarget }>,
  items: readonly IDesignTile<IDemoTarget>[],
): Route {
  // Any explicit preview selector (including an empty/unknown one) stays in preview.
  const mode = (['screen', 'preview', 'item'] as const).find(key => params.has(key))
  if (!mode) return { kind: 'canvas' }
  const id = params.get(mode)!
  const item = mode === 'item' ? items.find(item => item.id === id) : undefined
  if (item?.capability.kind === 'source-only') return { kind: 'source', item }
  const target = mode === 'screen' ? { screen: id, scenario: params.get('scenario') ?? undefined }
    : mode === 'preview' && Object.hasOwn(flows, id) ? flows[id].preview
    : item?.capability.kind === 'interactive' ? item.capability.target : undefined
  const entry = target && fixtureKey(target)
  return entry ? { kind: 'fixture', entry, walk: mode === 'preview' } : { kind: 'missing', mode }
}
