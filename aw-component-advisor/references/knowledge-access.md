# AaronUI-Web 知识访问契约

需要规范或 Example 时读取。本文只保存访问方法与证据边界；参数和响应字段以已部署服务的工具 schema、源项目 `mcp/README.md` 与 `mcp/contracts.ts` 为准，本文与它们不一致时以服务为准并记录契约缺口。

## 服务

只读的本地 Streamable HTTP MCP，默认 `http://127.0.0.1:7331/mcp`，由用户按源项目 `mcp/README.md` 手动启动。按宿主注册名调用工具，不用网页读取冒充协议调用。未连接时报告依赖与受影响范围；安装依赖或改全局配置需要已有具体授权。

| 工具 | 用途与要点 |
| --- | --- |
| `list_documents` | 规范目录、章节 ID 与 revision；分页至 `nextCursor=null` |
| `get_document` | 按 `type`、`id` 与 1–20 个 `sections` 读取相关章节，携带发现所得 `expectedRevision` |
| `list_examples` | Gallery 当前 Example 完整目录与 `coverage`；先不以关键词缩窄 |
| `get_example` | 用目录项 `id` 与目录 `revision` 读取源码、CSS、依赖与附加 `rules`；`files` 只能从 `implementation.availableFiles` 选取，每次最多 30 个 |

`resources/*` 只有目录元信息，正文与实现通过工具读取。MCP 不返回 Gallery Docs 文章，不请求 Docs。

## 响应与证据

响应是 `{ok, data | error}` envelope，消费 `.data`；`ok:false` 或 `isError` 不能当作空成功。只引用响应中的真实 ID、路径、章节与 revision，不自造。遇到 `REVISION_MISMATCH` 重新发现并补读受影响证据。

`coverage` 说明目录边界：运行条件和动态组合留在父源码中，不能声称已枚举所有运行组合；Example 存在不代表独立规范已覆盖。实现为 `source-reference`：默认返回父源码、入口与直接 CSS，其余依赖按需补读，记录 `context.unreturnedFiles`；`context.status:"requires-gallery-context"` 不等于可独立运行。

`get_example` 的 `rules.status` 决定规则判断能否成立：

| status | 含义与处理 |
| --- | --- |
| `available` | 按每项 `scope` 选取适用于当前样例/子场景的规则，引用 `body` 与 `source`；不把相邻子场景规则套给当前任务 |
| `none` | 当前声明范围无附加规则；独立组件规范仍须核对 |
| `not-declared` | 未声明绑定，不能推断无规则；记录规则覆盖缺口 |
| `unavailable` | 规则读取失败，保留 `issues` 并待验证；外层 `ok:true` 也不代表规则完整 |
| 缺失 / 未知 | 契约待验证，不降级为无规则 |

## 错误

- `NOT_SUPPORTED_YET`：对应类型未覆盖。
- `NOT_FOUND`：支持类型下找不到该 ID，核对目录与基线后记录差异，不等同整个组件未覆盖。
- 参数类错误（`INVALID_ARGUMENT`、`SECTION_NOT_FOUND`）修正后重试；源或服务故障（`SOURCE_UNAVAILABLE`、`INVALID_DOCUMENT`、传输失败）记待验证，继续不依赖它的工作，不回退历史 Reference 或内置规则。

依据写作 `<资源 ref / exampleId> · <source.path> · <revision> · <章节 / 实现位置> → <目标位置 / 观察证据>`。报告不成为下次执行的规范副本。
