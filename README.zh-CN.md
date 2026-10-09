# Design Agent

中文 · [English](./README.md)

收录 **8 个 Skill**，用于 UI/UX 设计塑形、界面审查与真实用户任务走查。

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
| [`aw-design-orchestrator`](./aw-design-orchestrator/) | `1.0.0` | 接收多种形式需求，顺序编排设计塑形、初版生成、审查、任务走查与文案收敛，提供独立 `/help` | 只编排主流程；保留人工 Review 与新会话交接，按阶段加载 Skill 并报告缺失依赖，不包含按需增强 |
| [`aw-design-shaping`](./aw-design-shaping/) | `1.1.0` | 通过聚焦追问、竞品研究与线框图，将想法、PRD 和参考共同塑形成可生成初版的 UI/UX 方向 | 用户选择探索方式并决定关键取舍；简报随后续已批准决定更新并记录实施状态，不穷举状态或自动实施正式界面 |
| [`aw-canvas-design`](./aw-canvas-design/) | `1.7.0` | 支持流程模式审查业务步骤与分支，及设计平铺模式收集、对齐比较真实页面、Dialog、Sheet；附带共用 canvas-kit 标准件、独立模式模型、模块目录、隔离预览与明确覆盖清单 | 优先复用项目能力与同一展示代码；平铺按类型 Section Group → 直接业务模块 Item，模块内一个相关流程一行，区分源码记录和真实交互覆盖；只有明确要求时才迁移到业务入口 |
| [`aw-component-checker`](./aw-component-checker/) | `1.24.1` | 审查桌面端组件的语义、组合与内部使用，并维护 Component Reference 和索引 | 按需读取相关规则；纯审查不自动改写；不用于单纯视觉规格检查 |
| [`aw-ux-info-redundancy-audit`](./aw-ux-info-redundancy-audit/) | `1.7.1` | 审计各类 UI/UX 的信息任务价值、语义重复、适用阶段与视觉承载物必要性 | 先输出审计证据与最小改动决策，再实施界面修改 |
| [`aw-flow-completeness-audit`](./aw-flow-completeness-audit/) | `1.1.0` | 从入口追踪步骤、分支、状态转换、角色交接、恢复与真实结果，交付有证据的流程补全建议 | 已实现界面优先；范围外记录依赖，业务规则缺失时提出方案；报告后强制人工 Review，审阅并明确授权后才实施；关键决定变化同步已有简报 |
| [`aw-task-walkthrough`](./aw-task-walkthrough/) | `1.1.0` | 在可交互原型或运行产品上独立走查用户选定的任务，判断理解、发现、任务负担与完成结果 | 文案收敛前以新会话执行，简报仅作辅助规划依据，可完整读取 PRD；默认面向懂业务的首次使用者；必须实际交互，交付问题与证据供人工 review，默认不提供修改方案或修改产品 |
| [`aw-wording-reviewer`](./aw-wording-reviewer/) | `0.13.0` | 审查简体中文 UI 的排版、术语、格式、跨组件数据展示与微文案 | 默认只审查不修改；不用于英文、日文或产品信息架构评审 |

统一入口为 [`aw-design-orchestrator`](./aw-design-orchestrator/)，调用时附带 `/help` 可单独查看新手帮助。

建议顺序：设计塑形 → 结合组件库与 DESIGN.md 生成初版 → 信息冗余审计 → 组件审查 → 流程完整性审查 → 人工 Review、获准修复与复查 → 独立任务走查 → 人工 Review 与获准修复 → Wording 文案收敛。已批准改动影响关键决定时同步已有设计简报；Wording 保留一致化规则，包括必要的解释性重复。

## 依赖与校验

完整主流程使用 `aw-design-orchestrator`，也可独立调用各 Skill。画布审查可单独使用。各自输入与授权边界以 `SKILL.md` 为准；交互走查需要浏览器访问，研究可能需要网络访问。

`aw-design-fake` 等设计支撑 Skill 仍在 [AaronSkill](https://github.com/AaronXu-Lab/AaronSkill)，需要时单独安装，不假设相邻仓库目录存在。Skill 维护使用 AaronSkill 中的 `aw-meta-skill` 和基础 `skill-creator` 校验器。

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py ./<skill-name>
python3 /path/to/aw-meta-skill/scripts/validate_aw_skill.py ./<skill-name>
```

从 [AaronSkill 提交 0f430b6](https://github.com/AaronXu-Lab/AaronSkill/tree/0f430b6) 原样迁入，保留版本、作者、工作流及资源；更早的历史保留在原仓库。
