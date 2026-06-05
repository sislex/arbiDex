export function normalizeServerForStore(server: any) {
  return {
    serverId: Number(server.serverId ?? server.id),
    ip: server.ip ?? '',
    port: server.port ?? '',
    serverName: server.serverName ?? server.name ?? '',
  };
}
