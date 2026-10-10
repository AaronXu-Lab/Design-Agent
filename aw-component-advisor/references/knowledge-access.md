# AaronUI-Web 知识访问契约

guidance 或 audit 需要规范或 Example 时读取。此文件保存访问方法与证据边界，不维护规范正文、Gallery 目录或业务场景注册表；精确 API 与行为按当前 TypeScript 源码核实。

## 定位服务与请求

使用当前环境已连接的 AaronUI-Web 本地知识 MCP，按其注册名称调用工具；宿主可能添加前缀，不固定某一宿主名称。启动、配置与排错查源项目的 `mcp/README.md`，精确参数和响应查该项目 `contracts.ts` 与工具公开 schema。不得把实现机器的绝对路径写进 Skill。

服务是手动启动的只读 Streamable HTTP，默认端点 `http://127.0.0.1:7331/mcp`，可用 `MCP_PORT` 改端口。先按源项目文档安装仓库开发依赖与 MCP 依赖（`npm ci --prefix mcp`），手动运行 `npm --prefix mcp start`。连接由宿主 MCP 客户端完成，不把网页读取冒充协议调用。Skill 不把安装依赖或修改全局配置视为隐含授权；已有具体授权则继续，未连接时报告依赖与受影响范围。

| 工具 | 访问方法 | 用途 |
| --- | --- | --- |
| `list_documents` | 当前仅 `component/dialog-basic`；可选 `type`、`query`、`relatedTo`、`cursor`、`limit`；使用响应中的真实资源和章节 ID | 文档目录、关联和 revision；分页 `nextCursor=null` 才结束 |
| `get_document` | 必填 `type`、`id`、`sections`（1–20 个唯一章节 ID）；可选发现所得 `expectedRevision` | 按需读相关章节、来源与当前约束；不沿用 v1 无 sections 的全文调用 |
| `list_examples` | 可选 `pageId`、`component`、`query`、`cursor`、`limit`（1–100，默认 20）；筛选取交集，先不以关键词缩窄完整目录 | Gallery 当前数据/实现自动生成的 Example 目录，完整读取流程见工作流 |
| `get_example` | 必填目录项 `id` 作为 `exampleId`；携带目录 `revision` 作为 `expectedRevision`；可选 `files`（1–30 个唯一允许路径） | 读取详细源码、CSS、依赖及必要上下文，含仅供参考的实现 |

Example 的最终参数以已部署服务的当前 README、类型和公开 schema 为准。服务 3.1.0 在 v3 envelope 中新增必返 `rules`；严格输出校验客户端须同步当前 schema，不能仅按 envelope 版本判断兼容。`files` 补读也返回规则。`files` 只从详情 `implementation.availableFiles` 选择精确路径继续读取，用于补足源码、样式与上下文，不能请求任意文件；核对 `implementation.context.unreturnedFiles`、上下文说明与依赖索引并记录缺口。若服务缺少通用目录或详情能力，记录接口未完成，不伪造成功调用。不得把旧业务场景 ID、展示名或导出名写成通用访问假设。

`resources/list` / `resources/read` 的 v3 资源仅为组件目录元信息，Docs 与 scenario URI 不支持，正文和实现通过工具读取，不把资源 URI 当网页，也不把目录读取当作源码阅读。目录存在不证明规范覆盖、读取成功或移植通过。MCP 不返回 Docs 目录、正文或指向 Docs 的 requirements，不请求 `doc/dialog-guidelines` 或其他 Docs。Gallery 的 Docs 页面仍保留，文案规则本身与后续 wording 阶段不变；本次不增加文案分类、强制全文读取或重做文案处理机制。

## v3 响应与证据

`structuredContent` 和 `content[0].text` 是同一 JSON envelope：成功为 `{schemaVersion:3,ok:true,data}`，失败为 `{schemaVersion:3,ok:false,error}`；`isError` 与 `ok` 相反。消费 `.data`，不要继续使用 v1 顶层 `documents` / `document` 或 `schemaVersion:1`。

文档目录提供真实组件 ref、章节目录和 revision；详情提供 `ref`、`revision`、`selectedSections` 和 `sources`，不再返回 `requirements`。`sources` 按原始 UTF-8 文件给出 `id`、仓库相对 `path` 和 `sha256:` revision；资源/Example revision 可能还包含传递依赖和元数据，不能将它与单文件 hash 混用。引用返回的真实字段，不自造 hash、路径、章节或 Example ID。以发现所得 `expectedRevision` 关联读取；遇到 `REVISION_MISMATCH` 时重新发现并补读受影响证据。

