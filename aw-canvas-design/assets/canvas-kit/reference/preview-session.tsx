import { createContext, useContext, useState, type ReactNode } from 'react'
import { PreviewPool } from './preview-pool'
const Context = createContext<PreviewPool | null>(null)
/** Wrap both modes at the route level; keep above keyed flow/module boards. */
export function PreviewSession({ children }: { children: ReactNode }) {
  const existing = useContext(Context)
  const [pool] = useState(() => new PreviewPool())
  return <Context.Provider value={existing ?? pool}>{children}</Context.Provider>
}
export function usePreviewPool() {
  const pool = useContext(Context)
  if (!pool) throw new Error('画布需由 PreviewSession 承载自动预览与会话状态')
  return pool
}
