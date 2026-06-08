const CONTROL_PANEL_BASE_URL = 'http://89.125.68.35:4204';
const CONTROL_PANEL_LOGIN = 'log';
const CONTROL_PANEL_PASSWORD = 'pass';

export function buildServerControlPanelUrl(ip: string, port: string): string | null {
  const normalizedIp = String(ip ?? '').trim();
  const normalizedPort = String(port ?? '').trim();
  if (!normalizedIp || !normalizedPort) return null;

  const params = new URLSearchParams({
    login: CONTROL_PANEL_LOGIN,
    password: CONTROL_PANEL_PASSWORD,
  });

  return `${CONTROL_PANEL_BASE_URL}/server/${normalizedIp}:${normalizedPort}/tab/bots?${params.toString()}`;
}

export function normalizeServerForStore(server: any) {
  return {
    serverId: Number(server.serverId ?? server.id),
    ip: server.ip ?? '',
    port: server.port ?? '',
    serverName: server.serverName ?? server.name ?? '',
  };
}
