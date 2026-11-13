# AaronUI-Web 知识访问契约

需要组件、关联 Docs 或 Example 时读取。本文仅维护访问方法，不保存组件文案规则。按实际部署工具 schema 调用；源项目 `mcp/README.md`、`mcp/contracts.ts` 和服务公开契约用于核对，内部存储 schema 不等于客户端响应。差异需记录，不把源码核对宣称为已部署验证。

## 服务与发现

本地只读 Streamable HTTP 默认 `http://127.0.0.1:7331/mcp`，由用户手动启动。先检查宿主实际暴露工具；未暴露/连接失败时准确报告，不用网页读取冒充 MCP 调用，不擅自安装、启动或改全局配置。用户给出的 Gallery 页面可以作为明确标注的页面证据，但不证明 MCP 可用或读取完整。

| 工具 | 用途与要点 |
| --- | --- |
| `get_rule_bundle` | 一次取至多 8 个目标（component / doc / style / scenario / exampleId）的规则包，附适用范围与 `coverage`；审查和指导取规则的首选入口。除主组件外，须同时选上实际用到的布局 Doc 与组合组件，包括容器内部的滚动、选择、菜单等组件 |
| `search` | 按任务语义、组件名发现 Component / Doc / Style / Scenario；按当前服务支持的名称、description、关键词和章节标题检索，不把它当作全文或语义检索；只返回元信息，不代表已读规则。无匹配可换词或浏览目录 |
| `list_documents` | 按需筛选 `type`、`group`、`relatedTo`，分页到 `nextCursor=null`；Wording Docs 用 `type:doc`、`group:Wording` 发现 |
| `get_document` | 使用发现的 ID、章节或 `read.arguments` 选读；跟进适用的 `related[].read`。Doc 的显式规则通过目录提供的 `core-rules` 读取，不把普通文章、演示或预览值升格为规则 |
| `get_design_rules` | 涉及 Gallery 设计选项到 Props 映射时读取公共约定，纯文案取证不必调用 |
| `list_examples` | 当前专用源码入口仅支持 Dialog Basic / Dialog 场景；选择 Example 时读完整分页目录；其他类型以实际服务支持范围为准 |
| `get_example` | 使用发现的 `exampleId`；`files` 只选响应的 `availableFiles`，每次上限按 schema。源码依赖 Gallery 上下文，不等于可直接移植 |

`get_rule_bundle` 的 `scope.complete=false`、`deferred` 非空，或 `coverage` 为 `not-declared` / `unavailable` 时，表示规则未展开或未读到：调整 `targets` 或用 `get_document` 选读补查，不能当作无规则；补不全记待验证。`validation` 中 visual / animation / interaction 为 `not-performed` 时，不代表这些方面通过。

发现结果先看名称、description、适用时机、章节及可调用的读取引用，再判断相关性。组件相关章节和关联 Docs 均按判断需要读取。related/search 只提供发现线索，不自动展开规则；没有 related 也不证明没有 Wording 规则。Example 的存在不证明独立组件规范或 Docs 已覆盖。局部文案路径不要求无关 Example 实现遍历，完整组件 guidance / audit 的参考选择仍按工作流执行。

## 响应与证据

当前源项目 MCP 4.1 公开契约：成功响应为 `content` 文本中的直接 JSON；无 `ok/data` 包装、`structuredContent`、公开输出 schema 或 revision。错误为 `{error,code}` 并设置 `isError:true`。文档与 Example 输入不传 `expectedRevision`。以实际暴露 schema 为准，不能混用旧 v3 字段；旧服务仍暴露另一契约时记录版本差异和证据限制。

记录真实资料 ID、章节、`galleryUrl` / 章节 URL、读取时间、服务版本（可得时）与目标基线；没有 revision 不自造 hash，也不因此默认每次重读。无法确认原始证据、适用范围或来源是否变化时局部补读。链接不等于视觉检查，API/源码可读不证明运行效果。

`get_example` 的 `rules.status`：

| status | 含义与处理 |
| --- | --- |
| `available` | 只采用适用于当前场景的规则正文，按返回的名称/锚点等核实范围；不套用相邻子场景规则 |
| `none` | 当前声明范围无附加规则，独立组件和 Doc 仍须核对 |
| `not-declared` | 未声明绑定，不证明无规则，记录覆盖缺口 |
| `unavailable` | 规则读取失败，保留 issues，相关结论待验证 |
| 缺失 / 未知 | 契约待验证，不降级为无规则 |

## 错误与引用

`NOT_SUPPORTED_YET` 是对应资源未覆盖；`NOT_FOUND` 需核对发现所得 ID，不等同整个组件未覆盖。参数/章节错误修正后重试；源、文档或传输失败保留实际错误，相关结论待验证。空目录或空搜索不能代替相关规则读取，不能回退旧 checker 或静态规则冒充规范。

引用：`资料 ID / URL · 章节 / 规则 ID · 读取基线 → 目标位置 / 观察证据`。报告不是下次任务的规则副本；证据状态与复用条件按 [工作流](workflow.md) 执行。
