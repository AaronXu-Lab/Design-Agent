---
name: aw-canvas-design
description: "Use an interactive canvas of real components to review business flows or tile pages, Dialogs, and Sheets for aligned design comparison, with isolated previews and explicit coverage. Not for plain flowcharts or styling a single dialog."
metadata:
  version: "1.17.0"
  author: "aaron_xu"
  creation_context: "源于在 ADM 画布中并列操作真实弹窗、分支与结果并通过评论迭代的实践，将可复用画布基础设施与多弹层业务设计分离，支持流程审查与设计平铺比较，以及不同业务和技术栈。"
---

# Canvas Design

在同一可操作画布中审阅真实页面与弹层，按意图选择两种模式：

- **流程模式 `flow`**：查看业务步骤、状态转移和分支；目录按主流程/其他流程及主、子、分支类型组织，详见 [flow 目录](references/canvas-presentation.md#flow-目录)；用有依据的节点、判断、连线和出口，采用适用的 ELK 分层布局与连线验收。
- **设计平铺模式 `tiles`**：收集页面、Dialog、Sheet 并对齐比较；用独立条目与场景清单、有序逐行布局和类型 → 业务模块目录，明确源码记录与真实交互预览。不能把它当作空边流程图继续套流程布局，也不虚构关系、入口旗或流程出口。

`/<业务路由>/design-canvas` 是 Step 1 的设计整理入口；流程用 `?preview={name}` 独立走查，平铺可用 `?item={id}` 独立查看条目。混合任务提供边界明确的两种视图，按各自模式验收。初始化即建立与实际页面共用的展示组件，分别注入业务或预览数据与回调；只有明确要求应用时，Step 2 才接入实际业务入口。

可选的“状态”Sidebar Section 仅在用户明确要求时启用，默认不触发；Section 按组件提供入口，画布只平铺所选组件自身的状态样式，操作弹窗留在业务流程中；真实弹窗组件本身也可作为明确的审阅对象。规则见[工作流](references/workflow.md#可选状态目录默认不启用)。

## 执行入口

先读 [执行工作流](references/workflow.md)，按任务选择资料：

| 当前任务 | 读取入口 |
| --- | --- |
| 新建画布或补齐基础设施 | [执行工作流](references/workflow.md#0-前置核实可复用的画布能力)：优先使用项目已有框架和依赖，只为实际缺口引入新依赖；局部修改不因参考版本不同而停下 |
| 只搭建环境，或发现现有能力缺失/失效 | [独立初始化模块](references/initialization.md)：检测复用、依赖与路由、隔离、操作、所选模式布局与共用交互；产出就绪记录 |
| 新流程或分支变化 | [流程建模](references/modeling.md)：实际入口、可达性、节点与覆盖表 |
| 收集、对齐或比较页面/弹层 | [平铺建模与比较](references/design-tiling.md)：类型/模块/行/条目模型、完整覆盖、比较尺度与目录规则 |
| 预览激活、回收或状态恢复 | [预览生命周期](references/preview-lifecycle.md) |
| 实现或修改预览组件 | [场景设计](references/component-design.md)：实际组件、字段、滚动、Fake 与条件式步骤 |
| 生成新画布，或调整卡片、目录、视口与图例 | 复制 [canvas-kit](assets/canvas-kit/) 的适用模式及共用部分再填数据：视觉以 HTML 标准件为准，逻辑以 `reference/` 为准，有设计系统时用其组件与 token 实现同等效果；规则见 [画布呈现规范](references/canvas-presentation.md) |
| 评论修改或明确要求业务迁移 | [评论与迁移](references/iteration-and-migration.md)：逐项闭环与授权边界 |
| 实现或修复节点标题栏预览入口 | [逐卡入口契约](references/workflow.md#节点容器打开预览入口)与 [kit 按钮](assets/canvas-kit/README.md#节点容器打开预览)：当前场景、真实 screen/item 路由、新标签及拖拽隔离 |
| 验收当前改动 | [验收矩阵](references/verification.md)：按影响范围验证并清理临时资源 |

已有画布先核实就绪记录；能力满足则跳过初始化细节，只在缺口处增量补齐。只初始化的请求以环境就绪为出口，不自动进入业务设计。

## 红线

画布、独立预览与实际页面共用同一展示组件和样式，交互预览隔离状态与副作用，不用截图或重复 UI 代替（[共享展示契约](references/workflow.md#从初始化建立同一套展示代码)）。画布认可不授权业务迁移，只有用户明确要求应用时才接入实际入口。

下图概览初始化复用、两种模式、设计闭环与迁移门槛，文本工作流为事实源。

![交互式画布双模式设计工作流](docs/workflow.svg)
