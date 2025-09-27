// src/discovery/discovery.controller.ts
import { Controller, Get, Header, Param } from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';
import { Quotes } from '../../db/entities/Quotes';
import { QuotesService } from '../../db/services/quotes/quotes.service';

@ApiTags('quotes')
@Controller('api/quotes')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService
  ) {}

  @Get('getLastQuotesByMarketId/:id')
  async getLastQuotesByMarketId(@Param('id') id: string): Promise<Quotes[]> {
    return await this.quotesService.getLastQuotesByMarketId(id);
  }

  @Get('html/getLastQuotesByMarketId/:id')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async getQuotesHtml(@Param('id') id: string): Promise<string> {
    const quotes = await this.quotesService.getLastQuotesByMarketId(id);

    const esc = (s: unknown) =>
      String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const rows = quotes
      .map(
        (q: Quotes) => `
    <tr>
      <td>${esc(q.id)}</td>
      <td>${esc(q.ts)}</td>
      <td>${esc(q.chainId)}</td>
      <td>${esc(q.dexId)}</td>
      <td>${esc(q.marketId)}</td>
      <td>${esc(q.side)}</td>
      <td>${esc(q.kind)}</td>
      <td>${esc(q.feeTier)}</td>
      <td>${(Number(q.amountBase) / 1e18).toFixed(4)}</td>
      <td>${q.amountQuote}</td>
      <td>${esc(q.latencyMs)} ms</td>
      <td>${esc(q.blockNumber)}</td>
    </tr>
  `,
      )
      .join('');

    return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Quotes Table</title>
  <style>
    body { font-family: sans-serif; margin: 24px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; font-size: 13px; }
    th { background: #f9f9f9; text-align: left; }
    tr:hover { background: #fafafa; }
  </style>
</head>
<body>
  <h1>Quotes (Market 3, Chain 42161)</h1>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Timestamp</th>
        <th>Chain</th>
        <th>DEX</th>
        <th>Market</th>
        <th>Side</th>
        <th>Kind</th>
        <th>Fee</th>
        <th>Base</th>
        <th>Quote</th>
        <th>Latency</th>
        <th>Block</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`;
  }

}
