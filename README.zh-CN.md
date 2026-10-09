# Design Agent

中文 · [English](./README.md)

收录 **8 个活跃 Skill**，用于 UI/UX 设计塑形、组件指导与审查、真实用户任务走查；另保留 1 个弃用兼容入口，共 **9 个 Skill 目录**。

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
| [`aw-design-orchestrator`](./aw-design-orchestrator/) | `1.1.0` | 顺序编排塑形、实时组件指导、AaronUI-Web 实现、审查、任务走查与文案收敛，提供独立 `/help` | 保留人工 Review 与新会话交接；明确 Dialog-only 知识缺口；后续改动只触发受影响组件复核 |
| [`aw-design-shaping`](./aw-design-shaping/) | `1.2.0` | 通过聚焦追问、竞品研究与线框图，共同塑形 UI/UX 方向 | 用户选择探索方式与关键取舍；简报同步已批准决定和实施状态；交接组件指导，不复制规则或自动实施正式界面 |
| [`aw-canvas-design`](./aw-canvas-design/) | `1.8.0` | 在流程模式审查业务分支，或平铺真实页面、Dialog、Sheet 做比较，提供 canvas-kit、隔离预览与覆盖记录 | 复用项目能力和共享展示；类型组下直接业务模块，一流程一行；区分源码记录与交互覆盖；Dialog 用法变化按需指导/审查；业务迁移须明确要求 |
| [`aw-component-advisor`](./aw-component-advisor/) | `1.0.0` | 实现前指导 AaronUI-Web 组件用法，实现后通过同一实时知识源审查 | 本轮仅 Dialog；只保存方法，无规则副本或旧 Reference 兜底；源码是精确 API 依据；未覆盖和待验证不算通过 |
| [`aw-ux-info-redundancy-audit`](./aw-ux-info-redundancy-audit/) | `1.8.0` | 审计信息任务价值、语义重复、适用阶段与视觉承载物必要性 | 实施前交付证据与最小改动决策；Dialog 用法受影响时交接组件审查，不替代信息价值判断 |
| [`aw-flow-completeness-audit`](./aw-flow-completeness-audit/) | `1.2.0` | 审查步骤、分支、转换、交接、恢复与可观察结果，交付证据和最小补全建议 | 已实现界面优先；人工 Review 后才实施获准修复；同步已有简报；Dialog 用法变化局部复核，不替代流程结果验证 |
| [`aw-task-walkthrough`](./aw-task-walkthrough/) | `1.2.0` | 独立走查用户选定的可交互原型或产品任务，判断理解、发现、负担与结果 | 文案前以新会话执行；可读完整 PRD，简报仅辅助规划；不预读组件规则或旧审查；真实交互后交人工 review，默认只报问题不修复 |
| [`aw-wording-reviewer`](./aw-wording-reviewer/) | `0.14.0` | 审查简体中文排版、术语、数据展示与微文案 | 默认只审查；组件约束相关时才读取当前源；获准修改影响 Dialog 用法时局部 audit；不用于其他语言或信息架构 |

统一入口为 [`aw-design-orchestrator`](./aw-design-orchestrator/)，调用时附带 `/help` 可单独查看新手帮助。

建议顺序：塑形 → `aw-component-advisor guidance` → 当前执行者用 AaronUI-Web 真实组件与 DESIGN.md 实现 → 信息冗余审计 → `aw-component-advisor audit` → 流程完整性审查 → 人工 Review 与获准修复 → 独立任务走查 → 人工 Review 与获准修复 → 文案收敛。两模式读取同一规范；后续改动影响 Dialog 用法时局部复核，未变证据复用。关键决定变化同步简报；Wording 保留一致化规则，包括必要的解释性重复。首次独立走查不预读组件规则或前序发现。

### 不再维护

| Skill | 版本 | 它解决什么问题 | 关键边界 |
| --- | --- | --- | --- |
| [`aw-component-checker`](./aw-component-checker/) | `1.25.0` | 弃用的旧名称兼容入口，将指导/审查转发给 `aw-component-advisor` | 无组件规则、静态索引或知识兜底；旧编辑请求指向 AaronUI-Web 规范源；新入口缺失时明确报告 |

## 依赖与校验

完整主流程使用 `aw-design-orchestrator`，也可独立调用各 Skill。画布审查可单独使用。各自输入与授权边界以 `SKILL.md` 为准；交互走查需要浏览器访问，研究可能需要网络访问。

`aw-design-fake` 等设计支撑 Skill 仍在 [AaronSkill](https://github.com/AaronXu-Lab/AaronSkill)，需要时单独安装，不假设相邻仓库目录存在。Skill 维护使用 AaronSkill 中的 `aw-meta-skill` 和基础 `skill-creator` 校验器。

[AaronUI-Web 知识 MCP](https://github.com/AaronXu-Lab/AaronUI-Web/tree/main/mcp) 手动启动，提供 `list_documents({type?})` 和 `get_document({type,id})`。默认 Streamable HTTP 端点为 `http://127.0.0.1:7331/mcp`，端口可用 `MCP_PORT` 修改。在该仓库执行 `npm ci --prefix mcp` 安装依赖，再执行 `npm --prefix mcp start`，按服务文档配置宿主 MCP 客户端。无需云端服务、自动启动或外部设计生成器。

当前仅支持 `component/dialog`。Gallery 继续展示更多组件；Button、Input、ModalActions 可作为 Dialog 依赖使用真实 API，但没有独立知识覆盖。[Dialog 唯一规范](https://github.com/AaronXu-Lab/AaronUI-Web/blob/main/gallery/content/components/dialog.md) 同时服务 Gallery 和 MCP；精确 API/行为来自 TypeScript 源码。未知资源返回 `NOT_SUPPORTED_YET`，来源不可用、正文无效或行为证据缺失仍为待验证。Skill 不保存组件规则副本，也不回退旧 checker。旧包的整个 `references/components/` 目录与静态索引已移出当前包，Git 历史保留原文；非 Dialog 知识未迁移。响应和引用字段见 [访问契约](./aw-component-advisor/references/knowledge-access.md)。

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py ./<skill-name>
python3 /path/to/aw-meta-skill/scripts/validate_aw_skill.py ./<skill-name>
```

最初从 [AaronSkill 提交 0f430b6](https://github.com/AaronXu-Lab/AaronSkill/tree/0f430b6) 迁入，更早的历史保留在原仓库；活跃设计 Skill 在此维护。用户产品验收与 Skill 结构校验、工程检查分别记录。
