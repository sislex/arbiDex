// src/discovery/discovery.controller.ts
import { Controller, Get, Header, Query } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { ApiEndpointDto } from './dto/api-endpoint.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('discovery')
@Controller('api/discovery')
export class DiscoveryController {
  constructor(private readonly service: DiscoveryService) {}

  @Get()
  @ApiOperation({ summary: 'Список доступных API-эндпоинтов (ручной каталог)' })
  @ApiOkResponse({ type: ApiEndpointDto, isArray: true })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Поиск по path/description',
  })
  @ApiQuery({ name: 'tag', required: false, description: 'Фильтр по тегу' })
  @ApiQuery({
    name: 'version',
    required: false,
    description: 'Фильтр по версии',
  })
  getCatalog(
    @Query('q') q?: string,
    @Query('tag') tag?: string,
    @Query('version') version?: string,
  ): ApiEndpointDto[] {
    return this.service.findFiltered(q, tag, version);
  }

  // HTML-таблица
  @Get('html')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @ApiOperation({ summary: 'HTML: таблица доступных API-эндпоинтов' })
  getCatalogHtml(
    @Query('q') q?: string,
    @Query('tag') tag?: string,
    @Query('version') version?: string,
  ): string {
    const data = this.service.findFiltered(q, tag, version);
    const esc = (s: unknown) =>
      String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const rows = data
      .map(
        (e) => `
      <tr>
        <td><code>${esc(e.method)}</code></td>
        <td>
          <code>
            <a href="http://localhost:3000${esc(e.path)}" target="_blank" rel="noopener noreferrer">
              ${esc(e.path)}
            </a>
          </code>
        </td>
        <td>${esc(e.description)}</td>
        <td>${(e.tags ?? []).map(esc).join(', ')}</td>
        <td>${esc(e.version ?? '')}</td>
      </tr>
    `,
      )
      .join('');

    return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>API Discovery</title>
  <style>
    :root { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    body { margin: 24px; }
    h1 { margin: 0 0 16px; font-size: 20px; }
    form { margin: 0 0 16px; display: grid; gap: 8px; grid-template-columns: repeat(4, minmax(140px, 1fr)) auto; align-items: end; }
    label { display: grid; gap: 4px; font-size: 12px; color: #444; }
    input { padding: 8px; border: 1px solid #ddd; border-radius: 8px; }
    button { padding: 10px 14px; border: 1px solid #111; background: #111; color: #fff; border-radius: 10px; cursor: pointer; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border-bottom: 1px solid #eee; text-align: left; padding: 10px 8px; vertical-align: top; }
    th { font-weight: 600; font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: .04em; }
    tr:hover { background: #fafafa; }
    code { background: #f6f6f6; padding: 2px 6px; border-radius: 6px; }
    .meta { margin-top: 8px; color: #555; font-size: 12px; }
  </style>
</head>
<body>
  <h1>API Discovery</h1>

  <form method="get" action="./html">
    <label>Поиск (path/description)
      <input type="text" name="q" value="${esc(q ?? '')}" placeholder="/api/users или users" />
    </label>
    <label>Тег
      <input type="text" name="tag" value="${esc(tag ?? '')}" placeholder="users, orders, infra..." />
    </label>
    <label>Версия
      <input type="text" name="version" value="${esc(version ?? '')}" placeholder="v1, v2..." />
    </label>
    <button type="submit">Фильтровать</button>
  </form>

  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Path</th>
        <th>Description</th>
        <th>Tags</th>
        <th>Version</th>
      </tr>
    </thead>
    <tbody>
      ${rows || `<tr><td colspan="5">Нет записей</td></tr>`}
    </tbody>
  </table>

  <div class="meta">Всего: ${data.length}</div>
</body>
</html>`;
  }
}
