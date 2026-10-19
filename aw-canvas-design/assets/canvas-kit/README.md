# canvas-kit

aw-canvas-design 的画布标准件，包含流程模式和设计平铺模式。HTML 最初从流程画布抽出；卡片、视口控件和隔离预览两模式共用，入口旗、出口、判断、连线、流程树目录只适用于流程模式。新画布复制适用部分，再填所选模式数据：**视觉以适用的 HTML 标准件为准，逻辑以对应模式的 `reference/` 参考实现为准。**

## 目录

| 文件 | 内容 |
| --- | --- |
| `kit.css` | 全部 `--ck-*` token 与组件样式，HTML 标准件和参考实现共用 |
| `kit.js` | 仅供 HTML 标准件演示：内联图标（Phosphor Icons，MIT）与最小交互；参考实现不依赖它 |
| `index.html` | 标准件目录 |
| `page-card.html` | 页面卡片（方向 C：顶栏 / 预览 / 底栏）、入口小旗、出口、场景切换、加载骨架、选中态、宽页面 |
| `decision-node.html` | 判断节点（判断依据直接显示） |
| `reference-node.html` | 引用节点（单行，跨流程箭头） |
| `note-node.html` | 说明节点（单行，正文折叠） |
| `edge-styles.html` | 主路径 / 分支 / 异常三种线、扇出主干、同条件汇入、标签、呈现状态、悬停出口的临时去向线 |
| `sidebar.html` | 目录面板（侧栏组合、文件夹分组、连线筛选）与收起后的展开按钮 |
| `legend.html` | 一行图例（节点 + 连线两组，可收起） |
| `controls.html` | 右下角视口控件组及置灰态 |
| `canvas-shell.html` | 整页组合：中性淡灰画布、点阵、浮动目录、卡片与连线、图例、控件 |
| `reference/` | React + @xyflow/react + elkjs 参考实现（见下文） |

所有 HTML 都可以直接用浏览器打开（包括 `file://`），不需要构建。组件尺寸是画布缩放 100% 时的像素；`canvas-shell.html` 按 0.6 缩放展示整体效果。

## 在项目里使用

0. **核实现有能力**：先检查项目已有画布、框架和依赖；能满足本次需求就沿用，不为对齐参考版本而升级。确需新依赖时按项目约定选择兼容版本并取得所需授权。
1. **复制**：把 `canvas-kit/` 复制到项目的画布目录，画布路由挂在所属业务路由下（`/<业务路由>/design-canvas`）。
2. **映射 token**：项目有设计系统时，把 `kit.css` 顶部的 `--ck-*` 映射到项目 token（例如 `--ck-ink: var(--color-on-surface)`），组件结构与尺寸不变；缺少的中性灰等 token 在设计系统中补齐。
3. **换成设计系统组件**：有 Sidebar、Dialog、Tooltip、Button 时，用它们搭出与标准件同等的效果，不自写树、弹窗和提示。侧栏组合按项目实际导出核实；平铺使用组件类型 Section Group → 业务模块 Item，无文件夹/折叠树。没有同名 `SidebarSectionGroup` 时复用已有 Section/Header/Item 组合，不能虚构 API。
4. **填模式数据**：流程参照 `reference/flows.example.ts`；平铺参照 `reference/tiles.example.ts`，类型组下直接模块，模块内每个流程/相关场景组一行；接好真实组件、独立入口与尺寸/重置桥接。平铺实现细则见下节。
5. **逐项对照**：打开对应 HTML 标准件与自己的画布并排比较，再按 SKILL 的验收矩阵检查。

## 流程目录接入（仅 flow）

