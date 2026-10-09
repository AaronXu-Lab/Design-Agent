---
name: aw-component-advisor
description: "Guide AaronUI-Web component use before implementation and audit existing use against the same live knowledge source. Currently supports Dialog; not a visual-only review or component-rule editor."
metadata:
  version: "1.0.0"
  author: "aaron_xu"
  creation_context: "为以同一 AaronUI-Web 规范支持实现前的组件指导和实现后的用法审查而创建，将知识维护留在组件源项目，Skill 仅维护方法、证据与交接边界。"
---

# AW Component Advisor

先读 [工作流](references/workflow.md)，按当前任务选择：

- **`guidance`**：从用户任务和当前规范形成组件用法与验证计划，核实真实 API，供当前执行者使用 AaronUI-Web 真实组件实现。
- **`audit`**：对现有界面、设计或实现取证，核对组件语义、组合和内部用法，交付可追溯结论；已授权修复时完成相应修改与验证。

需要规范时读取 [知识访问契约](references/knowledge-access.md)。两模式通过手动启动的本地 MCP 读取同一源；本轮仅支持 `component/dialog`。Gallery 展示范围更广，Dialog 的依赖组件可按真实源码使用，但没有独立规范覆盖。未支持记为未覆盖，证据缺失记为待验证，不用旧 Reference 或内置规则兜底，不把两者算通过。

本包只保存方法，不编辑组件规范或同步静态索引。精确 props、导出和行为以当前 TypeScript 源码核实。沿用已有范围与授权，纯审查不自动改产品或规则；后续变更改变 Dialog 用法时局部复核。不能替代相邻 Skill 的职责或越过人工 Review。

下图为共用知识入口、两模式与证据缺口的概览，执行细则由工作流维护。

![组件指导与审查：同一规范源，guidance 与 audit 分流，未覆盖和待验证如实交付](docs/workflow.svg)
