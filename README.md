# Design Agent

[中文](./README.zh-CN.md) · English

Eight active Skills for shaping UI/UX, guiding and auditing component use, and walking through real user tasks, plus one deprecated compatibility entry (nine Skill directories in total).

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
| [`aw-design-orchestrator`](./aw-design-orchestrator/) | `1.1.0` | Coordinates shaping, live component guidance, AaronUI-Web implementation, audits, task walkthrough, and wording review; offers standalone `/help` | Sequential orchestration; preserves human review and fresh-session handoff; Dialog-only knowledge gaps are reported; later changes trigger only affected component rechecks |
| [`aw-design-shaping`](./aw-design-shaping/) | `1.2.0` | Shapes ideas, PRDs, and competitor references into an agreed UI/UX direction through focused questions, research, and wireframes | Users choose exploration and key trade-offs; keeps the brief aligned with approved decisions and implementation status; hands off to component guidance without copying rules or automatically implementing production UI |
| [`aw-canvas-design`](./aw-canvas-design/) | `1.8.0` | Reviews business branches in flow mode or tiles real pages, Dialogs, and Sheets for comparison, using shared canvas-kit components, isolated previews, and explicit coverage | Reuses project capabilities and shared presentation code; tiling uses type groups → business-module items, one related flow per row; distinguishes source records from interactive coverage; Dialog use changes receive focused guidance/audit; business migration requires an explicit request |
| [`aw-component-advisor`](./aw-component-advisor/) | `1.0.0` | Guides AaronUI-Web component use before implementation and audits existing use against the same live knowledge source | Currently supports Dialog; method-only Skill, no rule copies or old Reference fallback; source code is the precise API authority; uncovered and unverified work is not passed |
| [`aw-ux-info-redundancy-audit`](./aw-ux-info-redundancy-audit/) | `1.8.0` | Audits information value, semantic duplication, appropriate stage, and visual necessity | Reports evidence and minimal-change decisions before implementation; hands affected Dialog use to component audit without replacing information-value judgment |
| [`aw-flow-completeness-audit`](./aw-flow-completeness-audit/) | `1.2.0` | Audits steps, branches, transitions, handoffs, recovery, and observable outcomes, with evidence and minimal completion proposals | Prioritizes implemented interfaces; requires human review before approved fixes; updates existing briefs; Dialog use changes trigger focused component rechecks without replacing flow-result validation |
| [`aw-task-walkthrough`](./aw-task-walkthrough/) | `1.2.0` | Independently walks through user-selected tasks on interactive prototypes or working products to assess understanding, discoverability, burden, and outcomes | Fresh session before wording; full PRD allowed, brief only supports planning; no component rules or prior audit preloading; real interaction and human review; reports problems without fixes by default |
| [`aw-wording-reviewer`](./aw-wording-reviewer/) | `0.14.0` | Reviews Simplified Chinese typography, terminology, data display, and microcopy | Reviews without editing by default; component constraints are retrieved only when relevant; approved changes affecting Dialog use trigger focused audit; not for other languages or information architecture |

Use [`aw-design-orchestrator`](./aw-design-orchestrator/) as the workflow entry point; invoke it with `/help` for a standalone beginner guide.

Recommended sequence: shaping → `aw-component-advisor guidance` → current executor implements with real AaronUI-Web components and DESIGN.md → information redundancy audit → `aw-component-advisor audit` → flow completeness audit → human review and approved fixes → independent task walkthrough → human review and approved fixes → wording review. Guidance and audit use the same canonical document. Later changes affecting Dialog use trigger focused rechecks; unchanged evidence is reused. Update the brief when approved changes affect key decisions. Wording retains its consistency rules, including necessary explanatory repetition; the first independent walkthrough does not preload rules or prior findings.

### No longer maintained

| Skill | Version | What it does | Key boundaries |
| --- | --- | --- | --- |
| [`aw-component-checker`](./aw-component-checker/) | `1.25.0` | Deprecated old-name compatibility entry forwarding guidance/audit to `aw-component-advisor` | No component rules, static index, or knowledge fallback; old editing requests point to the AaronUI-Web source; missing new entry is reported |

## Dependencies and validation

Use `aw-design-orchestrator` for the main workflow or invoke each Skill independently. Canvas review is available separately. Read each `SKILL.md` for its inputs and authorization boundaries. Browser access is required for interactive walkthroughs; research may require network access.

Design support Skills such as `aw-design-fake` remain in [AaronSkill](https://github.com/AaronXu-Lab/AaronSkill). Install them separately when needed; do not assume adjacent repository directories exist. Skill maintenance uses `aw-meta-skill` from AaronSkill and the base `skill-creator` validator.

The [AaronUI-Web knowledge MCP](https://github.com/AaronXu-Lab/AaronUI-Web/tree/main/mcp) is started manually and provides `list_documents({type?})` and `get_document({type,id})`. The default Streamable HTTP endpoint is `http://127.0.0.1:7331/mcp` (`MCP_PORT` can change the port). In that repository, install dependencies with `npm ci --prefix mcp`, then run `npm --prefix mcp start`; configure the host's MCP client using its service documentation. No cloud service, autostart, or external design generator is required.

Only `component/dialog` is supported. Gallery continues to display more components; Button, Input, and ModalActions may be used as Dialog dependencies through real APIs without independent knowledge coverage. [Canonical Dialog content](https://github.com/AaronXu-Lab/AaronUI-Web/blob/main/gallery/content/components/dialog.md) serves Gallery and MCP; exact API/behavior comes from TypeScript source. Unknown resources return `NOT_SUPPORTED_YET`; unavailable sources, invalid documents, or missing behavior evidence remain unverified. Skills do not retain component-rule copies or fall back to the old checker. Its entire former `references/components/` directory and static index have been removed from the current package and remain in Git history; non-Dialog knowledge has not been migrated. See the advisor's [access contract](./aw-component-advisor/references/knowledge-access.md) for response and citation fields.

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py ./<skill-name>
python3 /path/to/aw-meta-skill/scripts/validate_aw_skill.py ./<skill-name>
```

Initially migrated from [AaronSkill commit 0f430b6](https://github.com/AaronXu-Lab/AaronSkill/tree/0f430b6); earlier history remains in the source repository. Active design Skills are maintained here. Human product acceptance is separate from structural Skill validation and engineering checks.
