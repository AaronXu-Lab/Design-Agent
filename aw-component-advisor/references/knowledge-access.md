# AaronUI-Web 知识访问契约

guidance 或 audit 需要组件规范时读取。此文件只记录访问方法与证据边界，规范正文维护在 AaronUI-Web 的 `gallery/content/components/dialog.md`；Gallery 与本地 MCP 消费同一内容。源码是精确 API 与行为依据。

## 定位服务与请求

使用当前环境已连接的 AaronUI-Web 本地知识 MCP，按其注册名称调用下列工具；宿主可能给名称添加前缀，不把某一宿主的前缀写成固定接口。服务手动启动，配置与排错查 AaronUI-Web 的 `mcp/README.md`，共享格式见 `gallery/content/README.md`；不嵌入实现机器的绝对路径。未连接时报告依赖及受影响范围，沿用已有启动/配置授权。

当前服务使用无会话状态的 Streamable HTTP，默认端点 `http://127.0.0.1:7331/mcp`，可用 `MCP_PORT` 改端口。在 AaronUI-Web 根目录安装服务依赖 `npm ci --prefix mcp`，再手动运行 `npm --prefix mcp start`。Skill 不把依赖安装或全局客户端配置视为隐含授权；已有具体授权则继续。连接由宿主的 MCP 客户端完成，不把普通 HTTP 页面读取冒充协议调用。

| 工具 | 请求 | 用途 |
| --- | --- | --- |
| `list_documents` | `{}` 或 `{type: "component"}` | 列出当前真正支持的文档与标识，不以 Gallery 导航推断覆盖 |
| `get_document` | `{type: "component", id: "dialog"}` | 获取当前 Dialog 规范及来源信息，供两模式共用 |

服务同时公开只读资源 `aaronui://component/dialog`；本工作流优先使用上述 tools，不能把资源 URI 当成浏览器网页。

不自动将展示名、`DialogBasic` 导出或其他 Gallery ID 当成 `dialog` 别名；正文明确描述的组成能力在文档范围内核对。只有独立资源明确出现在服务支持范围内，才能宣称它被支持。本轮没有独立场景或规则工具，也不增加复杂搜索。

## 响应与证据

工具 `content` 中的文本是 JSON，同时提供 `structuredContent`：

- 列表成功：`{ok: true, documents}`；列表元信息含 `uri`。
- 读取成功：`{ok: true, document}`；`document` 包含 `schemaVersion: 1`、`type`、`id`、`title`、`summary`、`source: {path, revision}`、Markdown `body`，及 `sections: [{id, title, level: 2, body}]`。
- 失败：`isError: true`，内容为 `{ok: false, error: {code, message, requested?, supported}}`。传输错误可能没有此 envelope，单独记录。

`source.path` 是仓库相对路径；`source.revision` 是原始 UTF-8 源文档的 `sha256:` 哈希。读取器每次请求重新读取源文件。以返回的真实 `source` 和 `sections[].id` 引用依据，不自造 hash、路径、章节或规则 ID。`body` 是同一规范正文，sections 用于定位，并非第二套独立规则。列表成功只证明发现能力，不等于读取或审查成功。

未知 type/id 的 `NOT_SUPPORTED_YET` 是**未覆盖**；`INVALID_ARGUMENT`（参数不合法）、`SOURCE_UNAVAILABLE`（源不可读）、`INVALID_DOCUMENT`（内容不合法）与传输失败是**待验证**，不能合并成空成功。修正本次参数错误后可重试；服务或源故障报告具体缺口，不自动回退旧 Reference、从历史报告拼规则或猜测未支持 API。发现清单与实际读取不一致时报告差异并保留相关结论。

审查依据可写成 `component/dialog · <source.path> · <source.revision> · <sections[].id / 章节内规则> → <目标位置/证据>`。正文没有独立规则 ID 时使用章节与原文定位，不创建独立注册表。修复后重新核实本次基线是否仍有效；动态证明另附入口、状态、操作与结果。
