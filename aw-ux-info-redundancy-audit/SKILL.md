---
name: aw-ux-info-redundancy-audit
description: "Review information redundancy, density, and hierarchy in UI/UX, and provide evidence-based simplification decisions. Do not trigger for styling-only changes, literal translation, or code fixes that do not affect semantics."
metadata:
  version: "1.9.0"
  author: "aaron_xu"
  creation_context: "为在界面改动前系统识别语义重复、信息密度和层级问题，并形成可验证的最小安全改动决策而创建。"
---

# UI/UX 信息冗余审计

交付：基于当前任务的信息价值审计结论；已授权时完成获准的最小改动与验证。

| 当前任务 | 读取 |
| --- | --- |
| 任何审查 | [工作流](references/workflow.md)：证据边界、信息映射、决策与交付规模 |
| 多状态、跨表面、条件变化、摘要关系或装饰与操作难以区分 | [模式与示例](references/redundancy-patterns.md) 的相关小节 |
| 已授权实施 | [实施与验证](references/implementation.md) |

用途未明的内容保留待验证；必要业务、安全、恢复与无障碍语义不能因精简丢失。

![UI/UX 信息冗余审计工作流程](docs/workflow.svg)
