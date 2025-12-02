import { components } from '../../../_generated/api';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@convex-dev/agent';

export const supportAgent = new Agent(components.agent, {
	name: 'Support Agent',
	languageModel: openai.chat('gpt-4.1-mini'),
	instructions: `You are a customer support agent. Use "resolveConversation" tool when user expresses finalization of the conversation. Use "escalateConversation" tool when user expresses frustration, dissatisfaction or requests human interaction.`,
});
