import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

const SKILL_FILENAME = 'arbidex-assistant.skill.md';
const SPEC_FILENAME = 'arbidex-assistant.spec.json';
const SKILL_NAME = 'arbidex-assistant';
const SKILL_DESCRIPTION =
  'Read and manage the arbiDex configuration (servers, bots, jobs, pools, ' +
  'tokens, dexes, chains, pairs, rpc-urls) via the same REST API the frontend uses.';

@Injectable()
export class AgentSkillService {
  private readonly logger = new Logger(AgentSkillService.name);
  private readonly cache = new Map<string, string>();

  // Assets are copied next to the compiled JS (see nest-cli.json). Try the runtime
  // dir first, then fall back to the source/dist trees for `nest start`.
  private readAsset(filename: string): string {
    const cached = this.cache.get(filename);
    if (cached !== undefined) {
      return cached;
    }

    const candidates = [
      join(__dirname, filename),
      join(process.cwd(), 'dist', 'src', 'agent-skill', filename),
      join(process.cwd(), 'dist', 'agent-skill', filename),
      join(process.cwd(), 'src', 'agent-skill', filename),
    ];

    for (const path of candidates) {
      try {
        const content = readFileSync(path, 'utf-8');
        this.cache.set(filename, content);
        return content;
      } catch {
        // try next candidate
      }
    }

    this.logger.error(
      `Could not read ${filename} from any of: ${candidates.join(', ')}`,
    );
    throw new Error(`Agent skill asset "${filename}" is not available`);
  }

  getMarkdown(): string {
    return this.readAsset(SKILL_FILENAME);
  }

  getSpec(): unknown {
    return JSON.parse(this.readAsset(SPEC_FILENAME));
  }

  getJson() {
    return {
      name: SKILL_NAME,
      description: SKILL_DESCRIPTION,
      format: 'markdown',
      markdown: this.getMarkdown(),
      specUrl: '/agent-skill/spec',
    };
  }
}
