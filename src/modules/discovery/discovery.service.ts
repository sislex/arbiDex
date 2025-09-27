import { Injectable } from '@nestjs/common';
import { ApiEndpointDto } from './dto/api-endpoint.dto';

@Injectable()
export class DiscoveryService {
  private readonly table: ApiEndpointDto[] = [
    {
      method: 'GET',
      path: '/api/discovery',
      description: 'List available API endpoints',
      tags: ['discovery'],
      version: 'v1',
    },
    {
      method: 'GET',
      path: '/api/getAllTokens',
      description: 'get all tokens',
      tags: ['tokens'],
      version: 'v1',
    },
    {
      method: 'GET',
      path: '/api/getAllDexes',
      description: 'Get all DEXes',
      tags: ['dexes'],
      version: 'v1',
    },
    {
      method: 'GET',
      path: '/api/getAllDexesPoolsTokens',
      description: 'Get all DEXes with pools and tokens',
      tags: ['dexes', 'pools', 'markets', 'tokens'],
      version: 'v1',
    },
    {
      method: 'GET',
      path: '/api/getAllWithExistPools',
      description: 'Get all DEXes with existing pools',
      tags: ['dexes', 'pools', 'markets', 'tokens'],
      version: 'v1',
    },
    {
      method: 'GET',
      path: '/api/quotes/getLastQuotesByMarketId/:id',
      description: 'Get last quotes by market ID',
      tags: ['quotes', 'markets'],
      version: 'v1',
    },
    {
      method: 'GET',
      path: '/api/quotes/html/getLastQuotesByMarketId/:id',
      description: 'Get last quotes by market ID',
      tags: ['quotes', 'markets'],
      version: 'v1',
    },
  ];

  getAll(): ApiEndpointDto[] {
    return this.table;
  }

  findFiltered(q?: string, tag?: string, version?: string): ApiEndpointDto[] {
    return this.table.filter(
      (e) =>
        (q
          ? e.path.includes(q) ||
            e.description.toLowerCase().includes(q.toLowerCase())
          : true) &&
        (tag ? e.tags?.includes(tag) : true) &&
        (version ? e.version === version : true),
    );
  }
}