规则事实源为 [流程归属](../../references/modeling.md#流程目录归属仅-flow) 与 [目录呈现](../../references/canvas-presentation.md#flow-目录)。新流程显式设置 `kind: 'main' | 'subflow' | 'branch'`；根项用 `section: 'main' | 'other'`，从属项用 `parent` 跟随父项 Section。旧数据省略这些新增字段仍兼容：根项默认 main/主流程，从属项默认 subflow；实际业务归属不能靠兼容默认值代替审查。引用既有流程使用节点 `link`，不复制整套画布。

`directory.ts` 保留原 ID，按主流程/其他流程构建两级目录，拒绝悬空 parent、三级关系及从属项跨 Section；`sidebar.tsx` 保留首项主入口和全部缩进类型图标，无从属项直接导航。默认 Path / ArrowSquareOut / GitBranch 为 18px regular；换图标须语义等价且三类不同。`sectionLabels` 由宿主传入本地化标签，`icons` 也须遵守类型语义。组数计根任务，文件夹数量计主入口加从属入口。直达/切换目标时展开其父文件夹与 Section；URL、预览和返回仍由宿主回调管理。

`sidebar.html` 与 `canvas-shell.html` 使用另一个通用登录示例展示三类图标与两个任务 Section；具体已确认连接器案例仅见 [回归案例](../../tests/flow-directory.md)。这些静态标准件不提供实际业务路由，React 参考也不替代宿主 URL/返回/引用验收。

## 设计平铺接入

读取 [平铺建模与比较](../../references/design-tiling.md)。`types.ts`、`layout.ts`、`board.tsx`、`sidebar.tsx` 与流程路由例子仍是流程专用实现，不能传空 `edges` 当作平铺。平铺改用 `tiles.ts` 的独立集合/类型/模块/行/条目模型及 `layoutTiles`，目录参照 `tiles-sidebar.tsx`；组下仅直接模块 Item，卡片实例由模块内的行、清单/搜索及独立查看入口逐项呈现。

宿主渲染器接入规则：

- 选择模块后，将该模块的行与全部条目传给平铺计算器（保留对应类型组与模块元数据），用稳定 ID 接入现有画布库节点；每个有依据的流程/相关场景组一行，不自动换行，独立场景单卡成行。多模块概览可传完整集合。节点位置取 `positions`，行标题取 `rowTitles`；渲染 `sequence` 状态与证据，`unverified` 明显标记“顺序待核实”。
- 输入实测外部卡片尺寸；同组统一预览比例，尺寸变化重新计算平铺槽位、保留用户视口与手动偏移。`rowHeaderHeight` 为行标题/状态预留空间，不与卡片重叠。宽流程允许横向平移，重置布局清偏移但不清场景状态。
- 复用实际展示组件、卡片三段结构、说明、重置、拖拽命中区、视口控制及 `preview-frame.tsx` 的隔离承载能力；使用独立平铺卡片适配器，不渲染 `node.tsx` 的流程 handles、入口旗、出口及判断，不启用流程连线筛选或 `checkLayout`。不能复制原业务 UI 作为适配器。
- `source-only` 显示记录/缺口和独立查看入口；`interactive` 才挂载原组件预览及重置。清单/搜索定位全部条目，按需加载只减少同时挂载数，不减少覆盖；`tileCoverage` 分别计数，不把引用可达当交互验证。
- 所有 UI 标签通过项目国际化机制（示例为 `titleKey` / `t`）。选中模块的路由可用 `?mode=tiles&module={id}`，单条目用 `?item={id}`；源码记录与真实预览各有明确结果。

`tiles.ts` 是框架中立的布局/模型参考，`tiles-sidebar.tsx` 是侧栏组合示例；宿主原组件适配器、平铺画板/卡片渲染及路由需按项目实现，不宣称这些文件是完整可运行应用。

## 尺寸桥接适用范围

尺寸与动态高度以 [尺寸契约](../../references/component-design.md#预览视口与稳定尺寸) 为准。`preview-protocol.ts` 的 `usePreviewBridge(onReset, { ready, measure })` 默认只适用于首报即就绪、根尺寸无视口依赖的同步壳。异步场景显式传 `ready`；响应式 Dialog/Sheet 提供 `measure(element)`，在项目验证过的自然视口返回展示 `width/height` 与可选 `viewport: { width, height, x, y }`（未缩放坐标），无通用固定视口值。旧调用保留兼容；不能据此宣称异步场景就绪。

`preview-frame.tsx` 验证消息后，保持 `viewport.width/height` 为渲染尺寸，按 `x/y` 外部偏移并用展示宽高占位，再应用缩略比例；外框可双向增减。`ready:false` 保留最后提交几何并显示骨架，首次无提交值时保留安全初始尺寸；目标内容和布局就绪后才发 `ready:true` 并提交完整几何，稳定采样仍单独验收。外层按稳定卡片身份保存几何，`src` 切换只用 key 重挂内部 iframe，不能重建整张卡片丢失尺寸。所有尺寸消费者在提交前共用 readiness 判断；异步发送方在切换/重置前清除 readiness。参考实现未提供同一 iframe 重载/异步重置的代次握手与失败重试 UI，宿主按尺寸契约补齐 token 隔离及加载失败保留几何的反馈，不能将参考文件当作这些能力已完成。

桥接观察根元素的 ResizeObserver、DOM 变化、字体就绪、窗口变化和重置；Portal 不在根内或组件替换时，宿主须扩展到当前实际组件的观察范围。测量器应返回完整组件、必要留白及交互范围，不能对组件库内部样式作补丁；外部区域不足以容纳菜单时须动态扩展或采用经验证的承载方案。接入后按验收矩阵验证动态内容、原有内部滚动、操作可达与收敛，不把参考实现当作完整宿主验证。

## 参考实现（`reference/`）

此参考实现曾用 `react` / `react-dom` 19.3.0、`@xyflow/react` 12.11.6、`elkjs` 0.12.0 验证；这些版本不是目标项目的限制。`@phosphor-icons/react`（曾用 2.1.10）只是图标，可以换成项目图标。样式全部来自 `kit.css` 的类名。既有流程参考实现曾用 TypeScript strict 模式通过类型检查，并实际打包运行验证：连线指标通过、拖动几何自检通过，info Dialog 显示在画布之上，悬停出口时出现临时去向线。

| 文件 | 职责 |
| --- | --- |
| `tiles.ts` / `tiles.example.ts` | 平铺独立模型与示例：类型组、业务模块、显式行和来源/能力；实测行列布局、完整条目排序及分离覆盖计数，不依赖 ELK |
| `tiles-sidebar.tsx` | 平铺类型 Section Group → 直接业务模块 Item；无文件夹/折叠树，使用国际化键 |
| `types.ts` | 数据模型：节点四类（页面、判断、引用、说明）、边三类（主路径、分支、异常）、`exits`、`variants`、`parent` 两级及可选 `kind`/`section`；数据工厂函数 |
| `directory.ts` | flow 主流程/其他流程分组、两级归属校验与兼容类型推断 |
| `layout.ts` | ELK 选项与端口：24px 基线端口、右侧下半部分支端口、按条件分组的入口、单行节点底边入口、标签放末段 |
| `metrics.ts` | 连线指标自检，结果写到画板根节点的 `data-checks` |
| `reroute.ts` | 拖动后只平移首末段的 `rerouteOf`，以及拖动几何自检 `checkDragGeometry` |
| `edge.tsx` | 圆角正交路径与统一样式的标签 |
| `node.tsx` | 四类节点、入口小旗、info Dialog、重置场景、场景切换、出口（悬停去向线或提示）、nodrag 拖动命中区 |
| `preview-frame.tsx` | 隔离的 iframe 预览：限流加载、就绪骨架、独立渲染视口与动态展示区域、外部缩放 |
| `preview-size.ts` | 无运行时依赖的尺寸消息类型、边界校验与 readiness 提交门槛，供消费者及测试共用 |
| `preview-protocol.ts` | 画布与预览的 postMessage 协议：`size`（预览 → 画布）与 `reset`（画布 → 预览） |
| `sidebar.tsx` / `legend.tsx` | 目录与图例（通用 HTML 版；有设计系统时换成其组件） |
| `board.tsx` | 画板：默认视口适配全图、Shift+1 / Shift+2、右下控件、筛选与聚焦、悬停出口的临时线、拖动 reroute、`data-checks` |
| `flows.example.ts` / `canvas-page.example.tsx` | 示例流程与画布页路由（`?flow=`、`?preview=`、`?screen=`） |

不要用父级 `visibility: hidden` 保留已访问流程的画板：画布库会在节点上写行内 `visibility`，其他流程的卡片会透出来。想加快加载，优先给预览做轻量的独立入口页，避免每个 iframe 都启动整个应用。

## 平铺参考验证

布局行为检查（运行时支持 TypeScript 类型擦除的 Node；其他环境用已有 TS 测试运行器）：

```bash
node --experimental-strip-types --test aw-canvas-design/tests/tiles.test.mjs aw-canvas-design/tests/preview-size.test.mjs aw-canvas-design/tests/flow-directory.test.mjs
```

测试覆盖逐行排列、宽卡片不压缩、动态尺寸后的不重叠、源码记录保留、完整条目覆盖、计数区分及无效关系拒绝；尺寸协议另验独立视口下展示高度双向变化、loading 保留初始/已提交值、切换/重置/重载及失败后的恢复、后续双向变化、旧消息兼容、有限正尺寸、就绪类型、展示原点和边界拒绝。模式选择与边界自查见 [走查用例](../../tests/mode-routing.md)；这些检查不替代宿主浏览器中的组件交互和尺寸收敛验收。

流程目录测试覆盖根任务聚合、主入口保留、子/分支归属、跨流程引用不复制、原 ID 与预览不变、旧模型兼容及非法层级拒绝；浏览器仍需实测图标、折叠、选中、URL 和预览返回。
