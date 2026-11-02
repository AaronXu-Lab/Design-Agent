---
name: aw-design-orchestrator
description: "Coordinate AW design shaping, live component guidance, AaronUI-Web implementation, audits, independent task walkthrough, and wording review. Use for the full workflow or resuming it; /help explains the stages without starting work."
metadata:
  version: "1.6.0"
  author: "aaron_xu"
  creation_context: "为让用户通过一个入口提交不同形式的需求，顺序调用既有设计 Skill 并保留人工审阅与独立走查边界，同时提供初学者可单独查看的帮助而创建。"
---

# AW Design Orchestrator · 设计流程入口

先分流：

- **`/help`**：用户明确对本 Skill 发出帮助命令时，只读 [帮助](references/help.md) 并展示，不启动流程或推进待确认阶段。
- **开始 / 继续流程**：读取 [执行工作流](references/workflow.md)，按阶段加载并执行对应 Skill；仅要求局部专项时直接使用相应 Skill。

本 Skill 只维护阶段顺序、产物交接、授权关口、变更回流与续接状态；专项规则由对应 Skill 维护，不复制。

![设计流程入口：帮助单独结束；正常流程按序调用，保留人工审阅与新会话走查](docs/workflow.svg)
