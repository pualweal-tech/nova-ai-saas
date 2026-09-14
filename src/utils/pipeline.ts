import type { Artifacts, Project, TerminalEvent } from '../types'
import { clockStamp, nowIso, uid } from './ids'

function stamp() {
  return clockStamp()
}

export function pipelineReply(command: string, project: Project) {
  const idea = command.replace(/^\/\w+\s*/, '').trim() || project.idea || project.name
  const events: TerminalEvent[] = []
  const artifacts: Artifacts = { ...project.artifacts }
  const lower = command.toLowerCase()

  if (lower.startsWith('/export_json')) {
    events.push({
      id: uid('evt'),
      at: nowIso(),
      actor: 'DEV_Compiler',
      text: `[OK] ${stamp()} export package queued: ${project.id}.json`,
    })
    return { events, artifacts, complete: true, exported: true }
  }

  events.push({
    id: uid('evt'),
    at: nowIso(),
    actor: 'PM_Node_01',
    text: `接收到主指令。正在进行意图解析与结构化分解：\n- 模块划分: 三栏式固定布局 (Agents / Execution / Artifacts)\n- 语义定位: 精密生产工具，排除传统 Chat UI。\n- 状态定义: IDLE / STANDBY / PROCESSING / DEPLOYING\n目标：${idea}`,
  })
  artifacts.prd = `# ${project.name} PRD\n\n## Intent\n${idea}\n\n## Modules\n- Agent cluster\n- Execution terminal\n- Artifact panel\n\n## Success\nSequential Product → UX → Design → Code handoff with visible status.`

  events.push({
    id: uid('evt'),
    at: nowIso(),
    actor: 'UX_Architect',
    text: '用户流构建完成：Idea → Parse → Handoff → Review → Export。已写入 User Flow 面板。',
  })
  artifacts.userFlow = `1. Capture idea\n2. PM parse (module / semantic / state)\n3. UX architecture\n4. UI tokens\n5. Code compile\n6. Human accept or /refine_ui`

  events.push({
    id: uid('evt'),
    at: nowIso(),
    actor: 'UI_Engine',
    text: '_ 编译设计系统中... 提取 Tokens: background #131313, surface-elevated #121212, primary-container #0050CB.',
  })
  artifacts.designSystem = `Color Palette\n- Background #131313\n- Surface Elevated #121212\n- Primary Container #0050CB\n\nLayout Rules\n- Left_Panel (Agents): w-72\n- Right_Panel (Artifacts): w-420px\n- Center (Execution): flex-1`

  events.push({
    id: uid('evt'),
    at: nowIso(),
    actor: 'DEV_Compiler',
    text: '[OK] generated_layout.tsx 已写入 Code 面板。Cluster Status: Optimal.',
  })
  artifacts.code = `export const WorkspaceLayout = () => {
  return (
    <main className="flex h-screen w-full bg-background">
      <AgentSidebar />
      <ExecutionConsole className="flex-1" />
      <ArtifactPanel />
    </main>
  );
};`

  return { events, artifacts, complete: true, exported: false }
}
