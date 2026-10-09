# aw-design-orchestrator 使用帮助

这是整套设计流程的统一入口。你可以提供一份 PRD、几句模糊想法、竞品体验地址或产品名称，也可以混合提供。AI 会先与你对齐方向，再按顺序推进初版与审查。

## 怎么调用

在支持 Skill 的环境中选择 `aw-design-orchestrator`，或用该环境支持的 Skill 调用方式输入名称。以下是调用时附带的文本示例，具体命令外观取决于宿主：

```text
aw-design-orchestrator /help
aw-design-orchestrator 我想做一个团队素材库，参考这两个产品：……
aw-design-orchestrator 按这份 PRD，在当前项目完成设计流程：……
aw-design-orchestrator 继续，任务走查报告在：……
```

`/help` 只显示帮助，不启动任务，也不替你批准正在等待的阶段。开始工作时重新调用并附上需求；即使还没有完整 PRD 也可以开始。

## 会调用哪些 Skill

| 顺序 | Skill / 执行能力 | 它做什么 |
| --- | --- | --- |
| 1 | `aw-design-shaping` | 通过提问、竞品研究和线框图，与你确定要做什么、给谁用、怎样组织任务 |
| 2 | `aw-component-advisor guidance` | 从 AaronUI-Web 本地 MCP 读取当前规范，核实真实 API，指导组件用法；本轮只覆盖 Dialog |
| 3 | 当前执行者生成初版 | 使用 AaronUI-Web 的真实组件和 DESIGN.md，把确认的方向做成可以操作的界面；这不是独立 Skill，也不依赖外部设计生成服务 |
| 4 | `aw-ux-info-redundancy-audit` | 检查信息价值与重复，精简不必要表达 |
| 5 | `aw-component-advisor audit` | 使用与 guidance 相同的规范源，检查当前组件选择、组合和内部用法 |
| 6 | `aw-flow-completeness-audit` | 检查流程分支、中断、异常、交接和恢复是否有遗漏 |
| 7 | `aw-task-walkthrough` | 在独立新会话中，实际尝试你选定的任务，记录理解和操作障碍 |
| 8 | `aw-wording-reviewer` | 最后统一简体中文文案、术语和数据表达 |

## 什么时候需要你参与

- 塑形时回答关键问题、选择探索方式并确认方向。
- 流程完整性报告出来后，审阅并明确哪些建议需要实施。
- 按交接说明启动独立走查会话，选择任务，并审阅其报告。第一版不自动创建会话。
- 有未决产品取舍、必要资源缺失或超出既有授权的修改时，处理对应事项。

普通步骤会依次推进。缺失 Skill 或规范服务会被明确报告，不能把未执行、未覆盖或待验证算作通过。MCP 需手动启动，连接与命令查 AaronUI-Web 当前服务文档。Gallery 展示范围大于 MCP，本轮只有 `component/dialog`；Dialog 依赖的 Button、Input、ModalActions 可用真实 API 组合，但没有独立规范覆盖，不用旧 Reference 兜底。组件指导/审查面向 AaronUI-Web 用法，Wording 面向简体中文；其他目标说明适用性限制。

后续获准修复或文案改变 Dialog 用法时会局部复核，未变部分复用有效证据，不重跑整条流程。首次独立走查不预读组件规范和旧审查报告。旧 `aw-component-checker` 仅为弃用转发入口；编辑组件规范应维护 AaronUI-Web 的源文件。

最终得到当前界面入口、最新设计简报、审查报告和剩余事项。简报会随后续批准的关键决定更新。按需增强暂不包含在本入口中。
