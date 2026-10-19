export const PREVIEW_SIZE_MESSAGE = 'flow-canvas:preview-size'

/** width/height 是外部展示尺寸；viewport 可保留独立渲染视口及未缩放展示原点。 */
export interface IPreviewViewport { width: number; height: number; x: number; y: number }
export interface IPreviewSizeMessage {
  type: typeof PREVIEW_SIZE_MESSAGE
  width: number
  height: number
  viewport?: IPreviewViewport
  /** 缺省仅兼容首报即就绪的同步旧壳；异步适配器必须明确报告。 */
  ready?: boolean
}

export function isPreviewSizeMessage(data: unknown): data is IPreviewSizeMessage {
  if (!data || typeof data !== 'object') return false
  const message = data as IPreviewSizeMessage
  const positive = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value > 0
  const nonnegative = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0
  const viewport = message.viewport
  return message.type === PREVIEW_SIZE_MESSAGE && positive(message.width) && positive(message.height)
    && (message.ready === undefined || typeof message.ready === 'boolean')
    && (viewport === undefined || viewport !== null && typeof viewport === 'object'
      && positive(viewport.width) && positive(viewport.height) && nonnegative(viewport.x) && nonnegative(viewport.y)
      && viewport.x + message.width <= viewport.width && viewport.y + message.height <= viewport.height)
}


/** 调用前校验消息来源与当前代次；loading 测量不覆盖最后提交几何。 */
export type TPreviewGeometry = Pick<IPreviewSizeMessage, 'width' | 'height' | 'viewport'>
export function commitPreviewSize(previous: TPreviewGeometry | undefined, message: IPreviewSizeMessage): TPreviewGeometry | undefined {
  if (message.ready === false) return previous
  return { width: message.width, height: message.height, viewport: message.viewport }
}
