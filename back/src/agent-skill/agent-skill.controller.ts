import { Controller, Get, Header } from '@nestjs/common';
import { AgentSkillService } from './agent-skill.service';

@Controller('agent-skill')
export class AgentSkillController {
  constructor(private readonly agentSkillService: AgentSkillService) {}

  @Get()
  @Header('Content-Type', 'text/markdown; charset=utf-8')
  getMarkdown(): string {
    return this.agentSkillService.getMarkdown();
  }

  @Get('json')
  getJson() {
    return this.agentSkillService.getJson();
  }
}
