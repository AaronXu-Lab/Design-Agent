---
name: aw-flow-completeness-audit
description: "Audit user-flow completeness across steps, branches, state transitions, handoffs, recovery, and completion outcomes. Use to find missing behavior in implemented interfaces, prototypes, or flow designs; not for visual polish or task usability alone."
metadata:
  version: "1.3.0"
  author: "aaron_xu"
  creation_context: "初版界面经过信息、组件和文案检查后，仍可能遗漏流程分支、角色交接和中断恢复。为从实际入口追踪到任务结果，形成有证据的补全建议并经人工审阅后实施而创建。"
---

# 流程完整性审查

交付：流程完整性审计报告与待审事项；人工 Review 授权后完成选定补全与复查。

先读 [工作流](references/workflow.md)。完整审计或需要跨上下文续接时使用 [审计记录](references/audit-record.md)；维护方法时读 [来源与取舍](references/sources.md)。

**报告交付后必须等待人工 Review，即使初始请求已包含修复。**

![流程完整性审查：限定范围，追踪分支与结果，交付审计，人工 Review 后按授权实施与复查](docs/workflow.svg)
