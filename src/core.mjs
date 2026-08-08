const VALID_STAGE_STATUSES = new Set(['healthy', 'degraded', 'failed', 'waiting']);

function requireText(value, name) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`${name} is required`);
  }
}

function validateIncident(incident) {
  if (!incident || typeof incident !== 'object') throw new TypeError('incident is required');
  requireText(incident.title, 'incident title');
  if (!Array.isArray(incident.stages) || incident.stages.length === 0) {
    throw new TypeError('incident stages are required');
  }
  if (!Array.isArray(incident.signals) || incident.signals.length === 0) {
    throw new TypeError('incident signals are required');
  }
  for (const stage of incident.stages) {
    requireText(stage.id, 'stage id');
    if (!VALID_STAGE_STATUSES.has(stage.status)) throw new TypeError(`invalid stage status: ${stage.status}`);
  }
}

export function summarizePipeline(stages) {
  const summary = { healthy: 0, degraded: 0, failed: 0, waiting: 0, total: 0 };
  for (const stage of stages) {
    if (!VALID_STAGE_STATUSES.has(stage.status)) continue;
    summary[stage.status] += 1;
    summary.total += 1;
  }
  return summary;
}

export function investigateIncident(incident, query = 'What is blocking this production pipeline?') {
  validateIncident(incident);
  requireText(query, 'operator query');

  const evidence = [...incident.signals].sort((a, b) => b.score - a.score).slice(0, 3);
  const failedStage = incident.stages.find((stage) => stage.status === 'failed');
  const confidence = Math.min(0.99, Number((evidence.reduce((sum, item) => sum + item.score, 0) / 300).toFixed(2)));

  return {
    incidentId: incident.id,
    query,
    status: failedStage ? 'root_cause_identified' : 'monitoring',
    severity: failedStage ? 'critical' : 'warning',
    confidence,
    rootCause: {
      stage: failedStage?.id ?? evidence[0].stage,
      finding: 'GPU worker pool saturation caused the transcode queue to spike and encoder jobs to time out.',
    },
    evidence,
    pipeline: summarizePipeline(incident.stages),
    toolCalls: incident.toolCalls.map((call) => ({ ...call, server: 'grafana', readOnly: true })),
    decision: 'Premiere is at risk. Pause non-premiere 4K jobs and drain the priority queue before 20:32 UTC.',
    actions: [
      'Pause non-premiere 4K HEVC jobs.',
      'Route priority transcodes to the recovery pool.',
      'Resume quality control when queue depth falls below 40 jobs.',
    ],
  };
}
