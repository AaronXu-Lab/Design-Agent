# Design Agent

中文 · [English](./README.md)

收录 **8 个活跃 Skill**，用于 UI/UX 设计塑形、组件指导与审查、真实用户任务走查。

## 安装

```bash
npx skills@latest add AaronXu-Lab/Design-Agent
npx skills@latest add AaronXu-Lab/Design-Agent --skill aw-design-orchestrator
```

本地软链接安装运行 `python3 link-skills.py`；用 `--dry-run` 预览，或用 `--target` 指定 Skill 目录。已有冲突条目会被保留。

## Skills

### 设计 · Agent

直接参与界面判断、审查和表达质量控制的设计 Agent。

| Skill | 版本 | 它解决什么问题 | 关键边界 |
| --- | --- | --- | --- |
| [`aw-design-orchestrator`](./aw-design-orchestrator/) | `1.5.0` | 顺序编排塑形、实时组件指导、AaronUI-Web 实现、审查、任务走查与文案收敛，提供独立 `/help` | 维护阶段顺序、产物交接、人工 Review、独立会话交接与续接；专项方法和规则由对应 Skill 维护；后续变更仅复查受影响阶段 |
| [`aw-design-shaping`](./aw-design-shaping/) | `1.5.0` | 通过聚焦追问、竞品研究与线框图，共同塑形 UI/UX 方向 | 线框图与低保真比较以会话内 inline-html 展示，宿主限制说明后才降级；仅指明方向与补足空白；明确任务直接推进；AI 提案服从匹配 Example 规则，简报标清来源和实施状态；交接组件指导，不复制规则或自动实施正式界面 |
| [`aw-canvas-design`](./aw-canvas-design/) | `1.12.0` | 在流程模式审查业务分支，或平铺真实页面、Dialog、Sheet 做比较，提供 canvas-kit、隔离预览与覆盖记录 | 复用项目能力和共享展示；卡片高度跟随真实内容，分离渲染视口与展示边界；加载、切换和重置保留已提交几何，目标内容和布局就绪才更新；流程按主流程/其他流程分组，主/子/分支异形图标，文件夹保留主入口；平铺类型组下直接业务模块，一流程一行；可选组件状态平铺不混入操作弹窗，明确审阅弹窗自身时除外；Dialog 用法变化按需指导/审查；业务迁移须明确要求 |
| [`aw-component-advisor`](./aw-component-advisor/) | `1.3.0` | 实现前指导 AaronUI-Web 组件用法，实现后通过同一实时知识源审查 | 从实时 Gallery 目录读取 Example 与明确规则并回校简报；只保存方法，无规则副本或旧 Reference 兜底；源码是精确 API 依据；Dialog / Sheet 动效接入与初版即时检查，进入、退出和重开须有动态证据，区分减少动态效果与静态预览；未覆盖和待验证不算通过 |
| [`aw-ux-info-redundancy-audit`](./aw-ux-info-redundancy-audit/) | `1.8.0` | 审计信息任务价值、语义重复、适用阶段与视觉承载物必要性 | 实施前交付证据与最小改动决策；Dialog 用法受影响时交接组件审查，不替代信息价值判断 |
| [`aw-flow-completeness-audit`](./aw-flow-completeness-audit/) | `1.2.0` | 审查步骤、分支、转换、交接、恢复与可观察结果，交付证据和最小补全建议 | 已实现界面优先；人工 Review 后才实施获准修复；同步已有简报；Dialog 用法变化局部复核，不替代流程结果验证 |
| [`aw-task-walkthrough`](./aw-task-walkthrough/) | `1.2.0` | 独立走查用户选定的可交互原型或产品任务，判断理解、发现、负担与结果 | 文案前以新会话执行；可读完整 PRD，简报仅辅助规划；不预读组件规则或旧审查；真实交互后交人工 review，默认只报问题不修复 |
| [`aw-wording-reviewer`](./aw-wording-reviewer/) | `0.14.0` | 审查简体中文排版、术语、数据展示与微文案 | 默认只审查；组件约束相关时才读取当前源；获准修改影响 Dialog 用法时局部 audit；不用于其他语言或信息架构 |

