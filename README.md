# Design Agent

[中文](./README.zh-CN.md) · English

Eight Skills for shaping UI/UX, reviewing interfaces, and walking through real user tasks.

## Install

```bash
npx skills@latest add AaronXu-Lab/Design-Agent
npx skills@latest add AaronXu-Lab/Design-Agent --skill aw-design-orchestrator
```

For local symlinks, run `python3 link-skills.py`; use `--dry-run` to preview or `--target` to select a Skills directory. Existing conflicting entries are preserved.

## Skills

### Design agents

Design agents that make interface decisions, conduct reviews, and improve communication quality.

| Skill | Version | What it does | Key boundaries |
| --- | --- | --- | --- |
| [`aw-design-orchestrator`](./aw-design-orchestrator/) | `1.0.0` | Coordinates the AW design workflow from varied requirements through initial UI generation, audits, task walkthrough, and wording review; offers standalone `/help` | Sequential orchestration only; preserves human review and fresh-session handoff; loads stage Skills as needed and reports missing dependencies; no optional enhancements |
| [`aw-design-shaping`](./aw-design-shaping/) | `1.1.0` | Shapes ideas, PRDs, and competitor references into an agreed UI/UX direction through focused questions, research, and wireframes | Users choose the exploration approach and key trade-offs; keeps the initial-generation brief aligned with later approved decisions and implementation status; no exhaustive state coverage or automatic production implementation |
| [`aw-canvas-design`](./aw-canvas-design/) | `1.7.0` | Reviews business steps and branches in flow mode, or tiles real pages, Dialogs, and Sheets for aligned comparison. Includes shared canvas-kit components plus separate flow and tiling models, module navigation, isolated previews, and explicit coverage records | Reuses existing project capabilities and shared presentation code. Tiling uses type Section Groups → direct business-module Items, one related flow per row, with source records and interactive coverage distinguished; business migration requires an explicit request |
| [`aw-component-checker`](./aw-component-checker/) | `1.24.1` | Reviews desktop component semantics, composition, and internal usage, and maintains the Component Reference and index | Loads relevant rules as needed; review alone does not rewrite code; not intended for visual-spec checks alone |
| [`aw-ux-info-redundancy-audit`](./aw-ux-info-redundancy-audit/) | `1.7.1` | Audits the information value, semantic duplication, appropriate stage, and visual necessity of UI/UX elements | Reports evidence and a minimal-change decision before implementing interface changes |
| [`aw-flow-completeness-audit`](./aw-flow-completeness-audit/) | `1.1.0` | Audits flow completeness across steps, branches, transitions, handoffs, recovery, and observable outcomes, with evidence and minimal completion proposals | Prioritizes implemented interfaces; records out-of-scope dependencies and unresolved product decisions; requires human review before implementing explicitly approved changes; synchronizes existing design briefs when key decisions change |
| [`aw-task-walkthrough`](./aw-task-walkthrough/) | `1.1.0` | Independently walks through user-selected tasks on interactive prototypes or working products to assess understanding, discoverability, task burden, and outcomes | Runs in a fresh session before wording review; the brief is only a supporting planning reference; may read the full PRD; defaults to a first-time product user who knows the domain; requires real interaction and reports problems with evidence for human review, without proposing fixes or changing the product by default |
| [`aw-wording-reviewer`](./aw-wording-reviewer/) | `0.13.0` | Reviews Simplified Chinese UI typography, terminology, formatting, cross-component data display, and microcopy | Reviews without editing by default; not for English or Japanese, or product information architecture reviews |

Use [`aw-design-orchestrator`](./aw-design-orchestrator/) as the workflow entry point; invoke it with `/help` for a standalone beginner guide.

Recommended sequence: design shaping → initial UI generation with the component library and DESIGN.md → information redundancy audit → component review → flow completeness audit → human review, approved fixes, and rechecks → independent task walkthrough → human review and approved fixes → wording review. Update the existing design brief when approved changes affect key decisions. Wording review retains its consistency rules, including necessary explanatory repetition.

## Dependencies and validation

Use `aw-design-orchestrator` for the main workflow or invoke each Skill independently. Canvas review is available separately. Read each `SKILL.md` for its inputs and authorization boundaries. Browser access is required for interactive walkthroughs; research may require network access.

Design support Skills such as `aw-design-fake` remain in [AaronSkill](https://github.com/AaronXu-Lab/AaronSkill). Install them separately when needed; do not assume adjacent repository directories exist. Skill maintenance uses `aw-meta-skill` from AaronSkill and the base `skill-creator` validator.

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py ./<skill-name>
python3 /path/to/aw-meta-skill/scripts/validate_aw_skill.py ./<skill-name>
```

Migrated unchanged from [AaronSkill commit 0f430b6](https://github.com/AaronXu-Lab/AaronSkill/tree/0f430b6). Versions, authors, workflows, and resources are preserved; earlier history remains in the source repository.
