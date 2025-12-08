import { openai } from '@ai-sdk/openai';
import { Agent } from '@convex-dev/agent';

import { SUPPORT_AGENT_PROMPT } from '../constants';
import { components } from '../../../_generated/api';

export const supportAgent = new Agent(components.agent, {
	name: 'Support Agent',
	languageModel: openai.chat('gpt-4.1-mini'),
	instructions: SUPPORT_AGENT_PROMPT,
});
