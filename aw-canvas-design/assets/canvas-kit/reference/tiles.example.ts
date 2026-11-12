import type { ITileCollection } from './tiles'
import type { IDemoTarget } from './preview-fixtures.example'

/** Illustrative paths / translation keys only; replace with actual evidence.
 * The interactive item is a kit fixture, not a host business component.
 */
export const TILE_COLLECTION: ITileCollection<IDemoTarget> = {
  mode: 'tiles', id: 'overlays', titleKey: 'canvas.overlays.title',
  scope: { included: ['registered overlays in the selected modules'], excluded: ['unscanned modules'] },
  groups: [
    { id: 'dialogs', titleKey: 'canvas.dialogs', kind: 'dialog' },
    { id: 'sheets', titleKey: 'canvas.sheets', kind: 'sheet' },
  ],
  modules: [
    { id: 'files-dialogs', groupId: 'dialogs', titleKey: 'canvas.modules.files' },
    { id: 'knowledge-sheets', groupId: 'sheets', titleKey: 'canvas.modules.knowledge' },
  ],
  rows: [
    { id: 'confirm-row', moduleId: 'files-dialogs', titleKey: 'canvas.rows.confirm', itemIds: ['confirm-default', 'confirm-result'], sequence: 'verified', evidence: ['Illustrative only: confirm completion opens result; replace with actual call-chain evidence'] },
    { id: 'details-row', moduleId: 'knowledge-sheets', titleKey: 'canvas.rows.details', itemIds: ['details-default'], sequence: 'unverified', evidence: [] },
  ],
  items: [
    {
      id: 'confirm-default', componentId: 'confirm', scenarioId: 'default', moduleId: 'files-dialogs',
      titleKey: 'canvas.confirm.default', change: 'proposed',
      source: { path: 'reference/preview-scene.example.tsx', symbol: 'FixtureSceneView', reachability: 'tool', evidence: ['Canvas-kit synthetic example; replace with the host display component'] },
      capability: { kind: 'interactive', target: { screen: 'confirm' },
        viewport: { width: 800, height: 640 }, viewportRule: 'Example only: adapt to original declaration and responsive gutters' },
      verification: { status: 'unverified', evidence: [] },
    },
    {
      id: 'confirm-result', componentId: 'result', scenarioId: 'success', moduleId: 'files-dialogs',
      titleKey: 'canvas.confirm.result', change: 'existing',
      source: { path: 'src/result.tsx', symbol: 'ResultDialog', reachability: 'reachable', evidence: ['Illustrative completion callback; replace with actual evidence'] },
      capability: { kind: 'source-only', reasonKey: 'canvas.preview.adapterMissing' },
      verification: { status: 'unverified', evidence: [] },
    },
    {
      id: 'details-default', componentId: 'details', scenarioId: 'default', moduleId: 'knowledge-sheets',
      titleKey: 'canvas.details.default', change: 'existing',
      source: { path: 'src/details.tsx', symbol: 'DetailsSheet', reachability: 'reachable', evidence: ['src/details-route.tsx: DetailsSheet import and render'] },
      capability: { kind: 'source-only', reasonKey: 'canvas.preview.adapterMissing' },
      verification: { status: 'blocked', evidence: [] },
    },
  ],
}
