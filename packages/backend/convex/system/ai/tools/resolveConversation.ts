import { createTool } from '@convex-dev/agent';
import { z } from 'zod';

import { internal } from '../../../_generated/api';
import { supportAgent } from '../agents/supportAgent';

export const resolveConversationTool = createTool({
	description: 'Resolve a conversation',
	args: z.object({}),
	handler: async (ctx) => {
		if (!ctx.threadId) {
			return 'Missing thread ID';
		}

		await ctx.runMutation(internal.system.conversation.resolve, {
			threadId: ctx.threadId,
		});

		await supportAgent.saveMessage(ctx, {
			threadId: ctx.threadId,
			message: {
				role: 'assistant',
				content: 'Conversation resolved',
			},
		});

		return 'Conversation resolved';
	},
});