统一入口为 [`aw-design-orchestrator`](./aw-design-orchestrator/)，调用时附带 `/help` 可单独查看新手帮助。

建议顺序：塑形 → `aw-component-advisor guidance` → 当前执行者用 AaronUI-Web 真实组件与 DESIGN.md 实现 → 信息冗余审计 → `aw-component-advisor audit` → 流程完整性审查 → 人工 Review 与获准修复 → 独立任务走查 → 人工 Review 与获准修复 → 文案收敛。两模式读取同一规范；后续改动影响组件用法时局部复核，未变证据复用。关键决定变化同步简报；Wording 保留一致化规则，包括必要的解释性重复。首次独立走查不预读组件规则、Example 参考或前序发现。

## 依赖与校验

完整主流程使用 `aw-design-orchestrator`，也可独立调用各 Skill。画布审查可单独使用。各自输入与授权边界以 `SKILL.md` 为准；交互走查需要浏览器访问，研究可能需要网络访问。

`aw-design-fake` 等设计支撑 Skill 仍在 [AaronSkill](https://github.com/AaronXu-Lab/AaronSkill)，需要时单独安装，不假设相邻仓库目录存在。Skill 维护使用 AaronSkill 中的 `aw-meta-skill` 和基础 `skill-creator` 校验器。

[AaronUI-Web 知识 MCP](https://github.com/AaronXu-Lab/AaronUI-Web/tree/main/mcp) 手动启动，以 v3 的 `list_documents` 和 `get_document({type,id,sections})` 发现并选读组件章节；通用 Example 发现/读取使用 `list_examples` 和 `get_example`，参数以当前服务 schema 为准。默认 Streamable HTTP 端点为 `http://127.0.0.1:7331/mcp`，端口可用 `MCP_PORT` 修改。在该仓库执行 `npm ci --prefix mcp` 安装依赖，再执行 `npm --prefix mcp start`，按服务文档配置宿主 MCP 客户端。无需云端服务、自动启动或外部设计生成器。

塑形只指明方向并补足空白，简单明确任务不新增确认关口。用户真正明确的要求优先，其次默认采用匹配 Example 的明确规则和结构，AI 提案不能覆盖。guidance 回校简报并记录决定来源与差异。按当前 MCP 契约区分无规则与规则证据缺失/不可读；未完成规则读取保持待验证。


规范覆盖与 Example 参考以当前服务目录为准。advisor 读完整分页目录后选择相关实现；没有明显候选时，读完任务组件范围内的全部实现才判定无适用参考。未通过移植验证的源码仍可参考，直接移植需独立证据。匹配 Example 后默认沿用其结构与组件组合，只按用户需求和适用规范调整；`source-reference` 仅表示需要适配依赖，不代表需要重新设计。实现或修复完成后，按适用维度对照原 Example 的实际渲染，无差异也保留证据。逐项说明差异的对齐、用户明确要求或有效业务保留依据、或证据缺口；仅公开 API 支持不足以支持偏离。无法对照时标记待验证。精确 API/行为来自当前 TypeScript 源码。不支持的资源类型记为未覆盖；来源不可用、正文无效或证据缺失仍为待验证。Skill 不保存组件规则副本，也不回退旧 checker。旧包的整个 `references/components/` 目录与静态索引已移出当前包，Git 历史保留原文；Example 可读取不代表独立规范已覆盖。MCP 不返回 Docs 目录、正文或 Docs requirements；Gallery Docs 页面与文案规则不变。响应和引用字段见 [访问契约](./aw-component-advisor/references/knowledge-access.md)。

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py ./<skill-name>
python3 /path/to/aw-meta-skill/scripts/validate_aw_skill.py ./<skill-name>
```

最初从 [AaronSkill 提交 0f430b6](https://github.com/AaronXu-Lab/AaronSkill/tree/0f430b6) 迁入，更早的历史保留在原仓库；活跃设计 Skill 在此维护。用户产品验收与 Skill 结构校验、工程检查分别记录。
