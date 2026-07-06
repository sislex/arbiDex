import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

const SKILL_FILENAME = 'arbidex-assistant.skill.md';
const SKILL_NAME = 'arbidex-assistant';
const SKILL_DESCRIPTION =
  'Read and manage the arbiDex configuration (servers, bots, jobs, pools, ' +
  'tokens, dexes, chains, pairs, rpc-urls) via the same REST API the frontend uses.';

@Injectable()
export class AgentSkillService {
  private readonly logger = new Logger(AgentSkillService.name);
  private cachedMarkdown: string | null = null;

  getMarkdown(): string {
    if (this.cachedMarkdown !== null) {
      return this.cachedMarkdown;
    }

    // The .md is copied next to the compiled JS (see nest-cli.json assets).
    // Try the runtime dir first, then fall back to the source tree for `nest start`.
    const candidates = [
      join(__dirname, SKILL_FILENAME),
      join(process.cwd(), 'dist', 'agent-skill', SKILL_FILENAME),
      join(process.cwd(), 'src', 'agent-skill', SKILL_FILENAME),
    ];

    for (const path of candidates) {
      try {
        this.cachedMarkdown = readFileSync(path, 'utf-8');
        return this.cachedMarkdown;
      } catch {
        // try next candidate
      }
    }

    this.logger.error(
      `Could not read ${SKILL_FILENAME} from any of: ${candidates.join(', ')}`,
    );
    throw new Error('Agent skill document is not available');
  }

  getJson() {
    return {
      name: SKILL_NAME,
      description: SKILL_DESCRIPTION,
      format: 'markdown',
      markdown: this.getMarkdown(),
    };
  }
}
