// Best-effort runtime telemetry for WebMCP tool invocations.
// Emits only the static tool name, outcome and duration — never arguments,
// results, errors, record IDs, user content or URLs.

type LovableEventsWindow = Window & {
  __lovableEvents?: (event: string, payload: Record<string, unknown>) => void;
};

export async function runWebMCPTool<T>(toolName: string, run: () => T | Promise<T>): Promise<T> {
  const started = performance.now();
  try {
    const result = await run();
    emit(toolName, "success", started);
    return result;
  } catch (error) {
    emit(toolName, "error", started);
    throw error;
  }
}

function emit(toolName: string, outcome: "success" | "error", started: number) {
  try {
    const events = (window as LovableEventsWindow).__lovableEvents;
    events?.("lovable.webmcp_tool_invoked", {
      tool: toolName,
      outcome,
      duration_ms: Math.round(performance.now() - started),
    });
  } catch {
    // Telemetry is best-effort; never break the tool.
  }
}
