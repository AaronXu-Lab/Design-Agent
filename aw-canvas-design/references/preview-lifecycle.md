# 按需预览与状态恢复

执行规则以 [工作流](workflow.md#性能与预览生命周期) 为事实源。实现真实组件预览或排查丢失输入时读取本页。

## 接入

1. 复制 `preview-pool.ts`、`preview-session.tsx`、`preview-frame.tsx` 、`preview-size.ts` 和 `preview-protocol.ts`。用 `PreviewSession` 包住两种模式的会话根，置于带 key 的画板上方；`CanvasBoard` 自带兼容容器，但跨画板保留仍需外层容器。平铺适配器用相同容器与 `PreviewFrame`，不要自行另设预算。
2. `stateKey` 使用 `模块或流程:条目ID:场景地址`，保持稳定且不同实例不冲突；流程参考节点已生成该键。保留 iframe 的真实尺寸、缩放、焦点与副作用隔离。外层 `PreviewFrame` 使用稳定卡片身份，不以 src 为 key 重建外框；仅内部 iframe 按 src 重挂，已提交几何跨切换与重置保留。
3. 将组件的受控状态交给桥接器，不只保存 DOM 文本。实际组件与预览共用展示层，适配器注入数据和回调。

```tsx
const [scene, setScene] = useState(initialScene)
const root = usePreviewBridge<HTMLDivElement>(
  () => setScene(initialScene),
  { state: scene, restore: saved => setScene(validateScene(saved)),
    ready: contentReady, measure: measureScene },
)
return <div ref={root}><SharedView scene={scene} onChange={setScene} /></div>
```

`contentReady` 和 `measureScene` 沿用宿主的稳定尺寸适配；同步且无视口依赖的根可省略两者。`validateScene` 由宿主校验自身状态类型；保存表单、错误、选择、步骤等完整语义状态。恢复使用普通同步 state setter，不用 transition 或发起业务请求。无需状态的场景传 `{ state: null, restore: () => {} }`。老的一参数桥接仍能加载，但缺少适配器的实例无法安全回收，第四次激活会给出错误而保留原输入。

4. 自定义模块/场景切换必须先 `await pool.saveAll()` 再更新路由/场景；错误保持当前场景并展示原因。流程目录和参考节点场景切换已接入。用客户端路由保留外层会话；整页导航结束内存会话。
5. 重置调用 `pool.reset(stateKey)`，清快照并卸载；再次点击激活从默认状态开始。暂停、保存或恢复失败可重试；明确重置才允许丢弃旧值。

## 消息与生命周期

父子校验 origin 和 source，请求编号匹配响应。ready 带桥接实例标识并在父端去重；StrictMode 清理后的初始化不发送 ready，批量恢复请求在 React 提交后逐一确认。子页 ready 后父页发 restore；子页应用状态并提交 React 更新后回 restored；尺寸和恢复两者完成才撤骨架。回收时请求 snapshot，拿到可克隆快照才腾出槽位。通信有界超时，卸载清理待决请求与监听。预算包括加载中的 iframe。

快照只存于当前父画布内存；三个文档上限不是总内存硬上限，历史快照仍占空间。文件对象、编辑器内部状态及复杂非受控组件须由宿主明确适配，不宣称任意 UI 自动恢复。没有适配能力时保留实例并报告缺口。

## 验收

使用四个以上真实预览验证：初次零挂载、点击激活、快速连续激活始终不超过三个、第四个淘汰最早实例、返回后字段与错误/步骤恢复、失败不丢输入、重置清快照、流程/场景切换隔离、不同画布会话不串状态。保留纯逻辑预算/失败/作用域回归测试；另用真实浏览器检查桥接与交互，不能用单元测试替代。
