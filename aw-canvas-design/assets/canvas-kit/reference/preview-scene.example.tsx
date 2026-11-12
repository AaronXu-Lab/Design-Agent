import { useMemo, useState } from 'react'
import { createPreviewFixture } from './preview-fixtures.example'
import { usePreviewBridge } from './preview-protocol'

type Adapter = ReturnType<typeof createPreviewFixture>
type ViewProps = ReturnType<Adapter['view']> & {
  value: string
  error: string
  result: string
  onChange: (value: string) => void
  onAction: (index: number) => void
}

/** Stand-in for a host's shared display component; receives only data and callbacks. */
export function FixtureSceneView({ title, detail, field, actions, value, error, result, onChange, onAction }: ViewProps) {
  return <section aria-label={title}>
    <h2>{title}</h2>
    {detail && <p>{detail}</p>}
    <form autoComplete="off" onSubmit={event => { event.preventDefault(); onAction(0) }}>
      {field && <p><label>{field.label} <input type={field.type ?? 'text'} value={value} onChange={event => onChange(event.target.value)} /></label>
        <br /><small>演示值：{field.example}</small></p>}
      {error && <p role="alert">{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {actions.map(({ label }, index) => index === 0
          ? <button key={label} type="submit">{label}</button>
          : <button key={label} type="button" onClick={() => onAction(index)}>{label}</button>)}
      </div>
    </form>
    {result && <p role="status">{result}</p>}
  </section>
}

export function FixturePreview({ entry, walk }: { entry: string; walk: boolean }) {
  const adapter = useMemo(() => createPreviewFixture(entry, walk), [entry, walk])
  const [state, setState] = useState(() => adapter.initial())
  const reset = () => setState(adapter.initial())
  const root = usePreviewBridge<HTMLDivElement>(reset, { state, restore: saved => setState(adapter.restore(saved)) })
  return <div ref={root} style={{ width: 'max-content', maxWidth: 480, padding: 12 }}>
    <FixtureSceneView {...adapter.view(state)} {...state}
      onChange={value => setState(previous => ({ ...previous, value, error: '', result: '' }))}
      onAction={index => setState(previous => adapter.act(previous, index))} />
    <p><button type="button" onClick={reset}>重置场景</button></p>
  </div>
}
