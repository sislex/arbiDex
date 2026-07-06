import { Module } from '@nestjs/common';
import { AgentSkillController } from './agent-skill.controller';
import { AgentSkillService } from './agent-skill.service';

@Module({
  controllers: [AgentSkillController],
  providers: [AgentSkillService],
})
export class AgentSkillModule {}