Example 目录返回 `examples`、`revision`、`total`、`nextCursor` 与 `coverage`（scope/pages/notes）。目录项含 `id`、带分类的 `pageId`（如 `components/dialog-basic`）、组件引用、设计轴/默认值、来源路径和上下文说明等。ID 来自真实注册页面、位置、声明轴/取值或可静态解析的子 DocSection，在目录 revision 内稳定；插入或重排可能改变位置 ID，因此读取时携带发现所得 revision，不自行拼 ID。

覆盖说明是边界证据：注册样例、声明轴取值和可静态解析的子 DocSection 自动入目录；运行条件、动态组合及无法平铺的内容保留在完整父源码，不能声称已枚举所有运行组合。Gallery Docs 文章不在目录中；样式、规则、场景、内部/临时页面则由 `pageId` 识别。组件引用仅辅助参考选择，不代表规范覆盖。

详情的既有字段为 `example`、`revision`、`sources`、`implementation`。附加规则消费前须检查当前源项目 `mcp/contracts.ts`、`mcp/README.md` 和实际工具响应，核实 `rules` 的精确结构、正文、适用范围、来源版本以及无规则/读取缺失的表达；不得猜子字段、固定业务名单或将规则退化为目录摘要。未部署该契约、字段缺失或无法取得正文时标记规则待验证，不能解释为“无规则”，也不能宣称已完成规则核对。仅服务明确报告无附加规则时记录无规则；已有独立组件规范仍须照常核对。规则内容来自当前 Gallery 同源资料，不在 Skill 保存规范副本。

当前 `contracts.ts` 的 `rules` 为 `{status, items, issues}`：`status` 是 `available | none | not-declared | unavailable`；`items` 每项含 `sectionId`、`title`、`body`、`scope:{exampleId,pageId,anchor?}` 与 `source:{id,path,revision}`。父 Example 可返回多个声明区块，子 Example 包含适用规则（含父级通用规则）；按 `scope` 判断当前样例/子场景适用性，引用 `body` 与真实来源版本；不能把父级返回的其他子场景规则套给当前任务。`issues` 保留 `code`、`message` 及可选 `sourcePath`、`sectionId`。

- `available`：读取适用正文后才形成规则判断；源码读取成功仍不证明目标实现合规。
- `none`：仅表示当前声明范围无适用附加规则，不代表无独立组件规范。
- `not-declared`：未声明绑定，不能推断无规则；记录规则覆盖缺口。
- `unavailable`：声明规则读取失败，保留 issues 与待验证状态；即使部分 items 可读也不能称规则完整。外层可仍为 `ok:true`，因为源码取得成功，不能以外层成功替代规则状态检查。
- 缺少 `rules` 或不认识的状态：部署/契约待验证，不降级为空成功。

以上字段已按源项目 README、类型、严格输出 schema 与规则读取实现核对；部署响应仍须在实际任务中验证，源 README 或公开 schema 不一致时保留契约缺口，不将本文件当作高于当前服务的固定 schema。

实现为 `mode:"source-reference"`，包含 `renderSource`、`files`（path/revision/content）、`availableFiles`、`dependencies` 和 `context`。默认返回父注册源码、入口实现及直接 CSS；`availableFiles` 列出递归解析的 Gallery 文本依赖，`dependencies` 区分 Gallery 源码、包、资产和 Gallery 外引用。按任务分批补读需要的文件，记录 `context.unreturnedFiles` 与无法取得的外部上下文；`context.status:"requires-gallery-context"` 不等于已独立运行。

原始源码始终可参考，响应不提供 v2 的 `reuse`、copy-ready 声明或 Information 移植证明。不因验证缺失隐藏参考，也不以源码访问推断可直接移植。复用前核对调用方状态、导入、资产和公开 API，目标项目的实际验证另行记录。若必要源码/CSS/上下文不足，保留缺口，不用摘要代替实现或声称已读。

## 错误与交接

`NOT_SUPPORTED_YET` 表示对应类型未覆盖；`NOT_FOUND` 是当前支持类型下找不到所请求 ID，核对目录和变更基线后记录具体差异，不自动等同于整个组件未覆盖。`INVALID_ARGUMENT`、`SECTION_NOT_FOUND`、`SOURCE_UNAVAILABLE`、`INVALID_DOCUMENT`、`REVISION_MISMATCH` 与传输失败保留为待验证或可修正读取错误，不能合并成空成功。参数错误可修正重试；源或服务故障继续不依赖它的工作，核心证据无法取得时暂停相应结论，不回退历史 Reference 或内置规则。

依据可写成 `<资源 ref / exampleId> · <source.path> · <revision> · <章节 / 实现位置> → <目标位置 / 观察证据>`。记录完整目录分页状态、任务组件范围、已读/未读项和参考差异；具体选择与无候选恢复规则只在 [工作流](workflow.md) 维护。报告不成为下次执行的规范副本。动态证明另附入口、状态、操作与结果；修复后重新核实当前基线与受影响证据。
