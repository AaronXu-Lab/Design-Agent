---
name: aw-design-shaping
description: "Shape product ideas, PRDs, or competitor references into an agreed UI/UX direction through focused questioning, competitor research, and wireframes. Use when direction is unclear or a feature's task flow needs rethinking; explicit tasks proceed directly to component guidance."
metadata:
  version: "1.4.0"
  author: "aaron_xu"
  creation_context: "为将不同成熟度的需求、想法与竞品参考，通过主动追问、研究和可视化讨论共同塑形成可交给初版界面生成的设计方向而创建。"
---

# AW Design Shaping · 设计塑形

与用户共同明确目标、任务与界面结构，交付可在组件库和 DESIGN.md 约束下生成初版的设计简报。先读 [工作流](references/workflow.md)，按当前问题选择追问、研究或可视化，不要求把所有输入补成 PRD，也不固定先问完再画图。

AaronUI-Web 主流程在塑形后交给 `aw-component-advisor guidance` 读取适用规范与 Example 参考，再由当前执行者使用真实组件生成。塑形仅在组件能力或 Example 会影响主方案时请求指导，常规塑形不提前读取全部 Example 实现，不保存组件规则或以旧 Reference 兜底。

| 当前任务 | 按需资料 |
| --- | --- |
| 给出竞品体验地址、产品名，或需要外部参照 | [竞品研究](references/competitor-research.md) |
| 需要线框图、布局对比或交互来消除分歧 | [可视化对齐](references/visual-alignment.md) |
| 维护本 Skill、核对借鉴方法的边界 | [方法来源与取舍](references/sources.md) |

关键取舍由用户决定，局部方案由 AI 先提出。仅在探索方式影响方向且未明确时询问，简单明确任务直接提炼方向并交接指导。事实、推断、提案与已确认决定分别表达；主方案明确后收敛，不穷举后续流程完整性审查。简报随后续已批准的关键决定更新，并区分批准与实际实施状态。AI 提案只补足规范与匹配 Example 未覆盖的部分；guidance 回校简报时按来源修正，不将行为要求冒充指定文案。以方向有明确需求或必要取舍确认依据、可交接简报为完成标准，探索原型不自动进入正式业务代码。

下图供人类概览；执行规则以文本工作流为准。

![设计塑形工作流：理解输入，按需追问、研究与可视化，确认方向后交付设计简报](docs/workflow.svg)
