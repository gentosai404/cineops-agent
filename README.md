# CineOps Agent

Gemini-powered incident investigation agent for media-production pipelines.
Built for the Grafana track of the Agentic Cinema hackathon.

## Concept

CineOps investigates failures across upload, transcoding, subtitle, rendering,
and publishing stages. It uses Google Cloud/Gemini for reasoning and the
Grafana Cloud MCP server for live metrics, logs, traces, alerts, and dashboard
links.

## Status

Setup phase. Runtime agent and telemetry simulator are not implemented yet.

## Grafana MCP

Antigravity workspace configuration lives at:

```text
.agents/mcp_config.json
```

The first connection requires OAuth authorization in Antigravity. No Grafana
credential is stored in this repository.

Configured stack:

```text
https://breezycurlew2764.grafana.net
```

## License

MIT. See `LICENSE`.
